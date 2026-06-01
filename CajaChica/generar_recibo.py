from docxtpl import DocxTemplate
import datetime

# 1. Cargar la plantilla de Word
doc = DocxTemplate("plantilla_recibo.docx")

# 2. Aquí simulamos los datos que traerías de tu BDD (Django / SQL)
# (Puedes usar tu consulta a la base de datos para rellenar este diccionario)
datos_bdd = {
    "num_repos": "${ num_repos }",
    "fecha": datetime.datetime.now().strftime("%d/%m/%Y"),
    "caja_id": "${ caja_id }",
    "importe": "${ importe }",
    "descripcion": "${ descripcion }",
}

# 3. Inyectar los datos en la plantilla
doc.render(datos_bdd)

# 4. Guardar el archivo Word final generado
nombre_archivo = f"Recibo_{datos_bdd['num_repos']}.docx"
doc.save(nombre_archivo)

print(f"¡Recibo generado con éxito: {nombre_archivo}!")