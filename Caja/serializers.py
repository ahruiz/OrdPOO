from os import read
from rest_framework import serializers
from .models import Usuario, Admin, Cajero, Administrator, Caja, ValeCaja, Factura, ingresoCaja
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

class ValeCajaSerializer(serializers.ModelSerializer):
    # Campos dinámicos para simplificar el Frontend
    empleado_nombre = serializers.ReadOnlyField(source='usuario_recibe.first_name')
    empleado_apellido = serializers.ReadOnlyField(source='usuario_recibe.last_name')
    autoriza_nombre = serializers.ReadOnlyField(source='usuario_autoriza.first_name')
    motivo_display = serializers.CharField(source='get_motivo_display', read_only=True)
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)

    class Meta:
        model = ValeCaja
        fields = [
            'id', 'caja', 'usuario_recibe', 'empleado_nombre', 'empleado_apellido',
            'usuario_autoriza', 'autoriza_nombre', 'monto', 'motivo', 'motivo_display',
            'observaciones', 'estado', 'estado_display', 'fecha_creacion', 'fecha_aplicacion'
        ]
        read_only_fields = ['usuario_autoriza', 'fecha_creacion', 'fecha_aplicacion']

    def create(self, validated_data):
        # Inyectamos automáticamente al usuario logueado en el backend como el que autoriza
        request = self.context.get('request')
        if request and request.user:
            validated_data['usuario_autoriza'] = request.user
        return super().create(validated_data)
 

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