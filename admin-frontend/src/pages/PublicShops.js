import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PublicShops = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        axios.get(`${API_URL}/shops`).then(res => {
            if (mounted) setShops(res.data || []);
        }).catch(err => {
            console.error(err);
        }).finally(() => mounted && setLoading(false));
        return () => { mounted = false; };
    }, []);

    return (
        <div className="public-page">
            <div className="section-title mb-4">
                <h2>Salonlar</h2>
                <span>Eng yaqin va eng yaxshi salonlar</span>
            </div>
            {loading ? (
                <div className="text-center py-5"><Spinner animation="border" /></div>
            ) : (
                <Row className="g-4">
                    {shops.length === 0 && <p className="text-muted">Hozircha salonlar yo'q.</p>}
                    {shops.map(shop => (
                        <Col md={6} lg={4} key={shop.id || shop._id}>
                            <Card className="feature-card card-modern h-100 p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <h5 className="mb-1">{shop.name}</h5>
                                        <div className="text-muted small">{shop.address || 'Manzil ma’lumotlari mavjud emas'}</div>
                                    </div>
                                    <Badge bg="info">Salon</Badge>
                                </div>
                                <div className="text-muted small">Telefon: {shop.phone || '—'}</div>
                                {shop.instagram && <div className="text-muted small mt-2">Instagram: @{shop.instagram}</div>}
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default PublicShops;
