"""
URL configuration for CajaChica project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),

    # Rutas para la aplicación de caja chica]
    path('api/', include('Caja.urls')),
    path('', TemplateView.as_view(template_name='acceso/index.html')),
    path('menuppal/', TemplateView.as_view(template_name='menuppal/p_ppal.html'), name='menu_ppal'),
    path('cajas/', TemplateView.as_view(template_name='cajas/cajas.html'), name='cajas'),
    path('alta/', TemplateView.as_view(template_name='cajas/alta.html'), name='alta'),
    path('baja/', TemplateView.as_view(template_name='cajas/baja.html'), name='baja'),
    path('cambios/', TemplateView.as_view(template_name='cajas/cambios.html'), name='cambios'),
    path('consulta/', TemplateView.as_view(template_name='cajas/consulta.html'), name='consulta'),
    path('aplic_fact/', TemplateView.as_view(template_name='cajas/aplic_fact.html'), name='aplic_fact'),
    path('gasto_tot/', TemplateView.as_view(template_name='cajas/gasto_tot.html'), name='gasto_tot'),
    path('vales/', TemplateView.as_view(template_name='cajas/vales.html'), name='vales'),
    path('cajeros/', TemplateView.as_view(template_name='cajeros/cajeros.html'), name='cajeros'),
    path('cajeros/alta/', TemplateView.as_view(template_name='cajeros/alta.html'), name='alta_cajero'),
    path('cajeros/baja/', TemplateView.as_view(template_name='cajeros/baja.html'), name='baja_cajero'),
    path('cajeros/cambios/', TemplateView.as_view(template_name='cajeros/cambios.html'), name='cambios_cajero'),
    path('cajeros/consulta/', TemplateView.as_view(template_name='cajeros/consultas.html'), name='consulta_cajeros'),
    path('facturas/', TemplateView.as_view(template_name='facturas/facturas.html'), name='facturas'),
    path('facturas/alta/', TemplateView.as_view(template_name='facturas/alta.html'), name='alta_factura'),
    path('facturas/baja/', TemplateView.as_view(template_name='facturas/baja.html'), name='baja_factura'),
    path('facturas/cambios/', TemplateView.as_view(template_name='facturas/cambios.html'), name='cambios_factura'),
    path('facturas/consulta/', TemplateView.as_view(template_name='facturas/consulta.html'), name='consulta_facturas'),
    path('ingresos/', TemplateView.as_view(template_name='ingresos/ingresos.html'), name='ingresos'),
    path('ingresos/reposicion/', TemplateView.as_view(template_name='ingresos/reposicion.html'), name='reposicion_ingreso'),
    path('ingresos/arqueo/', TemplateView.as_view(template_name='ingresos/arqueo.html'), name='arqueo_caja'),
]
