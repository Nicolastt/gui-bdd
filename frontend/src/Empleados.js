import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Table } from "reactstrap";
import axios from 'axios';

class Empleados extends Component {
    state = {
        empleados: [],
        modalActualizar: false,
        modalInsertar: false,
        form: {
            empleado_id: "",
            jefe_id: "",
            nombre: "",
            apellido: "",
            fecha_nac: "",
            extension: "",
        },
    };

    componentDidMount() {
        this.getEmpleados();
    }

    getEmpleados = async () => {
        try {
            const response = await axios.get('http://localhost:5000/empleados');
            this.setState({ empleados: response.data });
        } catch (error) {
            console.error("Hubo un error al obtener los empleados!", error);
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
            form: {
                empleado_id: "",
                jefe_id: "",
                nombre: "",
                apellido: "",
                fecha_nac: "",
                extension: "",
            },
            modalInsertar: true,
        });
    };

    cerrarModalInsertar = () => {
        this.setState({ modalInsertar: false });
    };

    editar = async () => {
        const { form } = this.state;
        try {
            await axios.put(`http://localhost:5000/empleados/${form.empleado_id}`, form);
            this.getEmpleados();
            this.setState({ modalActualizar: false });
        } catch (error) {
            console.error("Hubo un error al actualizar el empleado!", error);
        }
    };

    eliminar = async (dato) => {
        var opcion = window.confirm("¿Estás seguro que deseas eliminar el empleado " + dato.empleado_id + "?");
        if (opcion) {
            try {
                await axios.delete(`http://localhost:5000/empleados/${dato.empleado_id}`);
                this.getEmpleados();
            } catch (error) {
                console.error("Hubo un error al eliminar el empleado!", error);
            }
        }
    };

    insertar = async () => {
        const newEmpleado = { ...this.state.form };
        try {
            await axios.post('http://localhost:5000/empleados', newEmpleado);
            this.getEmpleados();
            this.setState({ modalInsertar: false });
        } catch (error) {
            console.error("Hubo un error al crear el empleado!", error);
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
                    <h1>Empleados</h1>
                    <br/>
                    <Button color="success" onClick={this.mostrarModalInsertar}>Crear</Button>
                    <br/>
                    <br/>
                    <Table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Jefe ID</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Fecha de Nacimiento</th>
                            <th>Extensión</th>
                            <th>Acción</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.empleados.map((empleado) => (
                            <tr key={empleado.empleado_id}>
                                <td>{empleado.empleado_id}</td>
                                <td>{empleado.jefe_id}</td>
                                <td>{empleado.nombre}</td>
                                <td>{empleado.apellido}</td>
                                <td>{empleado.fecha_nac}</td>
                                <td>{empleado.extension}</td>
                                <td>
                                    <Button
                                        color="primary"
                                        onClick={() => this.mostrarModalActualizar(empleado)}
                                    >
                                        Editar
                                    </Button>{" "}
                                    <Button color="danger" onClick={() => this.eliminar(empleado)}>Eliminar</Button>
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
                                value={this.state.form.empleado_id}
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>Jefe ID:</label>
                            <input
                                className="form-control"
                                name="jefe_id"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.jefe_id}
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
                            <label>Apellido:</label>
                            <input
                                className="form-control"
                                name="apellido"
                                type="text"
                                onChange={this.handleChange}
                                value={this.state.form.apellido}
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>Fecha de Nacimiento:</label>
                            <input
                                className="form-control"
                                name="fecha_nac"
                                type="date"
                                onChange={this.handleChange}
                                value={this.state.form.fecha_nac}
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>Extensión:</label>
                            <input
                                className="form-control"
                                name="extension"
                                type="number"
                                onChange={this.handleChange}
                                value={this.state.form.extension}
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
                        <div><h3>Insertar Empleado</h3></div>
                    </ModalHeader>

                    <ModalBody>
                        <FormGroup>
                            <label>ID:</label>
                            <input
                                className="form-control"
                                name="empleado_id"
                                type="text"
                                onChange={this.handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>Jefe ID:</label>
                            <input
                                className="form-control"
                                name="jefe_id"
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
                            <label>Apellido:</label>
                            <input
                                className="form-control"
                                name="apellido"
                                type="text"
                                onChange={this.handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>Fecha de Nacimiento:</label>
                            <input
                                className="form-control"
                                name="fecha_nac"
                                type="date"
                                onChange={this.handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>Extensión:</label>
                            <input
                                className="form-control"
                                name="extension"
                                type="number"
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

export default Empleados;
