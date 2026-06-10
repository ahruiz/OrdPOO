@echo off
cd /d "%~dp0"

echo ===================================================
echo [1/4] Activando Entorno Virtual (venv)...
echo ===================================================
call venv\Scripts\activate

echo.
echo ===================================================
echo [2/4] Recolectando archivos estaticos (Whitenoise)...
echo ===================================================
python manage.py collectstatic --noinput

echo.
echo ===================================================
echo [3/4] Verificando / Creando Superusuario (%USERNAME%)...
echo ===================================================
:: Usamos un script inline de Python para crear el usuario solo si no existe
python -c "import django; django.setup(); from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='ahruiz').exists() or User.objects.create_superuser('ahruiz', 'ahruiz0@gmail.com', 'admin123')"

echo.
echo ===================================================
echo [4/4] Iniciando Servidor Local de Caja Chica...
echo ===================================================
python manage.py runserver
start 127.0.0.1:8000
pause