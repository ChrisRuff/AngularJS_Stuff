from django.urls import path, include
from .api import NumberAPI

urlpatterns = [
    path('api/number', NumberAPI.as_view())
]
