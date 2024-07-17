from flask import Flask, jsonify
from flask_cors import CORS
import oracledb

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

if __name__ == '__main__':
    app.run(debug=True)
