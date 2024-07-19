import oracledb
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


def get_db_connection():
    connection = oracledb.connect(
        user="gpupiales",
        password="gpupiales",
        dsn="Nicos:1522/orcl"
    )
    return connection


@app.route('/categorias', methods=['GET'])
def get_categorias():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT categoriaid, nombrecat FROM categorias")
    rows = cursor.fetchall()
    categorias = [{"id": row[0], "nombre": row[1]} for row in rows]
    cursor.close()
    conn.close()
    return jsonify(categorias)


@app.route('/categorias', methods=['POST'])
def insert_categoria():
    new_categoria = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO categorias (categoriaid, nombrecat) VALUES (:1, :2)",
                   (new_categoria['id'], new_categoria['nombre']))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Categoria insertada con éxito!"}), 201


@app.route('/categorias/<int:id>', methods=['DELETE'])
def delete_categoria(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM categorias WHERE categoriaid = :1", (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Categoria eliminada con éxito!"}), 200


@app.route('/categorias/<int:id>', methods=['PUT'])
def update_categoria(id):
    updated_categoria = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE categorias SET nombrecat = :1 WHERE categoriaid = :2",
                   (updated_categoria['nombre'], id))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Categoria actualizada con éxito!"}), 200


if __name__ == '__main__':
    app.run(debug=True)
