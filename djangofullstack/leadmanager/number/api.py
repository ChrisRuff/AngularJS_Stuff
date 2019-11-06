from number.models import Number
from rest_framework import viewsets, permissions
from .serializers import NumberSerializer

# Lead Viewset
class NumberViewSet(viewsets.ModelViewSet):
    queryset = Number.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = NumberSerializer
