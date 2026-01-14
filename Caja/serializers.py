from os import read
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

class ingresoCajaSerializer(serializers.ModelSerializer):
    caja_id = serializers.IntegerField(source="caja.id")

    class Meta:
        model = ingresoCaja
        fields = ["id", "monto", "fecha", "descripcion", "caja_id"]
        
    descripcion = serializers.CharField(
        required=False,
        default="Reposición de caja chica"
    )
        