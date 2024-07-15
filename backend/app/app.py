import oracledb
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configuración de la conexión a Oracle
connection = oracledb.connect(
    user="gpupiales",
    password="gpupiales",
    dsn="Nicos:1522/orcl"
)


# Función para mostrar todas las categorías
@app.route('/categorias', methods=['GET'])
def show_categories():
    sql = "SELECT CATEGORIAID, NOMBRECAT FROM CATEGORIAS"
    with connection.cursor() as cursor:
        cursor.execute(sql)
        categories = cursor.fetchall()
    return jsonify(categories)


# Función para insertar una nueva categoría
@app.route('/categorias', methods=['POST'])
def insert_category():
    data = request.json
    category_id = data['categoriaid']
    category_name = data['nombrecat']

    sql = "INSERT INTO CATEGORIAS (CATEGORIAID, NOMBRECAT) VALUES (:1, :2)"
    with connection.cursor() as cursor:
        cursor.execute(sql, (category_id, category_name))
        connection.commit()

    return jsonify({'message': 'Categoría insertada correctamente'}), 201


# Función para actualizar una categoría
@app.route('/categorias/<int:categoriaid>', methods=['PUT'])
def update_category(categoriaid):
    data = request.json
    new_name = data['nombrecat']

    sql = "UPDATE CATEGORIAS SET NOMBRECAT = :1 WHERE CATEGORIAID = :2"
    with connection.cursor() as cursor:
        cursor.execute(sql, (new_name, categoriaid))
        connection.commit()

    return jsonify({'message': 'Categoría actualizada correctamente'})


# Función para eliminar una categoría
@app.route('/categorias/<int:categoriaid>', methods=['DELETE'])
def delete_category(categoriaid):
    sql = "DELETE FROM CATEGORIAS WHERE CATEGORIAID = :1"
    with connection.cursor() as cursor:
        cursor.execute(sql, (categoriaid,))
        connection.commit()

    return jsonify({'message': 'Categoría eliminada correctamente'})


if __name__ == '__main__':
    app.run(debug=True)
