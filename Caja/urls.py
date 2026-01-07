from django.urls import path, include
from rest_framework import routers
from .views import CajeroViewSet, CajaViewSet, FacturaViewSet, IngresoCajaViewSet

routers = routers.DefaultRouter()
routers.register(r'cajeros', CajeroViewSet, "Cajero")
routers.register(r'cajas', CajaViewSet, "Caja")
routers.register(r'facturas', FacturaViewSet, "Factura")
routers.register(r'ingresos', IngresoCajaViewSet, "IngresoCaja")

urlpatterns = routers.urls

