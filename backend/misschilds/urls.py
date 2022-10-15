from django.urls import path, re_path

from . import views

app_name = "misschilds"


urlpatterns = [
    path(
        "",
        views.MissChildAPIView.as_view(),
        name="misschild-api",
    ),
    re_path(
        r"validate/(?P<request_key>[_a-zA-Z0-9\-]+)",
        views.ValidateAPIView.as_view(),
        name="validate-api",
    ),
]
