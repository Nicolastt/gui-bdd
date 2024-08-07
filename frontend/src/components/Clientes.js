import React, { Component } from "react";
import "../css/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Table } from "reactstrap";
import axios from 'axios';
import Notificacion from './Notificacion'; // Asegúrate de tener este componente

class Clientes extends Component {
    state = {
        clientes: [],
        modalActualizar: false,
        modalInsertar: false,
        form: {
            id: "",
            cedula_ruc: "",
            nombrecia: "",
            nombrecontacto: "",
            direccioncli: "",
            celular: "",
            ciudadcli: ""
        },
        mensaje: '',       // Estado para el mensaje de notificación
        tipoNotificacion: '' // Estado para el tipo de notificación
    };

    componentDidMount() {
        this.getClientes();
    }

    getClientes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/clientes');
            this.setState({ clientes: response.data });
        } catch (error) {
            this.mostrarNotificacion("Hubo un error al obtener los clientes", "error");
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
            await axios.put(`http://localhost:5000/clientes/${form.id}`, form);
            this.getClientes();
            this.setState({ modalActualizar: false });
            this.mostrarNotificacion("Cliente actualizado con éxito", "success");
        } catch (error) {
            this.mostrarNotificacion("Hubo un error al actualizar el cliente", "error");
        }
    };

    eliminar = async (dato) => {
        var opcion = window.confirm("¿Estás seguro que deseas eliminar el cliente " + dato.id + "?");
        if (opcion) {
            try {
                await axios.delete(`http://localhost:5000/clientes/${dato.id}`);
                this.getClientes();
                this.mostrarNotificacion("Cliente eliminado con éxito", "success");
            } catch (error) {
                this.mostrarNotificacion("Hubo un error al eliminar el cliente", "error");
            }
        }
    };

    insertar = async () => {
        const newCliente = { ...this.state.form };
        try {
            await axios.post('http://localhost:5000/clientes', newCliente);
            this.getClientes();
            this.setState({ modalInsertar: false });
            this.mostrarNotificacion("Cliente creado con éxito", "success");
        } catch (error) {
            this.mostrarNotificacion("Hubo un error al crear el cliente", "error");
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
                    <h1>Clientes</h1>
                    <br/>
                    <Button color="success" onClick={() => this.mostrarModalInsertar()}>Crear</Button>
                    <br/>
                    <br/>
                    <Table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cédula/RUC</th>
                            <th>Nombre de la Compañía</th>
                            <th>Nombre del Contacto</th>
                            <th>Dirección</th>
                            <th>Celular</th>
                            <th>Ciudad</th>
                            <th>Acción</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.clientes.map((cliente) => (
                            <tr key={cliente.id}>
                                <td>{cliente.id}</td>
                                <td>{cliente.cedula_ruc}</td>
                                <td>{cliente.nombrecia}</td>
                                <td>{cliente.nombrecontacto}</td>
                                <td>{cliente.direccioncli}</td>
                                <td>{cliente.celular}</td>
                                <td>{cliente.ciudadcli}</td>
                                <td>
                                    <Button
                                        color="primary"
                                        onClick={() => this.mostrarModalActualizar(cliente)}
                                    >
                                        Editar
                                    </Button>{" "}
                                    <Button color="danger" onClick={() => this.eliminar(cliente)}>Eliminar</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Container>

                <Modal isOpen={this.state.modalActualizar}>
                    <ModalHeader>
                        <div><h3>Actualizar Cliente</h3></div>
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
                            <label>Cédula/RUC:</label>
                            <input
                                className="form-control"
                                name="cedula_ruc"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.cedula_ruc}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Nombre de la Compañía:</label>
                            <input
                                className="form-control"
                                name="nombrecia"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.nombrecia}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Nombre del Contacto:</label>
                            <input
                                className="form-control"
                                name="nombrecontacto"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.nombrecontacto}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Dirección:</label>
                            <input
                                className="form-control"
                                name="direccioncli"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.direccioncli}
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
                                name="ciudadcli"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.ciudadcli}
                            />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.editar()}>Actualizar</Button>
                        <Button color="danger" onClick={() => this.cerrarModalActualizar()}>Cancelar</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalInsertar}>
                    <ModalHeader>
                        <div><h3>Insertar Cliente</h3></div>
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
                            <label>Cédula/RUC:</label>
                            <input
                                className="form-control"
                                name="cedula_ruc"
                                type="text"
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Nombre de la Compañía:</label>
                            <input
                                className="form-control"
                                name="nombrecia"
                                type="text"
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Nombre del Contacto:</label>
                            <input
                                className="form-control"
                                name="nombrecontacto"
                                type="text"
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Dirección:</label>
                            <input
                                className="form-control"
                                name="direccioncli"
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
                                name="ciudadcli"
                                type="text"
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.insertar()}>Insertar</Button>
                        <Button color="danger" onClick={() => this.cerrarModalInsertar()}>Cancelar</Button>
                    </ModalFooter>
                </Modal>

                {this.state.mensaje && (
                    <Notificacion mensaje={this.state.mensaje} tipo={this.state.tipoNotificacion} />
                )}
            </>
        );
    }
}

export default Clientes;
