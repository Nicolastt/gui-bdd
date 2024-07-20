# Guía de Instalación y Ejecución del Proyecto Flask y React

Esta guía proporciona los pasos necesarios para configurar y ejecutar un proyecto que utiliza Flask como backend y React como frontend. Sigue estos pasos para preparar el entorno de desarrollo y ejecutar ambos componentes del proyecto.

## Requisitos Previos

- Python 3.x
- Node.js y npm

## Configuración del Backend (Flask)

1. **Instalación de Python**: Asegúrate de tener Python instalado. Descárgalo desde [python.org](https://www.python.org/downloads/).

2. **Creación y Activación de un Entorno Virtual**:

    - En Windows:

    ```bash
    python -m venv venv
    venv\Scripts\activate
    ```

    - En macOS y Linux:

    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3. **Instalación de Flask y Dependencias**:

    ```bash
    pip install Flask flask-cors
    ```

4. **Ejecución del Backend**:

    Asegúrate de estar en el directorio del proyecto y ejecuta:

    ```bash
    flask run
    ```

## Configuración del Frontend (React)

1. **Instalación de Node.js y npm**: Descarga e instala Node.js desde [nodejs.org](https://nodejs.org/). npm se instala automáticamente con Node.js.

2. **Creación de la Aplicación React**:

    ```bash
    npx create-react-app mi-app-react
    cd mi-app-react
    ```

3. **Instalación de Dependencias (Axios, Bootstrap, Reactstrap)**:

    ```bash
    npm install axios bootstrap reactstrap
    ```

4. **Ejecución del Frontend**:

    ```bash
    npm start
    ```

## Configuración del Proxy en el Frontend

Para evitar problemas de CORS durante el desarrollo, añade la siguiente línea a tu archivo `package.json` en el frontend:

```json
"proxy": "http://localhost:5000",