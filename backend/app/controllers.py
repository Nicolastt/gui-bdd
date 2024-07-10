from .models import Categoria, db

def get_all(model):
    return model.query.all()

def get_by_id(model, id):
    return model.query.get(id)

def create_instance(model, data):
    instance = model(**data)
    db.session.add(instance)
    db.session.commit()
    return instance

def update_instance(instance, data):
    for key, value in data.items():
        setattr(instance, key, value)
    db.session.commit()
    return instance

def delete_instance(instance):
    db.session.delete(instance)
    db.session.commit()
