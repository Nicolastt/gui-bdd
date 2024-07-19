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


@app.route('/empleados', methods=['GET'])
def get_empleados():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT EMPLEADOID, EMP_EMPLEADOID, NOMBRE, APELLIDO, TO_CHAR(FECHA_NAC, 'YYYY-MM-DD'), EXTENSION
        FROM EMPLEADOS
    """)
    rows = cursor.fetchall()
    empleados = [
        {
            "empleado_id": row[0],
            "jefe_id": row[1],
            "nombre": row[2],
            "apellido": row[3],
            "fecha_nac": row[4],
            "extension": row[5]
        }
        for row in rows
    ]
    cursor.close()
    conn.close()
    return jsonify(empleados)


@app.route('/empleados', methods=['POST'])
def insert_empleado():
    new_empleado = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO EMPLEADOS (EMPLEADOID, EMP_EMPLEADOID, NOMBRE, APELLIDO, FECHA_NAC, EXTENSION)
        VALUES (:empleado_id, :jefe_id, :nombre, :apellido, TO_DATE(:fecha_nac, 'YYYY-MM-DD'), :extension)
    """, {
        'empleado_id': new_empleado['empleado_id'],
        'jefe_id': new_empleado['jefe_id'],
        'nombre': new_empleado['nombre'],
        'apellido': new_empleado['apellido'],
        'fecha_nac': new_empleado['fecha_nac'],
        'extension': new_empleado['extension']
    })
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify(new_empleado), 201


@app.route('/empleados/<int:empleado_id>', methods=['PUT'])
def update_empleado(empleado_id):
    updated_empleado = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE EMPLEADOS
        SET EMP_EMPLEADOID = :jefe_id,
            NOMBRE = :nombre,
            APELLIDO = :apellido,
            FECHA_NAC = TO_DATE(:fecha_nac, 'YYYY-MM-DD'),
            EXTENSION = :extension
        WHERE EMPLEADOID = :empleado_id
    """, {
        'jefe_id': updated_empleado['jefe_id'],
        'nombre': updated_empleado['nombre'],
        'apellido': updated_empleado['apellido'],
        'fecha_nac': updated_empleado['fecha_nac'],
        'extension': updated_empleado['extension'],
        'empleado_id': empleado_id
    })
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify(updated_empleado)


@app.route('/empleados/<int:empleado_id>', methods=['DELETE'])
def delete_empleado(empleado_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Verificar si el empleado es jefe de otros empleados
        cursor.execute("SELECT COUNT(*) FROM EMPLEADOS WHERE EMP_EMPLEADOID = :1", (empleado_id,))
        count = cursor.fetchone()[0]

        if count > 0:
            return jsonify({"message": "El empleado tiene subordinados y no puede ser eliminado!"}), 400

        # Eliminar el empleado
        cursor.execute("""
            DELETE FROM EMPLEADOS
            WHERE EMPLEADOID = :empleado_id
        """, {'empleado_id': empleado_id})
        conn.commit()
        cursor.close()
        conn.close()
        return '', 204
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return jsonify({"message": str(e)}), 500


@app.route('/ordenes', methods=['GET'])
def get_ordenes():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT ORDENID, CLIENTEID, EMPLEADOID, FECHAORDEN, DESCUENTO FROM ORDENES")
    rows = cursor.fetchall()
    ordenes = [
        {"ordenid": row[0], "clienteid": row[1], "empleadoid": row[2], "fechaorden": row[3].strftime('%Y-%m-%d'),
         "descuento": row[4]}
        for row in rows
    ]
    cursor.close()
    conn.close()
    return jsonify(ordenes)


@app.route('/ordenes', methods=['POST'])
def insert_orden():
    new_orden = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO ORDENES (ORDENID, CLIENTEID, EMPLEADOID, FECHAORDEN, DESCUENTO) VALUES (:1, :2, :3, TO_DATE(:4, 'YYYY-MM-DD'), :5)",
        (new_orden['ordenid'], new_orden['clienteid'], new_orden['empleadoid'], new_orden['fechaorden'],
         new_orden['descuento'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Orden insertada con éxito!"}), 201


@app.route('/ordenes/<int:id>', methods=['DELETE'])
def delete_orden(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM ORDENES WHERE ORDENID = :1", (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Orden eliminada con éxito!"}), 200


@app.route('/ordenes/<int:id>', methods=['PUT'])
def update_orden(id):
    updated_orden = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE ORDENES SET CLIENTEID = :1, EMPLEADOID = :2, FECHAORDEN = TO_DATE(:3, 'YYYY-MM-DD'), DESCUENTO = :4 WHERE ORDENID = :5",
        (updated_orden['clienteid'], updated_orden['empleadoid'], updated_orden['fechaorden'],
         updated_orden['descuento'], id)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Orden actualizada con éxito!"}), 200


if __name__ == '__main__':
    app.run(debug=True)
