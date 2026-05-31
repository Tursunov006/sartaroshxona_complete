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
            if (mounted) setLoading(false);
        });
        return () => { mounted = false; };
    }, []);

    return (
        <div className="public-page">
            <div className="section-title mb-4">
                <h2>Xizmatlar</h2>
                <span>Eng toza, tezkor va noyob sartarosh xizmatlari</span>
            </div>

            {loading ? (
                <div className="text-center py-5"><Spinner animation="border" /></div>
            ) : (
                <Row className="g-4">
                    {services.length === 0 && <p className="text-muted">Hozircha xizmatlar mavjud emas.</p>}
                    {services.map(service => (
                        <Col md={6} lg={4} key={service.id || service._id}>
                            <Card className="feature-card card-modern h-100 p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <h5 className="mb-1">{service.name}</h5>
                                        <div className="small-note">Har bir xizmat sizning uslubingizga moslanadi.</div>
                                    </div>
                                    <Badge bg="primary" pill>{service.duration} min</Badge>
                                </div>
                                <div className="mt-4 fw-bold">{Number(service.price).toLocaleString('uz-UZ')} so'm</div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default PublicServices;
