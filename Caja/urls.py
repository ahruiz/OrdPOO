from django.urls import path, include
from rest_framework import routers
from .views import UsuarioViewSet, AdminViewSet, CajeroViewSet, CajaViewSet, ValeCajaViewSet, FacturaViewSet, IngresoCajaViewSet

routers = routers.DefaultRouter()
routers.register(r'usuarios', UsuarioViewSet, "Usuario")
routers.register(r'admins', AdminViewSet, "Admin")
routers.register(r'cajeros', CajeroViewSet, "Cajero")
routers.register(r'cajas', CajaViewSet, "Cajas")
routers.register(r'vales', ValeCajaViewSet, basename='vale-caja')
routers.register(r'facturas', FacturaViewSet, "Factura")
routers.register(r'ingresos', IngresoCajaViewSet, "IngresoCaja")

urlpatterns = routers.urls

