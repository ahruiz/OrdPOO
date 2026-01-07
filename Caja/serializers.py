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
        fields = "__all__"
        
class FacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factura
        fields = "__all__"

class IngresoCajaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ingresoCaja
        fields = "__all__"
        
