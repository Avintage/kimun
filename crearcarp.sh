#!/bin/zsh

# Solicitar al usuario los nombres de las carpetas
echo "Ingrese los nombres de las carpetas que desea crear (separe los nombres con espacios):"
read -r input
# Convertir la entrada en un array separado por espacios
IFS=" " read -A folder_names <<< "$input"

# Recorrer el array y crear las carpetas
for folder_name in "${folder_names[@]}"
do
    mkdir "$folder_name"
    echo "Carpeta \"$folder_name\" creada."
done

echo "Proceso completado."
