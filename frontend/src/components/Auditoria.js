import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Table} from 'reactstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import './Auditoria.css';

const Auditoria = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/auditoria');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container-auditoria">
            <h1>Auditoría</h1>
            <Table striped>
                <thead>
                <tr>
                    <th>Usuario</th>
                    <th>Fecha</th>
                    <th>Tipo de Operación</th>
                    <th>Nombre de la Tabla</th>
                    <th>Valor Anterior</th>
                    <th>Valor Nuevo</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        <td>{item.user_name}</td>
                        <td>{item.fecha}</td>
                        <td>{item.tipo_operacion}</td>
                        <td>{item.nombre_table}</td>
                        <td>{item.anterior}</td>
                        <td>{item.nuevo}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Auditoria;
