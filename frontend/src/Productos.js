import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Table } from "reactstrap";
import axios from 'axios';

class Productos extends Component {
    state = {
        productos: [],
        modalActualizar: false,
        modalInsertar: false,
        form: {
            id: "",
            categoria_id: "",
            proveedor_id: "",
            descripcion: "",
            precio_unit: "",
            existencia: ""
        },
    };

    componentDidMount() {
        this.getProductos();
    }

    getProductos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/productos');
            this.setState({ productos: response.data });
        } catch (error) {
            console.error("Hubo un error al obtener los productos!", error);
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
        });
    };

    cerrarModalInsertar = () => {
        this.setState({ modalInsertar: false });
    };

    editar = async () => {
        const { form } = this.state;
        try {
            await axios.put(`http://localhost:5000/productos/${form.id}`, form);
            this.getProductos();
            this.setState({ modalActualizar: false });
        } catch (error) {
            console.error("Hubo un error al actualizar el producto!", error);
        }
    };

    eliminar = async (dato) => {
        var opcion = window.confirm("¿Estás seguro que deseas eliminar el producto " + dato.id + "?");
        if (opcion) {
            try {
                await axios.delete(`http://localhost:5000/productos/${dato.id}`);
                this.getProductos();
            } catch (error) {
                console.error("Hubo un error al eliminar el producto!", error);
            }
        }
    };

    insertar = async () => {
        const newProducto = { ...this.state.form };
        try {
            await axios.post('http://localhost:5000/productos', newProducto);
            this.getProductos();
            this.setState({ modalInsertar: false });
        } catch (error) {
            console.error("Hubo un error al crear el producto!", error);
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
                    <br />
                    <Button color="success" onClick={() => this.mostrarModalInsertar()}>Crear</Button>
                    <br />
                    <br />
                    <Table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Categoria ID</th>
                                <th>Proveedor ID</th>
                                <th>Descripción</th>
                                <th>Precio Unitario</th>
                                <th>Existencia</th>
                                <th>Acción</th>
                            </tr>
                        </thead>

                        <tbody>
                            {this.state.productos.map((producto) => (
                                <tr key={producto.id}>
                                    <td>{producto.id}</td>
                                    <td>{producto.categoria_id}</td>
                                    <td>{producto.proveedor_id}</td>
                                    <td>{producto.descripcion}</td>
                                    <td>{producto.precio_unit}</td>
                                    <td>{producto.existencia}</td>
                                    <td>
                                        <Button
                                            color="primary"
                                            onClick={() => this.mostrarModalActualizar(producto)}
                                        >
                                            Editar
                                        </Button>{" "}
                                        <Button color="danger" onClick={() => this.eliminar(producto)}>Eliminar</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Container>

                <Modal isOpen={this.state.modalActualizar}>
                    <ModalHeader>
                        <div><h3>Editar Producto</h3></div>
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
                            <label>Categoria ID:</label>
                            <input
                                className="form-control"
                                name="categoria_id"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.categoria_id}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Proveedor ID:</label>
                            <input
                                className="form-control"
                                name="proveedor_id"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.proveedor_id}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Descripción:</label>
                            <input
                                className="form-control"
                                name="descripcion"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.descripcion}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Precio Unitario:</label>
                            <input
                                className="form-control"
                                name="precio_unit"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.precio_unit}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Existencia:</label>
                            <input
                                className="form-control"
                                name="existencia"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.existencia}
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
                        <div><h3>Insertar Producto</h3></div>
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
                            <label>Categoria ID:</label>
                            <input
                                className="form-control"
                                name="categoria_id"
                                type="text"
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Proveedor ID:</label>
                            <input
                                className="form-control"
                                name="proveedor_id"
                                type="text"
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Descripción:</label>
                            <input
                                className="form-control"
                                name="descripcion"
                                type="text"
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Precio Unitario:</label>
                            <input
                                className="form-control"
                                name="precio_unit"
                                type="text"
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Existencia:</label>
                            <input
                                className="form-control"
                                name="existencia"
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
            </>
        );
    }
}

export default Productos;
