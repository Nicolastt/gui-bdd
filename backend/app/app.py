import logging

import oracledb
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configuración del logger para capturar y mostrar errores
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)


def get_db_connection():
    connection = oracledb.connect(
        user="gpupiales",
        password="gpupiales",
        dsn="Nicos:1522/orcl"
    )
    return connection


@app.route('/categorias', methods=['GET'])
def get_categorias():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT categoriaid, nombrecat FROM categorias")
        rows = cursor.fetchall()
        categorias = [{"id": row[0], "nombre": row[1]} for row in rows]
        cursor.close()
        conn.close()
        return jsonify(categorias)
    except Exception as e:
        logger.error("Error al obtener categorías: %s", str(e))
        return jsonify({"message": "Error al obtener categorías"}), 500


@app.route('/categorias', methods=['POST'])
def insert_categoria():
    try:
        new_categoria = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO categorias (categoriaid, nombrecat) VALUES (:1, :2)",
                       (new_categoria['id'], new_categoria['nombre']))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Categoria insertada con éxito!"}), 201
    except Exception as e:
        logger.error("Error al insertar categoría: %s", str(e))
        return jsonify({"message": "Error al insertar categoría"}), 500


@app.route('/categorias/<int:id>', methods=['DELETE'])
def delete_categoria(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM categorias WHERE categoriaid = :1", (id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Categoria eliminada con éxito!"}), 200
    except Exception as e:
        logger.error("Error al eliminar categoría: %s", str(e))
        return jsonify({"message": "Error al eliminar categoría"}), 500


@app.route('/categorias/<int:id>', methods=['PUT'])
def update_categoria(id):
    try:
        updated_categoria = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE categorias SET nombrecat = :1 WHERE categoriaid = :2",
                       (updated_categoria['nombre'], id))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Categoria actualizada con éxito!"}), 200
    except Exception as e:
        logger.error("Error al actualizar categoría: %s", str(e))
        return jsonify({"message": "Error al actualizar categoría"}), 500


@app.route('/clientes', methods=['GET'])
def get_clientes():
    try:
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
    except Exception as e:
        logger.error("Error al obtener clientes: %s", str(e))
        return jsonify({"message": "Error al obtener clientes"}), 500


@app.route('/clientes', methods=['POST'])
def insert_cliente():
    try:
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
    except Exception as e:
        logger.error("Error al insertar cliente: %s", str(e))
        return jsonify({"message": "Error al insertar cliente"}), 500


@app.route('/clientes/<int:id>', methods=['DELETE'])
def delete_cliente(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM CLIENTES WHERE CLIENTEID = :1", (id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Cliente eliminado con éxito!"}), 200
    except Exception as e:
        logger.error("Error al eliminar cliente: %s", str(e))
        return jsonify({"message": "Error al eliminar cliente"}), 500


@app.route('/clientes/<int:id>', methods=['PUT'])
def update_cliente(id):
    try:
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
    except Exception as e:
        logger.error("Error al actualizar cliente: %s", str(e))
        return jsonify({"message": "Error al actualizar cliente"}), 500


@app.route('/empleados', methods=['GET'])
def get_empleados():
    try:
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
    except Exception as e:
        logger.error("Error al obtener empleados: %s", str(e))
        return jsonify({"message": "Error al obtener empleados"}), 500


@app.route('/empleados', methods=['POST'])
def insert_empleado():
    try:
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
    except Exception as e:
        logger.error("Error al insertar empleado: %s", str(e))
        return jsonify({"message": "Error al insertar empleado"}), 500


@app.route('/empleados/<int:empleado_id>', methods=['PUT'])
def update_empleado(empleado_id):
    try:
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
        return jsonify({"message": "Empleado actualizado con éxito!"}), 200
    except Exception as e:
        logger.error("Error al actualizar empleado: %s", str(e))
        return jsonify({"message": "Error al actualizar empleado"}), 500


@app.route('/empleados/<int:empleado_id>', methods=['DELETE'])
def delete_empleado(empleado_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM EMPLEADOS WHERE EMPLEADOID = :empleado_id", {'empleado_id': empleado_id})
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Empleado eliminado con éxito!"}), 200
    except Exception as e:
        logger.error("Error al eliminar empleado: %s", str(e))
        return jsonify({"message": "Error al eliminar empleado"}), 500


@app.route('/proveedores', methods=['GET'])
def get_proveedores():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT PROVEEDORID, NOMBRECIA, NOMBRECONTACTO, DIRECCIONPROV, TELEFONOPROV, FAX, CIUDADPROV FROM PROVEEDORES")
        rows = cursor.fetchall()
        proveedores = [
            {"proveedorid": row[0], "nombrecia": row[1], "nombrecontacto": row[2], "direccionprov": row[3],
             "telefonoprov": row[4], "fax": row[5], "ciudadprov": row[6]} for row in rows]
        cursor.close()
        conn.close()
        return jsonify(proveedores)
    except Exception as e:
        logger.error("Error al obtener proveedores: %s", str(e))
        return jsonify({"message": "Error al obtener proveedores"}), 500


@app.route('/proveedores', methods=['POST'])
def insert_proveedor():
    try:
        new_proveedor = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO PROVEEDORES (PROVEEDORID, NOMBRECIA, NOMBRECONTACTO, DIRECCIONPROV, TELEFONOPROV, FAX, CIUDADPROV) VALUES (:1, :2, :3, :4, :5, :6, :7)",
            (new_proveedor['proveedorid'], new_proveedor['nombrecia'], new_proveedor['nombrecontacto'],
             new_proveedor['direccionprov'], new_proveedor['telefonoprov'], new_proveedor['fax'],
             new_proveedor['ciudadprov']))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Proveedor insertado con éxito!"}), 201
    except Exception as e:
        logger.error("Error al insertar proveedor: %s", str(e))
        return jsonify({"message": "Error al insertar proveedor"}), 500


@app.route('/proveedores/<int:id>', methods=['DELETE'])
def delete_proveedor(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM PROVEEDORES WHERE PROVEEDORID = :1", (id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Proveedor eliminado con éxito!"}), 200
    except Exception as e:
        logger.error("Error al eliminar proveedor: %s", str(e))
        return jsonify({"message": "Error al eliminar proveedor"}), 500


@app.route('/proveedores/<int:id>', methods=['PUT'])
def update_proveedor(id):
    try:
        updated_proveedor = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE PROVEEDORES SET NOMBRECIA = :1, NOMBRECONTACTO = :2, DIRECCIONPROV = :3, TELEFONOPROV = :4, FAX = :5, CIUDADPROV = :6 WHERE PROVEEDORID = :7",
            (updated_proveedor['nombrecia'], updated_proveedor['nombrecontacto'], updated_proveedor['direccionprov'],
             updated_proveedor['telefonoprov'], updated_proveedor['fax'], updated_proveedor['ciudadprov'], id))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Proveedor actualizado con éxito!"}), 200
    except Exception as e:
        logger.error("Error al actualizar proveedor: %s", str(e))
        return jsonify({"message": "Error al actualizar proveedor"}), 500


if __name__ == '__main__':
    app.run(debug=True)
