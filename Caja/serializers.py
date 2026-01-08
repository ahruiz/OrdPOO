from rest_framework import serializers
from .models import Cajero, Administrator, Caja, Factura, ingresoCaja

class CajeroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cajero
        fields = "__all__"
        
class AdministratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrator
        fields = "__all__"
    
class CajaSerializer(serializers.ModelSerializer):
    class Meta:
        
        model = Caja
        fields = ["Cajero", "saldo_inicial", "saldo"]

    saldo = serializers.CharField(
    required=False,
    allow_blank=True,
    allow_null=True
    )    

class FacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factura
        fields = "__all__"

class IngresoCajaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ingresoCaja
        fields = ["Caja", "monto", "fecha", "descripcion"]

    descripcion = serializers.CharField(
    required=False,
    allow_blank=True,
    allow_null=True
    )    
        