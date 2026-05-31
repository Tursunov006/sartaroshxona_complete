import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Table, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Shops = () => {
    const [shops, setShops] = useState([]);
    const [error, setError] = useState('');
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState({ name: '', address: '', phone: '', lat: '', lng: '', instagram: '' });
    const [editId, setEditId] = useState(null);

    const token = localStorage.getItem('token');

    const load = () => {
        axios.get(`${API_URL}/shops`)
            .then(r => setShops(r.data || []))
            .catch(() => setError('Shops yuklanishda xato'));
    };

    useEffect(() => { load(); }, []);

    const handleSave = (e) => {
        e.preventDefault();
        setError('');
        if (!token) return setError('Avvalo admin sifatida tizimga kiring');
        const endpoint = editId ? `${API_URL}/shops/${editId}` : `${API_URL}/shops`;
        const method = editId ? 'patch' : 'post';
        axios[method](endpoint, form, { headers: { Authorization: `Bearer ${token}` } })
            .then(() => {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
                setForm({ name: '', address: '', phone: '', lat: '', lng: '', instagram: '' });
                setEditId(null);
                load();
            })
            .catch(err => setError(err.response?.data?.error || 'Saqlashda xatolik'));
    };

    const handleEdit = (shop) => {
        setEditId(shop.id);
        setForm({ name: shop.name || '', address: shop.address || '', phone: shop.phone || '', lat: shop.lat || '', lng: shop.lng || '', instagram: shop.instagram || '' });
    };

    const handleDelete = (id) => {
        if (!token) return setError('Admin sifatida tizimga kiring');
        axios.delete(`${API_URL}/shops/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(() => load())
            .catch(err => setError(err.response?.data?.error || 'O‘chirishda xatolik'));
    };

    return (
        <div>
            <h2 className="fw-bold mb-4">🏠 Salonlar</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {saved && <Alert variant="success">Ma'lumotlar saqlandi!</Alert>}
            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
                <Card.Body>
                    <Form onSubmit={handleSave}>
                        <Row className="g-3">
                            <Col md={4}><Form.Group><Form.Label>Salon nomi</Form.Label><Form.Control value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Manzil</Form.Label><Form.Control value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Instagram</Form.Label><Form.Control value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} placeholder="@salonname" /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Telefon</Form.Label><Form.Control value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Latitude</Form.Label><Form.Control value={form.lat} onChange={e => setForm({ ...form, lat: e.target.value })} /></Form.Group></Col>
                            <Col md={4}><Form.Group><Form.Label>Longitude</Form.Label><Form.Control value={form.lng} onChange={e => setForm({ ...form, lng: e.target.value })} /></Form.Group></Col>
                        </Row>
                        <div className="mt-3"><Button type="submit" style={{ background: 'linear-gradient(135deg,#667EEA,#764BA2)', border: 'none' }}>{editId ? 'Yangilash' : 'Yangi salon qo‘shish'}</Button></div>
                    </Form>
                </Card.Body>
            </Card>
            <Card className="border-0 shadow-sm" style={{ borderRadius: 16 }}>
                <Card.Header className="bg-white fw-bold py-3">Salonlar ro‘yxati</Card.Header>
                <Card.Body>
                    <Table hover responsive>
                        <thead><tr><th>Nomi</th><th>Manzil</th><th>Telefon</th><th>Instagram</th><th>Xaritada</th><th>Amallar</th></tr></thead>
                        <tbody>
                            {shops.map(shop => (
                                <tr key={shop.id}>
                                    <td>{shop.name}</td>
                                    <td>{shop.address}</td>
                                    <td>{shop.phone}</td>
                                    <td>{shop.instagram ? <a href={`https://instagram.com/${shop.instagram.replace('@', '')}`} target="_blank" rel="noreferrer">{shop.instagram}</a> : '-'}</td>
                                    <td>{shop.lat && shop.lng ? `${shop.lat}, ${shop.lng}` : '-'}</td>
                                    <td>
                                        <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleEdit(shop)}>Tahrirlash</Button>
                                        <Button size="sm" variant="outline-danger" onClick={() => handleDelete(shop.id)}>O‘chirish</Button>
                                    </td>
                                </tr>
                            ))}
                            {shops.length === 0 && <tr><td colSpan="6" className="text-center text-muted py-4">Hech qanday salon yo‘q</td></tr>}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Shops;
