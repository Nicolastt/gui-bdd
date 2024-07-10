from flask import jsonify, request

from . import create_app
from .controllers import get_all, get_by_id, create_instance, update_instance, delete_instance
from .models import Categoria

app = create_app()


@app.route('/api/categorias', methods=['GET'])
def api_get_all():
    items = get_all(Categoria)
    return jsonify([item.__dict__ for item in items])


@app.route('/api/categorias/<int:id>', methods=['GET'])
def api_get_by_id(id):
    item = get_by_id(Categoria, id)
    return jsonify(item.__dict__)


@app.route('/api/categorias', methods=['POST'])
def api_create_instance():
    data = request.get_json()
    item = create_instance(Categoria, data)
    return jsonify(item.__dict__)


@app.route('/api/categorias/<int:id>', methods=['PUT'])
def api_update_instance(id):
    data = request.get_json()
    item = get_by_id(Categoria, id)
    updated_item = update_instance(item, data)
    return jsonify(updated_item.__dict__)


@app.route('/api/categorias/<int:id>', methods=['DELETE'])
def api_delete_instance(id):
    item = get_by_id(Categoria, id)
    delete_instance(item)
    return jsonify({'message': 'Item deleted'})


if __name__ == '__main__':
    app.run(debug=True)
