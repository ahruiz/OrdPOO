from django.contrib import admin
from .models import Usuario, Admin, Cajero, Administrator, Caja, Factura, ingresoCaja, ValeCaja

# Registra tus tablas una por una a la vieja escuela para ir a lo seguro:
admin.site.register(Usuario)
admin.site.register(Admin)
admin.site.register(Cajero)
admin.site.register(Administrator)
admin.site.register(Caja)
admin.site.register(Factura)
admin.site.register(ingresoCaja)
admin.site.register(ValeCaja)