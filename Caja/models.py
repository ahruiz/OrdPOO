from django.db import models

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
    saldo_inicial = models.DecimalField(max_digits=10, decimal_places=2)
    saldo = models.DecimalField(max_digits=10, decimal_places=2)
        
class Factura(models.Model):
    proveedor = models.CharField(max_length=200)
    description = models.TextField()
    importe = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    departamento = models.CharField(max_length=200)

    aplicada = models.BooleanField(default=False)
        
class ingresoCaja(models.Model):
    caja = models.ForeignKey(Caja, on_delete=models.CASCADE)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateTimeField(auto_now_add=True)
    descripcion = models.TextField()
    
