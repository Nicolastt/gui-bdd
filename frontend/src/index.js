import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Categorias from "./components/Categorias";
import Clientes from "./components/Clientes";
import Empleados from "./components/Empleados";
import Ordenes from "./components/Ordenes";
import Proveedores from "./components/Proveedores";
import Productos from "./components/Productos";
import DetalleOrdenes from "./components/DetalleOrdenes";
import Auditoria from "./components/Auditoria";
import Tail from "./components/Tail";

ReactDOM.render(
    <Router>
        <Routes>
            <Route path="/" element={<><h1 className="centered-heading">CRUD PROYECTO BASE DE DATOS DISTRIBUIDAS</h1><Categorias/><Clientes/><Empleados/><Ordenes/><Proveedores/><Productos/><DetalleOrdenes/><Tail/></>} />
            <Route path="/auditoria" element={<Auditoria />} />
        </Routes>
    </Router>,
    document.getElementById('root')
);

serviceWorker.unregister();
