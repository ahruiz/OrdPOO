from os import name
from sqlite3 import LEGACY_TRANSACTION_CONTROL
from django.db import models
from decimal import Decimal

class Usuario(models.Model):
    nombre = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_superadmin = models.BooleanField(default=False)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"
        ordering = ["-fecha_creacion"]
        db_table = "usuarios"
        indexes = [
            models.Index(fields=["email"], name="idx_usuario_email"),
        ]


class Admin(Usuario):
    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Administrador"
        verbose_name_plural = "Administradores"
        db_table = "administradores"


class Cajero(models.Model):
    name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=10)

class Administrator(models.Model):
    class AdminTypes(models.IntegerChoices):
        MANAGEMENT = (1, "Management")
        ASSISTANT = (2, "Assistant")
        
    Cajero = models.OneToOneField(Cajero, on_delete=models.CASCADE)
    type = models.IntegerField(
        choices=AdminTypes.choices,
        default=AdminTypes.ASSISTANT,
        verbose_name="Admin type"
    )
    
class Caja(models.Model):
    Cajero = models.OneToOneField(Cajero, on_delete=models.CASCADE)
    saldo_inicial = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    saldo = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00')) 
        
class Factura(models.Model):
    numFact = models.CharField(max_length=100, unique=True)
    proveedor = models.CharField(max_length=200)
    description = models.TextField()
    importe = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    departamento = models.CharField(max_length=200)

    aplicada = models.DecimalField(max_digits=10, decimal_places=0, default=Decimal('0'))
    numRepos = models.ForeignKey('ingresoCaja', on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return f"Factura {self.id}"
        
class ingresoCaja(models.Model):
    caja = models.ForeignKey(Caja, on_delete=models.CASCADE)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    facturs = models.CharField(max_length=255) # Campo para almacenar las facturas asociadas como una cadena de texto
    fecha = models.DateTimeField(auto_now_add=True)
    descripcion = models.CharField(default="Reposición de caja", max_length=255)