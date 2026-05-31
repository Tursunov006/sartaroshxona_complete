import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PublicRegister = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/auth/register`, {
                fullName,
                email,
                phone,
                password,
                role: 'client'
            });
            localStorage.setItem('publicToken', res.data.token);
            localStorage.setItem('publicUser', JSON.stringify(res.data.user));
            navigate('/public');
        } catch (err) {
            setError(err.response?.data?.error || 'Ro‘yxatdan o‘tishda xatolik yuz berdi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page d-flex align-items-center min-vh-100">
            <Container>
                <Row className="justify-content-center gx-4">
                    <Col lg={10}>
                        <Row className="g-4 align-items-stretch">
                            <Col lg={5}>
                                <div className="auth-side h-100 d-flex flex-column justify-content-center">
                                    <h3 className="mb-3">Ro‘yxatdan o‘tish</h3>
                                    <p className="mb-4">Hisob yarating va bronlaringizni boshqaring, xizmatlarni tez olib boring.</p>
                                    <ul>
                                        <li>Foydali imtiyozlar</li>
                                        <li>Oson monitoring</li>
                                        <li>Avvalgi buyurtmalar</li>
                                    </ul>
                                </div>
                            </Col>
                            <Col lg={7}>
                                <Card className="auth-card h-100 p-4">
                                    <Card.Body>
                                        <h3 className="mb-3">Hisob yarating</h3>
                                        <p className="text-muted">Hisobni tez va ishonchli tarzda yaratib, xizmatlarni boshqaring.</p>
                                        {error && <Alert variant="danger">{error}</Alert>}
                                        <Form onSubmit={handleSubmit}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>To‘liq ism</Form.Label>
                                                <Form.Control className="form-control-modern" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Ismingiz" />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control className="form-control-modern" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="example@mail.com" />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Telefon</Form.Label>
                                                <Form.Control className="form-control-modern" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+998901234567" />
                                            </Form.Group>
                                            <Form.Group className="mb-4">
                                                <Form.Label>Parol</Form.Label>
                                                <Form.Control className="form-control-modern" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
                                            </Form.Group>
                                            <Button type="submit" className="btn-modern btn-light" disabled={loading}>
                                                {loading ? 'Yuborilmoqda...' : 'Ro‘yxatdan o‘tish'}
                                            </Button>
                                        </Form>
                                        <div className="mt-3 text-center text-muted">
                                            Hisobingiz bor? <Link to="/public/login">Kirish</Link>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default PublicRegister;
