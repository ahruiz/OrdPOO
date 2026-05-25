import json
from turtle import pos
from webbrowser import get
from rest_framework import serializers
from django.shortcuts import render
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from decimal import Decimal
from django.shortcuts import get_object_or_404
from .models import Usuario, Admin, Cajero, Administrator, Caja, Factura, ingresoCaja
from .serializers import UsuarioSerializer, AdminSerializer,CajeroSerializer, AdministratorSerializer, CajaSerializer, FacturaSerializer, ingresoCajaSerializer


def _check_password(usuario, password):
    if not usuario or password is None:
        return False
    return usuario.password == str(password).strip()


def _get_by_email(model, email):
    if not email:
        return None
    return model.objects.filter(email__iexact=email.strip()).first()


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    @action(detail=True, methods=["get"])
    def get_usuario(self, request, pk=None):
        usuario = self.get_object()
        return Response(UsuarioSerializer(usuario).data)

    @action(detail=True, methods=["put"])
    def update_usuario(self, request, pk=None):
        usuario = self.get_object()
        serializer = UsuarioSerializer(usuario, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["delete"])
    def delete_usuario(self, request, pk=None):
        usuario = self.get_object()
        usuario.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=["post"])
    def create_usuario(self, request):
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["patch"])
    def partial_update_usuario(self, request, pk=None):
        usuario = self.get_object()
        serializer = UsuarioSerializer(usuario, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"])
    def login_usuario(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        usuario = _get_by_email(Usuario, email)
        if _check_password(usuario, password):
            return Response(UsuarioSerializer(usuario).data)
        return Response(
            {"detail": "Credenciales inválidas"},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    @action(detail=True, methods=["post"])
    def logout_usuario(self, request, pk=None):
        return Response(status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def change_password_usuario(self, request, pk=None):
        usuario = self.get_object()
        serializer = UsuarioSerializer(usuario, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def reset_password_usuario(self, request, pk=None):
        usuario = self.get_object()
        serializer = UsuarioSerializer(usuario, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"])
    def forgot_password_usuario(self, request):
        email = request.data.get("email")
        usuario = Usuario.objects.filter(email=email).first()
        if usuario:
            return Response({"detail": "Usuario encontrado", "email": usuario.email})
        return Response(
            {"detail": "Email no registrado"},
            status=status.HTTP_404_NOT_FOUND,
        )

    @action(detail=False, methods=["post"])
    def signup_usuario(self, request):
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"])
    def verify_email_usuario(self, request):
        email = request.data.get("email")
        exists = Usuario.objects.filter(email=email).exists()
        return Response({"email": email, "exists": exists})


class AdminViewSet(viewsets.ModelViewSet):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer

    @action(detail=False, methods=["post"])
    def login_admin(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        admin = _get_by_email(Admin, email)
        if _check_password(admin, password):
            return Response(AdminSerializer(admin).data)
        return Response(
            {"detail": "Credenciales inválidas"},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    @action(detail=True, methods=["post"])
    def logout_admin(self, request, pk=None):
        return Response(status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def get_admin(self, request, pk=None):
        admin = self.get_object()
        return Response(AdminSerializer(admin).data)


class CajeroViewSet(viewsets.ModelViewSet):
    queryset = Cajero.objects.all()
    serializer_class = CajeroSerializer
    
        
class AdministratorViewSet(viewsets.ModelViewSet):
    queryset = Administrator.objects.all()
    serializer_class = AdministratorSerializer

        
class CajaViewSet(viewsets.ModelViewSet):
    queryset = Caja.objects.all()
    serializer_class = CajaSerializer

    @action(detail=True, methods=["get"])
    def gasto_total(self, request, pk=None):
        caja = self.get_object()
        gastos = Factura.objects.filter(aplicada=True)
        total_gastos = sum(factura.importe for factura in gastos)
        tot_ingreso =  sum(ingreso.monto for ingreso in ingresoCaja.objects.filter(caja=caja)) 
        nom_cajero = caja.Cajero.name + " " + caja.Cajero.last_name

        return Response({
            "caja_id": caja.id,
            "nombre_cajero": nom_cajero,
            "saldo_inicial ": caja.saldo_inicial,
            "total_ingresos": tot_ingreso,
            "total_gastos  ": total_gastos,
            "saldo_actual  ": caja.saldo
        })
    
    @action(detail=True, methods=["post"])
    def aplic_fact(self, request, pk= None):
        caja = self.get_object()
        factura_id = request.data.get("factura_id","")
        numFact = request.data.get("numFact","")

        if not factura_id or not numFact: 
            return Response(
                {"error": "factura_id y numero de Factura son obligatorios"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        factura = get_object_or_404(Factura, id=factura_id) #se obtiene el objeto factura_id o da error 404 
        caja_id = get_object_or_404(Caja, id=pk).id #se obtiene el objeto caja_id o da error 404
            
        if factura.aplicada:
            return Response(
                {"error": "Esta factura ya fue aplicada"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if factura.importe > caja.saldo:
            return Response(
                {"error": "Saldo insuficiente"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Aplicar factura
        caja.saldo -= factura.importe
        caja.save()

        factura.aplicada = caja_id
        factura.save()

        return Response({
            "caja_id": caja.id,
            "factura_id": factura.id,
            "Numero de Factura": factura.numFact,
            "descripcion": factura.description,
            "saldo Inicial": caja.saldo_inicial,
            "saldo anterior": caja.saldo + factura.importe,
            "importe": factura.importe,
            "nuevo_saldo": caja.saldo
        })
    
class FacturaViewSet(viewsets.ModelViewSet):
    queryset = Factura.objects.all()
    serializer_class = FacturaSerializer
    
class IngresoCajaViewSet(viewsets.ModelViewSet):
    queryset = ingresoCaja.objects.all()
    serializer_class = ingresoCajaSerializer
    
    @action(detail=False, methods=["get"])
    def ingreso_total(self, request):
        ingresos = ingresoCaja.objects.all()
        total_ingresos = sum(i.monto for i in ingresos)

        return Response({
            "total_ingresos": total_ingresos
        })

    @action(detail=False, methods=["post"])
    def reposicion(self, request):
        caja_id = request.data.get("caja")
        monto_repos = request.data.get("monto")               
        descripcion = request.data.get("descripcion", "")

        if not caja_id or not monto_repos:
            return Response(
                {"error": "caja_id y monto son obligatorios"},
                status=status.HTTP_400_BAD_REQUEST
            )

        caja_id = get_object_or_404(Caja, id=caja_id)
        nom_cajero = caja_id.Cajero.name + " " + caja_id.Cajero.last_name
                        
        ingreso = ingresoCaja.objects.create(
            caja=caja_id,
            monto=Decimal(monto_repos),
            descripcion="Reposicion de caja chica " if descripcion == "" else descripcion
            )
        

        caja_id.saldo += Decimal(str(monto_repos))
        caja_id.save()
        
        return Response({ 
            "nombre cajero": nom_cajero,
            "saldo anterior": caja_id.saldo - Decimal(monto_repos),
            "monto": ingreso.monto,
            "descripcion": ingreso.descripcion,
            "nuevo_saldo": caja_id.saldo,
            "facturas": ingreso.facturs,
            "fecha": ingreso.fecha,
        }, status=status.HTTP_201_CREATED)
        
    @action(detail=False, methods=["delete"])
    def borrarRepos(self, request):
        id_ingreso = request.data.get("id")
        caja_id = request.data.get("caja")
        monto = request.data.get("monto")
        
        if not id_ingreso or not caja_id or not monto:
            return Response(
                {"error": "Reposicion, caja y monto son obligatorios"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        ingreso = get_object_or_404(ingresoCaja, id=id_ingreso)
        caja = get_object_or_404(Caja, id=caja_id)

        nom_cajero = f"{caja.Cajero.name} {caja.Cajero.last_name}"
        saldo_anterior = caja.saldo
        monto_temp = ingreso.monto
        desc_temp = ingreso.descripcion
        fecha_temp = ingreso.fecha

        caja.saldo -= Decimal(str(monto))
        caja.save()

        ingreso.delete()
        
        return Response({ 
            "nombre cajero": nom_cajero,
            "saldo_antes_de_borrar": saldo_anterior,
            "monto_revertido": monto_temp,
            "descripcion": desc_temp,
            "nuevo_saldo": caja.saldo,
            "fecha_registro": fecha_temp,
        }, status=status.HTTP_200_OK)