from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include


def home(request):
    return JsonResponse({"status": "API running 🚀"})


urlpatterns = [
    path("", home),
    path("admin/", admin.site.urls),
    path("api/", include("users.urls")),
    path("api/", include("ideas.urls")),
]
