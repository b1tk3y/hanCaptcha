from django.contrib import admin
from .models import MissChild


class UserAdmin(admin.ModelAdmin):
    list_display = ("name", "lost_age", "lost_date")


admin.site.register(MissChild, UserAdmin)
