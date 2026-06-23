from os import name
from sqlite3 import LEGACY_TRANSACTION_CONTROL
from django.db import models
from decimal import Decimal
from django.conf import settings

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
    descripcion = models.TextField()
    importe = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    departamento = models.CharField(max_length=200)

    aplicada = models.DecimalField(max_digits=10, decimal_places=0, default=Decimal('0'))
    numRepos = models.CharField(max_length=55, default="0") # Campo para almacenar el ID de reposición asociado a esta factura, si existe
    
    def __str__(self):
        return f"Factura {self.id}" 
        
class ingresoCaja(models.Model):
    caja = models.ForeignKey(Factura, on_delete=models.CASCADE)
    importe = models.DecimalField(max_digits=10, decimal_places=2)
    numFact = models.CharField(max_length=255) # Campo para almacenar las facturas asociadas como una cadena de texto
    fecha = models.DateTimeField(auto_now_add=True)
    descripcion = models.CharField(default="Reposición de caja", max_length=255)
    numRepos = models.CharField(max_length=55, default="0")

class ValeCaja(models.Model):
    ESTADO_CHOICES = [
        ('PENDIENTE', 'Pendiente de Descuento'),
        ('APLICADO', 'Descontado en Nómina'),
        ('CANCELADO', 'Cancelado / Sin Efecto'),
        ('SIN EFECTO', 'Sin Efecto / Solo Registro'),
    ]
    
    MOTIVO_CHOICES = [
        ('FALTANTE_ARQUEO', 'Faltante en Arqueo de Caja'),
        ('ANTICIPO', 'Anticipo / Préstamo Corto'),
        ('OTRO', 'Otro Motivo Descriptivo'),
    ]

    caja = models.ForeignKey('Caja', on_delete=models.CASCADE, related_name='vales')
    usuario_recibe = models.ForeignKey(Cajero, on_delete=models.PROTECT, related_name='vales_recibidos', help_text="Cajero responsable del faltante o deudor")
    usuario_autoriza = models.ForeignKey(Cajero, on_delete=models.PROTECT, related_name='vales_autorizados', help_text="Supervisor que detectó o autorizó el vale")
    
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    motivo = models.CharField(max_length=20, choices=MOTIVO_CHOICES, default='FALTANTE_ARQUEO')
    observaciones = models.TextField(blank=True, null=True, help_text="Detalles del descuadre o aclaraciones")
    estado = models.CharField(max_length=15, choices=ESTADO_CHOICES, default='PENDIENTE')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_aplicacion = models.DateTimeField(blank=True, null=True, help_text="Fecha en que nómina aplicó el descuento")

    class Meta:
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f"Vale #{self.id} - {self.usuario_recibe.name} ${self.monto}"
    
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Bitacora(models.Model):
    # Catálogo estricto de acciones para facilitar filtros y reportes futuros
    ACCIONES_CHOICES = [
        ('ALTA', 'Alta de Registro'),
        ('BAJA', 'Baja de Registro'),
        ('CAMBIO', 'Modificación'),
        ('LOGIN', 'Inicio de Sesión'),
        ('LOGOUT', 'Cierre de Sesión'),
        ('ARQUEO', 'Arqueo de Caja'),
        ('REPOSICION', 'Reposición de Fondos'),
        ('ERROR', 'Fallo o Excepción en Sistema'),
    ]

    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='bitacoras')
    accion = models.CharField(max_length=20, choices=ACCIONES_CHOICES)
    modulo = models.CharField(max_length=50, help_text="Ej: 'cajeros', 'cajas', 'facturas', 'acceso'")
    descripcion = models.TextField(help_text="Detalle legible de lo que se hizo")
    fecha_registro = models.DateTimeField(auto_now_add=True)
    
    # Campos opcionales (Solo se llenan si la acción involucra dinero o un objeto específico)
    monto = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    referencia_id = models.PositiveIntegerField(blank=True, null=True, help_text="ID del objeto afectado (Ej: id_factura)")

    class Meta:
        ordering = ['-fecha_registro'] # Las más recientes aparecen primero
        verbose_name = "Registro de Bitácora"
        verbose_name_plural = "Registros de Bitácora"

    def __str__(self):
        return f"{self.fecha_registro.strftime('%Y-%m-%d %H:%M:%S')} | {self.usuario} | {self.accion} | {self.modulo}"

#########monitoreo de acceso y de sesiones
from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from .models import Bitacora

@receiver(user_logged_in)
def registrar_acceso_usuario(sender, request, user, **kwargs):
    """
    Cada vez que CUALQUIER usuario inicie sesión con éxito en el sistema 
    (ya sea por formulario o API si maneja sesión), Django disparará esta función
    de manera automática.
    """
    Bitacora.objects.create(
        usuario=user,
        accion='LOGIN',
        modulo='acceso',
        descripcion=f"El usuario {user.username} ha ingresado al sistema."
    )