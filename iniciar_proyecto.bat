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
python -c "import django; django.setup(); from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='ahruiz').exists() or User.objects.create_superuser('ahruiz0', 'ahruiz0@gmail.com', 'Arui.0140')"

echo.
echo ===================================================
echo [4/4] Iniciando Servidor Local de Caja Chica...
echo ===================================================
start "Servidor Django" cmd /k "python manage.py runserver"
timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:8000"
pause