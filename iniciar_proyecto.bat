@echo off
title Lanzador de Proyecto - Servidor Local

@echo off
:: 1. Activar el entorno virtual usando el script correcto para CMD (.bat)
call c:\cajaChica\env\Scripts\activate.bat

:: 2. Asegurarnos de que django-cors-headers esté instalado en el entorno
pip install django-cors-headers

:: 3. Ejecutar el servidor de Django
start "" "http://127.0.0.1:8000"
python manage.py runserver


:: 4. INICIAR EL SERVIDOR DJANGO
:: Al ejecutar este comando, el script se quedará corriendo aquí y mantendrá la consola abierta
python manage.py runserver 127.0.0.1:8000

pause