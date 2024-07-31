import React, { Component } from "react";
import "../css/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Table } from "reactstrap";
import axios from 'axios';
import Notificacion from './Notificacion'; // Importamos el componente Notificacion

class Proveedores extends Component {
    state = {
        proveedores: [],
        modalActualizar: false,
        modalInsertar: false,
        form: {
            id: "",
            nombre: "",
            contacto: "",
            celular: "",
            ciudad: "",
        },
        mensaje: '',       // Estado para el mensaje de notificación
        tipoNotificacion: '' // Estado para el tipo de notificación
    };

    componentDidMount() {
        this.getProveedores();
    }

    getProveedores = async () => {
        try {
            const response = await axios.get('http://localhost:5000/proveedores');
            this.setState({ proveedores: response.data });
        } catch (error) {
            this.mostrarNotificacion("Hubo un error al obtener los proveedores", "error");
        }
    }

    mostrarNotificacion = (mensaje, tipo) => {
        this.setState({ mensaje, tipoNotificacion: tipo });
        setTimeout(() => {
            this.setState({ mensaje: '', tipoNotificacion: '' });
        }, 3000); // Oculta la notificación después de 3 segundos
    }

    mostrarModalActualizar = (dato) => {
        this.setState({
            form: dato,
            modalActualizar: true,
        });
    };

    cerrarModalActualizar = () => {
        this.setState({ modalActualizar: false });
    };

    mostrarModalInsertar = () => {
        this.setState({
            modalInsertar: true,
            form: { id: "", nombre: "", contacto: "", celular: "", ciudad: "" }
        });
    };

    cerrarModalInsertar = () => {
        this.setState({ modalInsertar: false });
    };

    editar = async () => {
        const { form } = this.state;
        try {
            await axios.put(`http://localhost:5000/proveedores/${form.id}`, form);
            this.getProveedores();
            this.setState({ modalActualizar: false });
            this.mostrarNotificacion("Proveedor actualizado con éxito", "success");
        } catch (error) {
            this.mostrarNotificacion("Hubo un error al actualizar el proveedor", "error");
        }
    };

    eliminar = async (dato) => {
        const opcion = window.confirm(`¿Estás seguro que deseas eliminar el proveedor ${dato.id}?`);
        if (opcion) {
            try {
                await axios.delete(`http://localhost:5000/proveedores/${dato.id}`);
                this.getProveedores();
                this.mostrarNotificacion("Proveedor eliminado con éxito", "success");
            } catch (error) {
                this.mostrarNotificacion("Hubo un error al eliminar el proveedor", "error");
            }
        }
    };

    insertar = async () => {
        const newProveedor = { ...this.state.form };
        try {
            await axios.post('http://localhost:5000/proveedores', newProveedor);
            this.getProveedores();
            this.setState({ modalInsertar: false });
            this.mostrarNotificacion("Proveedor creado con éxito", "success");
        } catch (error) {
            this.mostrarNotificacion("Hubo un error al crear el proveedor", "error");
        }
    }

    handleChange = (e) => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value,
            },
        });
    };

    render() {
        return (
            <>
                <Container>
                    <h1>Proveedores</h1>
                    <br/>
                    <Button color="success" onClick={this.mostrarModalInsertar}>Crear</Button>
                    <br/>
                    <br/>
                    <Table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Contacto</th>
                            <th>Celular</th>
                            <th>Ciudad</th>
                            <th>Acción</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.proveedores.map((proveedor) => (
                            <tr key={proveedor.id}>
                                <td>{proveedor.id}</td>
                                <td>{proveedor.nombre}</td>
                                <td>{proveedor.contacto}</td>
                                <td>{proveedor.celular}</td>
                                <td>{proveedor.ciudad}</td>
                                <td>
                                    <Button
                                        color="primary"
                                        onClick={() => this.mostrarModalActualizar(proveedor)}
                                    >
                                        Editar
                                    </Button>{" "}
                                    <Button color="danger" onClick={() => this.eliminar(proveedor)}>Eliminar</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Container>

                <Modal isOpen={this.state.modalActualizar}>
                    <ModalHeader>
                        <div><h3>Editar Registro</h3></div>
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <label>ID:</label>
                            <input
                                className="form-control"
                                readOnly
                                type="text"
                                value={this.state.form.id}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Nombre:</label>
                            <input
                                className="form-control"
                                name="nombre"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.nombre}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Contacto:</label>
                            <input
                                className="form-control"
                                name="contacto"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.contacto}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Celular:</label>
                            <input
                                className="form-control"
                                name="celular"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.celular}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Ciudad:</label>
                            <input
                                className="form-control"
                                name="ciudad"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.ciudad}
                            />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.editar}>Confirmar</Button>
                        <Button color="danger" onClick={this.cerrarModalActualizar}>Cancelar</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalInsertar}>
                    <ModalHeader>
                        <div><h3>Insertar Proveedor</h3></div>
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <label>ID:</label>
                            <input
                                className="form-control"
                                name="id"
                                type="text"
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Nombre:</label>
                            <input
                                className="form-control"
                                name="nombre"
                                type="text"
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Contacto:</label>
                            <input
                                className="form-control"
                                name="contacto"
                                type="text"
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Celular:</label>
                            <input
                                className="form-control"
                                name="celular"
                                type="text"
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Ciudad:</label>
                            <input
                                className="form-control"
                                name="ciudad"
                                type="text"
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.insertar}>Insertar</Button>
                        <Button className="btn btn-danger" onClick={this.cerrarModalInsertar}>Cancelar</Button>
                    </ModalFooter>
                </Modal>

                {/* Mostrar notificación si hay un mensaje */}
                {this.state.mensaje && (
                    <Notificacion
                        mensaje={this.state.mensaje}
                        tipo={this.state.tipoNotificacion}
                    />
                )}
            </>
        );
    }
}

export default Proveedores;
