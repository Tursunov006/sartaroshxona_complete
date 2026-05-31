import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
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
        <div>
            <h2 className="mb-4">Salonlar</h2>
            {loading ? (
                <div className="text-center py-5"><Spinner animation="border" /></div>
            ) : (
                <Row className="g-3">
                    {shops.length === 0 && <p className="text-muted">Hozircha salonlar yo'q.</p>}
                    {shops.map(shop => (
                        <Col md={6} key={shop.id || shop._id}>
                            <Card className="shadow-sm h-100">
                                <Card.Body>
                                    <Card.Title>{shop.name}</Card.Title>
                                    <Card.Text>{shop.address || "Manzil ma'lumotlari mavjud emas"}</Card.Text>
                                    <div className="text-muted small">Telefon: {shop.phone || '—'}</div>
                                    {shop.instagram && <div className="text-muted small">Instagram: @{shop.instagram}</div>}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default PublicShops;
