import React, { Component } from "react";
import "../css/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Table } from "reactstrap";
import axios from 'axios';
import Notificacion from './Notificacion'; // Asegúrate de tener este componente

class DetalleOrdenes extends Component {
    state = {
        detalles: [],
        modalActualizar: false,
        modalInsertar: false,
        form: {
            ordenid: "",
            detalleid: "",
            productoid: "",
            cantidad: "",
        },
        mensaje: '',       // Estado para el mensaje de notificación
        tipoNotificacion: '' // Estado para el tipo de notificación
    };

    componentDidMount() {
        this.getDetalles();
    }

    getDetalles = async () => {
        try {
            const response = await axios.get('http://localhost:5000/detalleordenes');
            this.setState({ detalles: response.data });
        } catch (error) {
            this.mostrarNotificacion("Hubo un error al obtener los detalles de órdenes", "error");
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
            await axios.put(`http://localhost:5000/detalleordenes/${form.ordenid}/${form.detalleid}`, form);
            this.getDetalles();
            this.setState({ modalActualizar: false });
            this.mostrarNotificacion("Detalle de orden actualizado con éxito", "success");
        } catch (error) {
            this.mostrarNotificacion("Hubo un error al actualizar el detalle de la orden", "error");
        }
    };

    eliminar = async (dato) => {
        const opcion = window.confirm(`¿Estás seguro que deseas eliminar el detalle de la orden ${dato.ordenid} con ID ${dato.detalleid}?`);
        if (opcion) {
            try {
                await axios.delete(`http://localhost:5000/detalleordenes/${dato.ordenid}/${dato.detalleid}`);
                this.getDetalles();
                this.mostrarNotificacion("Detalle de orden eliminado con éxito", "success");
            } catch (error) {
                this.mostrarNotificacion("Hubo un error al eliminar el detalle de la orden", "error");
            }
        }
    };

    insertar = async () => {
        const newDetalle = { ...this.state.form };
        try {
            await axios.post('http://localhost:5000/detalleordenes', newDetalle);
            this.getDetalles();
            this.setState({ modalInsertar: false });
            this.mostrarNotificacion("Detalle de orden creado con éxito", "success");
        } catch (error) {
            this.mostrarNotificacion("Hubo un error al crear el detalle de la orden", "error");
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
                    <h1>Detalle Órdenes</h1>
                    <br/>
                    <Button color="success" onClick={this.mostrarModalInsertar}>Crear</Button>
                    <br/>
                    <br/>
                    <Table>
                        <thead>
                        <tr>
                            <th>Orden ID</th>
                            <th>Detalle ID</th>
                            <th>Producto ID</th>
                            <th>Cantidad</th>
                            <th>Acción</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.detalles.map((detalle) => (
                            <tr key={`${detalle.ordenid}-${detalle.detalleid}`}>
                                <td>{detalle.ordenid}</td>
                                <td>{detalle.detalleid}</td>
                                <td>{detalle.productoid}</td>
                                <td>{detalle.cantidad}</td>
                                <td>
                                    <Button
                                        color="primary"
                                        onClick={() => this.mostrarModalActualizar(detalle)}
                                    >
                                        Editar
                                    </Button>{" "}
                                    <Button color="danger" onClick={() => this.eliminar(detalle)}>Eliminar</Button>
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
                            <label>Detalle ID:</label>
                            <input
                                className="form-control"
                                readOnly
                                type="text"
                                value={this.state.form.detalleid}
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>Producto ID:</label>
                            <input
                                className="form-control"
                                name="productoid"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.productoid}
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>Cantidad:</label>
                            <input
                                className="form-control"
                                name="cantidad"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.cantidad}
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
                        <div><h3>Insertar Detalle de Orden</h3></div>
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
                            <label>Detalle ID:</label>
                            <input
                                className="form-control"
                                name="detalleid"
                                type="text"
                                onChange={this.handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>Producto ID:</label>
                            <input
                                className="form-control"
                                name="productoid"
                                type="text"
                                onChange={this.handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>Cantidad:</label>
                            <input
                                className="form-control"
                                name="cantidad"
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

                {this.state.mensaje && (
                    <Notificacion mensaje={this.state.mensaje} tipo={this.state.tipoNotificacion} />
                )}
            </>
        );
    }
}

export default DetalleOrdenes;
