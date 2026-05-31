import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Table, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Barbers = () => {
    const [barbers, setBarbers] = useState([]);
    const [form, setForm] = useState({ name: '', instagram: '' });
    const [selectedId, setSelectedId] = useState(null);
    const [error, setError] = useState('');
    const [saved, setSaved] = useState(false);
    const token = localStorage.getItem('token');

    const load = () => {
        axios.get(`${API_URL}/barbers`).then(r => setBarbers(r.data || [])).catch(() => setError('Yuklash xatolik'));
    };

    useEffect(() => { load(); }, []);

    const handleSave = (e) => {
        e.preventDefault();
        setError('');
        if (!token) return setError('Admin sifatida kirish talab qilinadi');
        const method = selectedId ? 'patch' : 'post';
        const endpoint = selectedId ? `${API_URL}/barbers/${selectedId}` : `${API_URL}/barbers`;
        axios[method](endpoint, form, { headers: { Authorization: `Bearer ${token}` } })
            .then(() => {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
                setForm({ name: '', instagram: '' });
                setSelectedId(null);
                load();
            })
            .catch(err => setError(err.response?.data?.error || 'Xatolik yuz berdi'));
    };

    const handleEdit = (barber) => {
        setSelectedId(barber.id);
        setForm({ name: barber.name || '', instagram: barber.instagram || '' });
    };

    const handleDelete = (id) => {
        if (!token) return setError('Admin sifatida kirish talab qilinadi');
        axios.delete(`${API_URL}/barbers/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(() => load())
            .catch(err => setError(err.response?.data?.error || 'O‘chirishda xato'));
    };

    return (
        <div>
            <h2 className="fw-bold mb-4">💈 Sartaroshlar</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {saved && <Alert variant="success">Saqlash muvaffaqiyatli!</Alert>}
            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
                <Card.Body>
                    <Form onSubmit={handleSave}>
                        <Row className="g-3">
                            <Col md={6}><Form.Group><Form.Label>Ism</Form.Label><Form.Control value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Form.Group></Col>
                            <Col md={6}><Form.Group><Form.Label>Instagram</Form.Label><Form.Control value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} placeholder="@barbername" /></Form.Group></Col>
                        </Row>
                        <div className="mt-3"><Button type="submit" style={{ background: 'linear-gradient(135deg,#667EEA,#764BA2)', border: 'none' }}>{selectedId ? 'Yangilash' : 'Sartarosh qo‘shish'}</Button></div>
                    </Form>
                </Card.Body>
            </Card>
            <Card className="border-0 shadow-sm" style={{ borderRadius: 16 }}>
                <Card.Header className="bg-white fw-bold py-3">Sartaroshlar ro‘yxati</Card.Header>
                <Card.Body>
                    <Table hover responsive>
                        <thead><tr><th>Ism</th><th>Instagram</th><th>Amallar</th></tr></thead>
                        <tbody>
                            {barbers.map(barber => (
                                <tr key={barber.id}>
                                    <td>{barber.name}</td>
                                    <td>{barber.instagram ? <a href={`https://instagram.com/${barber.instagram.replace('@', '')}`} target="_blank" rel="noreferrer">{barber.instagram}</a> : '-'}</td>
                                    <td>
                                        <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleEdit(barber)}>Tahrirlash</Button>
                                        <Button size="sm" variant="outline-danger" onClick={() => handleDelete(barber.id)}>O‘chirish</Button>
                                    </td>
                                </tr>
                            ))}
                            {barbers.length === 0 && <tr><td colSpan="3" className="text-center text-muted py-4">Hali sartaroshlar yo‘q</td></tr>}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Barbers;
