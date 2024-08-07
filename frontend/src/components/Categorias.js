import React, { Component } from "react";
import "../css/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Table } from "reactstrap";
import axios from 'axios';
import Notificacion from './Notificacion';

class Categorias extends Component {
    state = {
        categorias: [],
        modalActualizar: false,
        modalInsertar: false,
        form: {
            id: "",
            nombre: "",
        },
        mensaje: '',       // Estado para el mensaje de notificación
        tipoNotificacion: '' // Estado para el tipo de notificación
    };

    componentDidMount() {
        this.getCategorias();
    }

    getCategorias = async () => {
        try {
            const response = await axios.get('http://localhost:5000/categorias');
            this.setState({ categorias: response.data });
        } catch (error) {
            this.mostrarNotificacion("Hubo un error al obtener las categorías", "error");
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
        });
    };

    cerrarModalInsertar = () => {
        this.setState({ modalInsertar: false });
    };

    editar = async () => {
        const { form } = this.state;
        try {
            await axios.put(`http://localhost:5000/categorias/${form.id}`, form);
            this.getCategorias();
            this.setState({ modalActualizar: false });
            this.mostrarNotificacion("Categoría actualizada con éxito", "success");
        } catch (error) {
            this.mostrarNotificacion("Hubo un error al actualizar la categoría", "error");
        }
    };

    eliminar = async (dato) => {
        var opcion = window.confirm("¿Estás seguro que deseas eliminar la categoría " + dato.id + "?");
        if (opcion) {
            try {
                await axios.delete(`http://localhost:5000/categorias/${dato.id}`);
                this.getCategorias();
                this.mostrarNotificacion("Categoría eliminada con éxito", "success");
            } catch (error) {
                this.mostrarNotificacion("Hubo un error al eliminar la categoría", "error");
            }
        }
    };

    insertar = async () => {
        const newCategoria = { ...this.state.form };
        try {
            await axios.post('http://localhost:5000/categorias', newCategoria);
            this.getCategorias();
            this.setState({ modalInsertar: false });
            this.mostrarNotificacion("Categoría creada con éxito", "success");
        } catch (error) {
            this.mostrarNotificacion("Hubo un error al crear la categoría", "error");
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
                    <h1>Categorías</h1>
                    <br/>
                    <Button color="success" onClick={() => this.mostrarModalInsertar()}>Crear</Button>
                    <br/>
                    <br/>

                    <Table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Acción</th>
                        </tr>
                        </thead>

                        <tbody>
                        {this.state.categorias.map((categoria) => (
                            <tr key={categoria.id}>
                                <td>{categoria.id}</td>
                                <td>{categoria.nombre}</td>
                                <td>
                                    <Button
                                        color="primary"
                                        onClick={() => this.mostrarModalActualizar(categoria)}
                                    >
                                        Editar
                                    </Button>{" "}
                                    <Button color="danger" onClick={() => this.eliminar(categoria)}>Eliminar</Button>
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
                            <label>
                                ID:
                            </label>

                            <input
                                className="form-control"
                                readOnly
                                type="text"
                                value={this.state.form.id}
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>
                                Nombre:
                            </label>
                            <input
                                className="form-control"
                                name="nombre"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.nombre}
                            />
                        </FormGroup>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            color="primary"
                            onClick={this.editar}
                        >
                            Confirmar
                        </Button>
                        <Button
                            color="danger"
                            onClick={this.cerrarModalActualizar}
                        >
                            Cancelar
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalInsertar}>
                    <ModalHeader>
                        <div><h3>Insertar Categoría</h3></div>
                    </ModalHeader>

                    <ModalBody>
                        <FormGroup>
                            <label>
                                ID:
                            </label>

                            <input
                                className="form-control"
                                name="id"
                                type="text"
                                onChange={this.handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>
                                Nombre:
                            </label>
                            <input
                                className="form-control"
                                name="nombre"
                                type="text"
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            color="primary"
                            onClick={this.insertar}
                        >
                            Insertar
                        </Button>
                        <Button
                            className="btn btn-danger"
                            onClick={this.cerrarModalInsertar}
                        >
                            Cancelar
                        </Button>
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

export default Categorias;
