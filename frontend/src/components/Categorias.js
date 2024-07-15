import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [newCategoria, setNewCategoria] = useState('');
    const [editCategoria, setEditCategoria] = useState({ id: null, nombre: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios.get('/categorias')
            .then(response => setCategorias(response.data))
            .catch(error => console.error('Error fetching data:', error));
    };

    const handleInputChange = (event) => {
        setNewCategoria(event.target.value);
    };

    const handleCreateCategoria = () => {
        axios.post('/categorias', { nombre: newCategoria })
            .then(response => {
                console.log('Categoria creada:', response.data);
                setNewCategoria('');
                fetchData(); // Actualizar la lista después de crear
            })
            .catch(error => console.error('Error al crear categoría:', error));
    };

    const handleDeleteCategoria = (id) => {
        axios.delete(`/categorias/${id}`)
            .then(response => {
                console.log('Categoria eliminada:', response.data);
                fetchData(); // Actualizar la lista después de eliminar
            })
            .catch(error => console.error('Error al eliminar categoría:', error));
    };

    const handleEditCategoria = (id, nombre) => {
        setEditCategoria({ id, nombre });
    };

    const handleUpdateCategoria = () => {
        axios.put(`/categorias/${editCategoria.id}`, { nombre: editCategoria.nombre })
            .then(response => {
                console.log('Categoria actualizada:', response.data);
                setEditCategoria({ id: null, nombre: '' });
                fetchData(); // Actualizar la lista después de actualizar
            })
            .catch(error => console.error('Error al actualizar categoría:', error));
    };

    return (
        <div>
            <h1>Categorías</h1>

            {/* Formulario para crear nueva categoría */}
            <div>
                <input
                    type="text"
                    placeholder="Nombre de categoría"
                    value={newCategoria}
                    onChange={handleInputChange}
                />
                <button onClick={handleCreateCategoria}>Crear</button>
            </div>

            {/* Lista de categorías existentes */}
            <ul>
                {categorias.map(categoria => (
                    <li key={categoria.CATEGORIAID}>
                        {editCategoria.id === categoria.CATEGORIAID ? (
                            <div>
                                <input
                                    type="text"
                                    value={editCategoria.nombre}
                                    onChange={(e) => setEditCategoria({ ...editCategoria, nombre: e.target.value })}
                                />
                                <button onClick={handleUpdateCategoria}>Guardar</button>
                                <button onClick={() => setEditCategoria({ id: null, nombre: '' })}>Cancelar</button>
                            </div>
                        ) : (
                            <div>
                                {categoria.NOMBRECAT}
                                <button onClick={() => handleEditCategoria(categoria.CATEGORIAID, categoria.NOMBRECAT)}>Editar</button>
                                <button onClick={() => handleDeleteCategoria(categoria.CATEGORIAID)}>Eliminar</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Categorias;
