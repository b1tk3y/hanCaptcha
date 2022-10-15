from django.db import models


def upload_to_photo(instance, filename):
    image_path = f"images/{instance.id}/{filename}"
    return image_path


class MissChild(models.Model):
    name = models.CharField(max_length=15, null=False, blank=False)
    photo = models.ImageField(upload_to=upload_to_photo, null=False, blank=False)
    lost_age = models.IntegerField(default=0)
    lost_location = models.CharField(max_length=255, null=True, blank=True)
    lost_date = models.DateField(null=True, blank=True)
    looking = models.TextField(null=True, blank=True)

    class Meta:
        verbose_name = "실종아동"
        verbose_name_plural = "실종아동"

    def save(self, *args, **kwargs):
        if self.id is None:
            tmp_photo = self.photo
            self.photo = None
            super().save(*args, **kwargs)
            self.photo = tmp_photo
            if "force_insert" in kwargs:
                kwargs.pop("force_insert")

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name}"
