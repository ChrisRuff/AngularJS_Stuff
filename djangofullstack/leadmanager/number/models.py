from django.db import models

# Create your models here.
class Number(models.Model):
    image = models.CharField(max_length=500)
    prediction = models.CharField(max_length=3, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
