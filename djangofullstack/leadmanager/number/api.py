from number.models import Number
from rest_framework import generics, permissions
from rest_framework.response import Response
from .serializers import NumberSerializer
from .Base64ToImage import predict
# Number Viewset
class NumberAPI(generics.GenericAPIView):
    serializer_class = NumberSerializer

    def post(self, request, *args, **kwargs):
        # serializer = self.get_serializer(data=request.data)
        # serializer.is_valid(raise_exception=True)
        prediction = predict(request.data['image'])
        return Response({
            "prediction": prediction
        })

    permission_classes = [
        permissions.AllowAny
    ]
