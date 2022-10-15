import random
import secrets

from cryptography.fernet import Fernet
from django.core.cache import cache
from django.db.models import Max
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics
from rest_framework.response import Response

from .helpers import JamoSeparator
from .models import MissChild

FERNET_KEY = Fernet.generate_key()
f = Fernet(FERNET_KEY)


class MissChildAPIView(generics.RetrieveAPIView):
    queryset = MissChild.objects.all()

    def retrieve(self, request, *args, **kwargs):
        # TODO: cache max_id
        max_id = MissChild.objects.all().aggregate(max_id=Max("id"))["max_id"]
        while True:
            pk = random.randint(1, max_id)
            misschild = MissChild.objects.filter(pk=pk).first()
            if misschild:
                request_key = secrets.token_urlsafe()
                r = random.randint(
                    0, len(misschild.name) - 1
                )  # 이름 중 몇 번째 글자를 문제로 낼지 결정

                encrypted = f.encrypt(f"{r};{pk}".encode()).decode("utf-8")
                cache.set(request_key, encrypted, timeout=100)
                return Response(
                    {
                        "id": request_key,
                        "name": misschild.name,
                        "lost_age": misschild.lost_age,
                        "lost_date": misschild.lost_date,
                        "lost_location": misschild.lost_location,
                        "looking": misschild.looking,
                        "photo": misschild.photo.url,
                        "e": encrypted,
                        "i": r,
                    }
                )


class ValidateAPIView(generics.CreateAPIView):
    @method_decorator(csrf_exempt)
    def create(self, request, *args, **kwargs):
        request_key = request.data.get("id")
        cached_e = cache.get(request_key)

        e = request.data.get("e")
        if e is None or e != cached_e:
            return Response({"result": False}, status=400)

        decrypted = f.decrypt(e.encode()).decode("utf-8")
        r, pk = decrypted.split(";")
        misschild = MissChild.objects.get(pk=pk)
        _, *seq = request.data.get("seq").split(";")
        jamo_sep = JamoSeparator(misschild.name[int(r)])

        if jamo_sep.separate() != seq:
            return Response({"result": False}, status=400)
        return Response({"result": True})
