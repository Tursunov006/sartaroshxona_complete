import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PublicServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        axios.get(`${API_URL}/services`).then(res => {
            if (mounted) setServices(res.data || []);
        }).catch(err => {
            console.error(err);
        }).finally(() => {
            mounted && setLoading(false);
        });
        return () => { mounted = false; };
    }, []);

    return (
        <div className="public-page">
            <div className="section-title mb-4">
                <h2>Xizmatlar</h2>
                <span>To‘liq xizmatlar katalogi</span>
            </div>
            {loading ? (
                <div className="text-center py-5"><Spinner animation="border" /></div>
            ) : (
                <Row className="g-4">
                    {services.length === 0 && <p className="text-muted">Hozircha xizmatlar mavjud emas.</p>}
                    {services.map(service => (
                        <Col md={6} lg={4} key={service.id || service._id}>
                            <Card className="feature-card card-modern h-100 p-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="mb-0">{service.name}</h5>
                                    <Badge bg="primary">{service.duration} min</Badge>
                                </div>
                                <p className="text-muted mb-0">{Number(service.price).toLocaleString('uz-UZ')} so'm</p>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default PublicServices;
