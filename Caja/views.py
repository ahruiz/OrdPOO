import json
from rest_framework import serializers
from datetime import datetime
from django.shortcuts import render
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from decimal import Decimal
from django.shortcuts import get_object_or_404
from .models import Cajero, Administrator, Caja, Factura, ingresoCaja
from .serializers import CajeroSerializer, AdministratorSerializer, CajaSerializer, FacturaSerializer, IngresoCajaSerializer

class CajeroViewSet(viewsets.ModelViewSet):
    queryset = Cajero.objects.all()
    serializer_class = CajeroSerializer
        
class AdministratorViewSet(viewsets.ModelViewSet):
    queryset = Administrator.objects.all()
    serializer_class = AdministratorSerializer

        
class CajaViewSet(viewsets.ModelViewSet):
    queryset = Caja.objects.all()
    serializer_class = CajaSerializer

    @action(detail=True, methods=["post"])
    def aplic_fact(self, request, pk= None):
        caja = self.get_object()
        factura_id = request.data.get("factura_id","")

        if not factura_id:
            return Response(
                {"error": "factura_id es obligatorio"},
                status=status.HTTP_400_BAD_REQUEST
            )

        factura = get_object_or_404(Factura, id=factura_id) #se obtiene el objeto factura_id o da error 404 
        
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

        factura.aplicada = True
        factura.save()

        return Response({
            "caja_id": caja.id,
            "factura_id": factura.id,
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
    serializer_class = IngresoCajaSerializer
    
    @action(detail=False, methods=["post"])
    def agregar_ingreso(self, request):
        caja_id = request.data.get("caja_id")
        monto = request.data.get("monto")               
        descripcion = request.data.get("descripcion", "")

        if not caja_id or not monto:
            return Response(
                {"error": "caja_id y monto son obligatorios"},
                status=status.HTTP_400_BAD_REQUEST
            )

        caja = get_object_or_404(Caja, id=caja_id)
                 
        ingreso = ingresoCaja.objects.create(
            caja=caja,
            monto=Decimal(monto),
            descripcion=descripcion
        )

        caja.saldo += Decimal(monto)
        caja.save()

        return Response({
            "ingreso_id": ingreso.id,
            "saldo anterior": caja.saldo - Decimal(monto),
            "monto": ingreso.monto,
            "caja_id": caja.id,
            "nuevo_saldo": caja.saldo,
            "fecha": ingreso.fecha,
        }, status=status.HTTP_201_CREATED)
        
        
# actividades de la caja chica
# crear cajero
# crear caja
# crear factura
# aplicar factura
# provocar saldo insuficiente
# agregar ingreso a la caja (reposicion)
# consultar caja y cajero
# consultar saldo de la caja
# consultar historial de ingresos y gastos
# consultar facturas aplicadas y pendientes
# eliminar registros (cajero, caja, factura, ingreso)
# modificar datos (cajero, caja, factura, ingreso) 
