from rest_framework import routers
from .api import NumberViewSet

router = routers.DefaultRouter()
router.register('api/number', NumberViewSet, 'number')
urlpatterns = router.urls
