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
    cursor.execute("SELECT categoriaid, nombrecat FROM categorias ORDER BY categoriaid ASC")
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
        "SELECT CLIENTEID, CEDULA_RUC, NOMBRECIA, NOMBRECONTACTO, DIRECCIONCLI, CELULAR, CIUDADCLI FROM CLIENTES ORDER BY CLIENTEID ASC")
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
        ORDER BY EMPLEADOID ASC
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
    cursor.execute("SELECT ORDENID, CLIENTEID, EMPLEADOID, FECHAORDEN, DESCUENTO FROM ORDENES ORDER BY ORDENID ASC")
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


@app.route('/proveedores', methods=['GET'])
def get_proveedores():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT proveedorid, nombreprov, contacto, celuprov, ciudadprov FROM proveedores ORDER BY proveedorid ASC")
    rows = cursor.fetchall()
    proveedores = [{"id": row[0], "nombre": row[1], "contacto": row[2], "celular": row[3], "ciudad": row[4]} for row in
                   rows]
    cursor.close()
    conn.close()
    return jsonify(proveedores)


@app.route('/proveedores', methods=['POST'])
def insert_proveedor():
    new_proveedor = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO proveedores (proveedorid, nombreprov, contacto, celuprov, ciudadprov) VALUES (:1, :2, :3, :4, :5)",
        (new_proveedor['id'], new_proveedor['nombre'], new_proveedor['contacto'], new_proveedor['celular'],
         new_proveedor['ciudad']))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Proveedor insertado con éxito!"}), 201


@app.route('/proveedores/<int:id>', methods=['DELETE'])
def delete_proveedor(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM proveedores WHERE proveedorid = :1", (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Proveedor eliminado con éxito!"}), 200


@app.route('/proveedores/<int:id>', methods=['PUT'])
def update_proveedor(id):
    updated_proveedor = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE proveedores SET nombreprov = :1, contacto = :2, celuprov = :3, ciudadprov = :4 WHERE proveedorid = :5",
        (updated_proveedor['nombre'], updated_proveedor['contacto'], updated_proveedor['celular'],
         updated_proveedor['ciudad'], id))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Proveedor actualizado con éxito!"}), 200


@app.route('/productos', methods=['GET'])
def get_productos():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT PRODUCTOID, CATEGORIAID, PROVEEDORID, DESCRIPCION, PRECIOUNIT, EXISTENCIA 
    FROM PRODUCTOS 
    ORDER BY PRODUCTOID ASC""")

    rows = cursor.fetchall()
    productos = [
        {
            "id": row[0],
            "categoria_id": row[1],
            "proveedor_id": row[2],
            "descripcion": row[3],
            "precio_unit": row[4],
            "existencia": row[5]
        } for row in rows
    ]
    cursor.close()
    conn.close()
    return jsonify(productos)


@app.route('/productos', methods=['POST'])
def insert_producto():
    new_producto = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO PRODUCTOS (PRODUCTOID, CATEGORIAID, PROVEEDORID, DESCRIPCION, PRECIOUNIT, EXISTENCIA) VALUES (:1, :2, :3, :4, :5, :6)",
        (new_producto['id'], new_producto['categoria_id'], new_producto['proveedor_id'], new_producto['descripcion'],
         new_producto['precio_unit'], new_producto['existencia'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Producto insertado con éxito!"}), 201


@app.route('/productos/<int:id>', methods=['DELETE'])
def delete_producto(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM PRODUCTOS WHERE PRODUCTOID = :1", (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Producto eliminado con éxito!"}), 200


@app.route('/productos/<int:id>', methods=['PUT'])
def update_producto(id):
    updated_producto = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE PRODUCTOS SET CATEGORIAID = :1, PROVEEDORID = :2, DESCRIPCION = :3, PRECIOUNIT = :4, EXISTENCIA = :5 WHERE PRODUCTOID = :6",
        (updated_producto['categoria_id'], updated_producto['proveedor_id'], updated_producto['descripcion'],
         updated_producto['precio_unit'], updated_producto['existencia'], id)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Producto actualizado con éxito!"}), 200


@app.route('/detalleordenes', methods=['GET'])
def get_detalle_ordenes():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT ORDENID, DETALLEID, PRODUCTOID, CANTIDAD
        FROM DETALLE_ORDENES
        ORDER BY ORDENID ASC
    """)
    rows = cursor.fetchall()
    detalles = [{"ordenid": row[0], "detalleid": row[1], "productoid": row[2], "cantidad": row[3]} for row in rows]
    cursor.close()
    conn.close()
    return jsonify(detalles)


@app.route('/detalleordenes', methods=['POST'])
def insert_detalle_orden():
    new_detalle = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO DETALLE_ORDENES (ORDENID, DETALLEID, PRODUCTOID, CANTIDAD)
        VALUES (:1, :2, :3, :4)
    """, (new_detalle['ordenid'], new_detalle['detalleid'], new_detalle['productoid'], new_detalle['cantidad']))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Detalle de orden insertado con éxito!"}), 201


@app.route('/detalleordenes/<int:ordenid>/<int:detalleid>', methods=['DELETE'])
def delete_detalle_orden(ordenid, detalleid):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        DELETE FROM DETALLE_ORDENES
        WHERE ORDENID = :1 AND DETALLEID = :2
    """, (ordenid, detalleid))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Detalle de orden eliminado con éxito!"}), 200


@app.route('/detalleordenes/<int:ordenid>/<int:detalleid>', methods=['PUT'])
def update_detalle_orden(ordenid, detalleid):
    updated_detalle = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE DETALLE_ORDENES
        SET PRODUCTOID = :1, CANTIDAD = :2
        WHERE ORDENID = :3 AND DETALLEID = :4
    """, (updated_detalle['productoid'], updated_detalle['cantidad'], ordenid, detalleid))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Detalle de orden actualizado con éxito!"}), 200

# Comentario en audotoria
@app.route('/auditoria', methods=['GET'])
def get_auditoria():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT user_name, fecha, tipo_operacion, nombre_table, anterior, nuevo 
        FROM auditoria
        ORDER BY audit_id ASC
    """)
    rows = cursor.fetchall()
    auditoria = [
        {
            "user_name": row[0],
            "fecha": row[1].strftime('%Y-%m-%d'),
            "tipo_operacion": row[2],
            "nombre_table": row[3],
            "anterior": row[4],
            "nuevo": row[5]
        } for row in rows
    ]
    cursor.close()
    conn.close()
    return jsonify(auditoria)



if __name__ == '__main__':
    app.run(debug=True)
