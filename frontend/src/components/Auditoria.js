import React, { Component } from "react";
import "../css/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Table } from "reactstrap";
import axios from 'axios';
import Notificacion from './Notificacion'; // Importamos el componente Notificacion

class Auditoria extends Component {
    state = {
        auditoria: [],
        mensaje: '',       // Estado para el mensaje de notificación
        tipoNotificacion: '' // Estado para el tipo de notificación
    };

    componentDidMount() {
        this.getAuditoria();
        this.interval = setInterval(this.getAuditoria, 1000); // Actualiza cada 5 segundos
    }

    componentWillUnmount() {
        clearInterval(this.interval); // Limpia el intervalo cuando el componente se desmonte
    }

    getAuditoria = async () => {
        try {
            const response = await axios.get('http://localhost:5000/auditoria');
            const nuevosRegistros = response.data;

            this.setState(prevState => {
                const registrosActuales = prevState.auditoria;

                // Crear un conjunto de IDs existentes en el estado
                const idsExistentes = new Set(registrosActuales.map(registro => registro.id));

                // Filtrar los nuevos registros para añadir solo los que no están ya en el estado
                const registrosFiltrados = nuevosRegistros.filter(registro => !idsExistentes.has(registro.id));

                // Añadir los nuevos registros al final de los existentes
                const registrosActualizados = [...registrosActuales, ...registrosFiltrados];

                return { auditoria: registrosActualizados };
            });
        } catch (error) {
            this.mostrarNotificacion("Hubo un error al obtener los datos de auditoría", "error");
        }
    }

    mostrarNotificacion = (mensaje, tipo) => {
        this.setState({ mensaje, tipoNotificacion: tipo });
        setTimeout(() => {
            this.setState({ mensaje: '', tipoNotificacion: '' });
        }, 3000); // Oculta la notificación después de 3 segundos
    }

    render() {
        return (
            <>
                <Container>
                    <h1>Auditoría</h1>
                    <br/>

                    <Table striped>
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Fecha</th>
                                <th>Tipo de Operación</th>
                                <th>Tabla</th>
                                <th>Valor Anterior</th>
                                <th>Valor Nuevo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.auditoria.map((registro, index) => (
                                <tr key={registro.id}> {/* Usar ID como clave */}
                                    <td>{registro.user_name}</td>
                                    <td>{registro.fecha}</td>
                                    <td>{registro.tipo_operacion}</td>
                                    <td>{registro.nombre_table}</td>
                                    <td>{registro.anterior}</td>
                                    <td>{registro.nuevo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Container>

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

export default Auditoria;
