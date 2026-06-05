from os import read
from rest_framework import serializers
from .models import Usuario, Admin, Cajero, Administrator, Caja, Factura, ingresoCaja
from Caja.models import Usuario, Admin, Cajero, Administrator, Caja, Factura, ingresoCaja


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ["id", "nombre", "email", "password"]

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = "__all__"

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
        fields = ["id", "Cajero", "saldo_inicial", "saldo"]
 

class FacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factura
        fields = ["id", "numFact", "proveedor", "descripcion", "importe", "departamento", "aplicada","numRepos"]

        extra_kwargs = {
            'aplicada': {'required': False}
        }

class ingresoCajaSerializer(serializers.ModelSerializer):
    caja = serializers.PrimaryKeyRelatedField(queryset=Factura.objects.all())

    class Meta:
        model = ingresoCaja
        fields = ["id", "caja", "importe", "numFact", "descripcion", "numRepos"]
    
        extra_kwargs = {"numFact":{"required":False, "allow_null": True}}
        
    descripcion = serializers.CharField(
        required=False,
        default="Reposición de caja chica"
    )