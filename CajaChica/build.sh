#!/usr/bin/env bash
# Salir de inmediato si un comando falla
set -o errexit

# Instalar dependencias
pip install -r requirements.txt

# Recopilar archivos estáticos (opcional, pero recomendado en producción)
python manage.py collectstatic --no-input

# Aplicar migraciones a PostgreSQL
python manage.py migrate

python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@email.com', 'admin123')"