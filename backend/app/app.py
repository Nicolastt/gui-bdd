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


@app.route('/clientes', methods=['GET'])
def get_clientes():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT CLIENTEID, CEDULA_RUC, NOMBRECIA, NOMBRECONTACTO, DIRECCIONCLI, CELULAR, CIUDADCLI FROM CLIENTES")
    rows = cursor.fetchall()
    clientes = [
        {"id": row[0], "cedula_ruc": row[1], "nombrecia": row[2], "nombrecontacto": row[3], "direccioncli": row[4],
         "celular": row[5], "ciudadcli": row[6]} for row in rows]
    cursor.close()
    conn.close()
    return jsonify(clientes)


@app.route('/clientes', methods=['POST'])
def insert_cliente():
    new_cliente = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO CLIENTES (CLIENTEID, CEDULA_RUC, NOMBRECIA, NOMBRECONTACTO, DIRECCIONCLI, CELULAR, CIUDADCLI) VALUES (:1, :2, :3, :4, :5, :6, :7)",
        (new_cliente['id'], new_cliente['cedula_ruc'], new_cliente['nombrecia'], new_cliente['nombrecontacto'],
         new_cliente['direccioncli'], new_cliente['celular'], new_cliente['ciudadcli']))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Cliente insertado con éxito!"}), 201


@app.route('/clientes/<int:id>', methods=['DELETE'])
def delete_cliente(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM CLIENTES WHERE CLIENTEID = :1", (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Cliente eliminado con éxito!"}), 200


@app.route('/clientes/<int:id>', methods=['PUT'])
def update_cliente(id):
    updated_cliente = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE CLIENTES SET CEDULA_RUC = :1, NOMBRECIA = :2, NOMBRECONTACTO = :3, DIRECCIONCLI = :4, CELULAR = :5, CIUDADCLI = :6 WHERE CLIENTEID = :7",
        (updated_cliente['cedula_ruc'], updated_cliente['nombrecia'], updated_cliente['nombrecontacto'],
         updated_cliente['direccioncli'], updated_cliente['celular'], updated_cliente['ciudadcli'], id))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Cliente actualizado con éxito!"}), 200


if __name__ == '__main__':
    app.run(debug=True)
