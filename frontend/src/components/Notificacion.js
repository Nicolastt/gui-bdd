import React from 'react';
import ReactDOM from 'react-dom';
import {Alert, Col, Container, Row} from 'reactstrap';

const Notificacion = ({mensaje, tipo}) => {
    const alertColor = tipo === 'success' ? 'success' : 'danger';

    return ReactDOM.createPortal(
        <Container fluid className="d-flex justify-content-center align-items-center"
                   style={{position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 9999}}>
            <Row className="w-100">
                <Col>
                    <Alert color={alertColor} className="text-center w-100 m-0">
                        {mensaje}
                    </Alert>
                </Col>
            </Row>
        </Container>,
        document.body
    );
};

export default Notificacion;
