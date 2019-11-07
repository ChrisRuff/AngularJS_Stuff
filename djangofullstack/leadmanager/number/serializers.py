from rest_framework import serializers
from number.models import Number
#lead serializer
class NumberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Number
        fields = "__all__"
