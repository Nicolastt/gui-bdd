from . import db

class Categoria(db.Model):
    __tablename__ = 'CATEGORIAS'
    CATEGORIAID = db.Column(db.Integer, primary_key=True)
    NOMBRECAT = db.Column(db.String(50), nullable=False)

class Cliente(db.Model):
    __tablename__ = 'CLIENTES'
    CLIENTEID = db.Column(db.Integer, primary_key=True)
    CEDULA_RUC = db.Column(db.String(10), nullable=False)
    NOMBRECIA = db.Column(db.String(30), nullable=False)
    NOMBRECONTACTO = db.Column(db.String(50), nullable=False)
    DIRECCIONCLI = db.Column(db.String(50), nullable=False)
    CELULAR = db.Column(db.String(12))
    CIUDADCLI = db.Column(db.String(20))

class Empleado(db.Model):
    __tablename__ = 'EMPLEADOS'
    EMPLEADOID = db.Column(db.Integer, primary_key=True)
    EMP_EMPLEADOID = db.Column(db.Integer, db.ForeignKey('EMPLEADOS.EMPLEADOID'))
    NOMBRE = db.Column(db.String(30))
    APELLIDO = db.Column(db.String(30))
    FECHA_NAC = db.Column(db.Date)
    EXTENSION = db.Column(db.Integer)

class Orden(db.Model):
    __tablename__ = 'ORDENES'
    ORDENID = db.Column(db.Integer, primary_key=True)
    CLIENTEID = db.Column(db.Integer, db.ForeignKey('CLIENTES.CLIENTEID'), nullable=False)
    EMPLEADOID = db.Column(db.Integer, db.ForeignKey('EMPLEADOS.EMPLEADOID'), nullable=False)
    FECHAORDEN = db.Column(db.Date, nullable=False)
    DESCUENTO = db.Column(db.Integer)

class Proveedor(db.Model):
    __tablename__ = 'PROVEEDORES'
    PROVEEDORID = db.Column(db.Integer, primary_key=True)
    NOMBREPROV = db.Column(db.String(50), nullable=False)
    CONTACTO = db.Column(db.String(50), nullable=False)
    CELUPROV = db.Column(db.String(12))
    CIUDADPROV = db.Column(db.String(20))

class Producto(db.Model):
    __tablename__ = 'PRODUCTOS'
    PRODUCTOID = db.Column(db.Integer, primary_key=True)
    CATEGORIAID = db.Column(db.Integer, db.ForeignKey('CATEGORIAS.CATEGORIAID'), nullable=False)
    PROVEEDORID = db.Column(db.Integer, db.ForeignKey('PROVEEDORES.PROVEEDORID'), nullable=False)
    DESCRIPCION = db.Column(db.String(50))
    PRECIOUNIT = db.Column(db.Numeric(10, 2), nullable=False)
    EXISTENCIA = db.Column(db.Integer, nullable=False)

class DetalleOrden(db.Model):
    __tablename__ = 'DETALLE_ORDENES'
    ORDENID = db.Column(db.Integer, db.ForeignKey('ORDENES.ORDENID'), primary_key=True, nullable=False)
    DETALLEID = db.Column(db.Integer, primary_key=True, nullable=False)
    PRODUCTOID = db.Column(db.Integer, db.ForeignKey('PRODUCTOS.PRODUCTOID'), nullable=False)
    CANTIDAD = db.Column(db.Integer, nullable=False)
