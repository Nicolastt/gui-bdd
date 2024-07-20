import React, { Component } from "react";
import "../css/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Table } from "reactstrap";
import axios from 'axios';

class Ordenes extends Component {
    state = {
        ordenes: [],
        modalActualizar: false,
        modalInsertar: false,
        form: {
            ordenid: "",
            clienteid: "",
            empleadoid: "",
            fechaorden: "",
            descuento: "",
        },
    };

    componentDidMount() {
        this.getOrdenes();
    }

    getOrdenes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/ordenes');
            this.setState({ ordenes: response.data });
        } catch (error) {
            console.error("Hubo un error al obtener las órdenes!", error);
        }
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
            form: {
                ordenid: "",
                clienteid: "",
                empleadoid: "",
                fechaorden: "",
                descuento: "",
            },
        });
    };

    cerrarModalInsertar = () => {
        this.setState({ modalInsertar: false });
    };

    editar = async () => {
        const { form } = this.state;
        try {
            await axios.put(`http://localhost:5000/ordenes/${form.ordenid}`, form);
            this.getOrdenes();
            this.setState({ modalActualizar: false });
        } catch (error) {
            console.error("Hubo un error al actualizar la orden!", error);
        }
    };

    eliminar = async (dato) => {
        var opcion = window.confirm("¿Estás seguro que deseas eliminar la orden " + dato.ordenid + "?");
        if (opcion) {
            try {
                await axios.delete(`http://localhost:5000/ordenes/${dato.ordenid}`);
                this.getOrdenes();
            } catch (error) {
                console.error("Hubo un error al eliminar la orden!", error);
            }
        }
    };

    insertar = async () => {
        const newOrden = { ...this.state.form };
        try {
            await axios.post('http://localhost:5000/ordenes', newOrden);
            this.getOrdenes();
            this.setState({ modalInsertar: false });
        } catch (error) {
            console.error("Hubo un error al crear la orden!", error);
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
                    <h1>Órdenes</h1>
                    <br/>
                    <Button color="success" onClick={this.mostrarModalInsertar}>Crear</Button>
                    <br/>
                    <br/>
                    <Table>
                        <thead>
                        <tr>
                            <th>Orden ID</th>
                            <th>Cliente ID</th>
                            <th>Empleado ID</th>
                            <th>Fecha Orden</th>
                            <th>Descuento</th>
                            <th>Acción</th>
                        </tr>
                        </thead>

                        <tbody>
                        {this.state.ordenes.map((orden) => (
                            <tr key={orden.ordenid}>
                                <td>{orden.ordenid}</td>
                                <td>{orden.clienteid}</td>
                                <td>{orden.empleadoid}</td>
                                <td>{new Date(orden.fechaorden).toLocaleDateString()}</td>
                                <td>{orden.descuento}</td>
                                <td>
                                    <Button
                                        color="primary"
                                        onClick={() => this.mostrarModalActualizar(orden)}
                                    >
                                        Editar
                                    </Button>{" "}
                                    <Button color="danger" onClick={() => this.eliminar(orden)}>Eliminar</Button>
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
                            <label>Orden ID:</label>
                            <input
                                className="form-control"
                                readOnly
                                type="text"
                                value={this.state.form.ordenid}
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>Cliente ID:</label>
                            <input
                                className="form-control"
                                name="clienteid"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.clienteid}
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>Empleado ID:</label>
                            <input
                                className="form-control"
                                name="empleadoid"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.empleadoid}
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>Fecha Orden:</label>
                            <input
                                className="form-control"
                                name="fechaorden"
                                type="date"
                                onChange={this.handleChange}
                                value={this.state.form.fechaorden.split('T')[0]}
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>Descuento:</label>
                            <input
                                className="form-control"
                                name="descuento"
                                type="number"
                                onChange={this.handleChange}
                                value={this.state.form.descuento}
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
                        <div><h3>Insertar Orden</h3></div>
                    </ModalHeader>

                    <ModalBody>
                        <FormGroup>
                            <label>Orden ID:</label>
                            <input
                                className="form-control"
                                name="ordenid"
                                type="text"
                                onChange={this.handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>Cliente ID:</label>
                            <input
                                className="form-control"
                                name="clienteid"
                                type="text"
                                onChange={this.handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>Empleado ID:</label>
                            <input
                                className="form-control"
                                name="empleadoid"
                                type="text"
                                onChange={this.handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>Fecha Orden:</label>
                            <input
                                className="form-control"
                                name="fechaorden"
                                type="date"
                                onChange={this.handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>Descuento:</label>
                            <input
                                className="form-control"
                                name="descuento"
                                type="number"
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </ModalBody>

                    <ModalFooter>
                        <Button color="primary" onClick={this.insertar}>Insertar</Button>
                        <Button color="danger" onClick={this.cerrarModalInsertar}>Cancelar</Button>
                    </ModalFooter>
                </Modal>
            </>
        );
    }
}

export default Ordenes;
