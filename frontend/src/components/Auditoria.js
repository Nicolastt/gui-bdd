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
        <div className="auditoria-container">
            <h1 className="auditoria-title">Auditoría</h1>
            <Table className="auditoria-table" striped>
                <thead className="auditoria-thead">
                    <tr>
                        <th className="auditoria-th">Usuario</th>
                        <th className="auditoria-th">Fecha</th>
                        <th className="auditoria-th">Tipo de Operación</th>
                        <th className="auditoria-th">Nombre de la Tabla</th>
                        <th className="auditoria-th">Valor Anterior</th>
                        <th className="auditoria-th">Valor Nuevo</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index} className="auditoria-tr">
                            <td className="auditoria-td">{item.user_name}</td>
                            <td className="auditoria-td">{item.fecha}</td>
                            <td className="auditoria-td">{item.tipo_operacion}</td>
                            <td className="auditoria-td">{item.nombre_table}</td>
                            <td className="auditoria-td">{item.anterior}</td>
                            <td className="auditoria-td">{item.nuevo}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Auditoria;
