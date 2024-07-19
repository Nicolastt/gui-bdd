import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Categorias from "./Categorias";
import Clientes from "./Clientes";
import Empleados from "./Empleados";
import Ordenes from "./Ordenes";
import Proveedores from "./Proveedores";
import Productos from "./Productos";
import DetalleOrdenes from "./DetalleOrdenes";
import Tail from "./Tail";

ReactDOM.render(
    <>
        <h1 className="centered-heading">CRUD PROYECTO BASE DE DATOS DISTRIBUIDAS</h1>
        <Categorias/>
        <Clientes/>
        <Empleados/>
        <Ordenes/>
        <Proveedores/>
        <Productos/>
        <DetalleOrdenes/>
        <Tail/>
    </>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();