import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Table, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [shops, setShops] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [form, setForm] = useState({ shopId: '', barberId: '', rating: 5, comment: '', userName: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState({ shopId: '', barberId: '' });
  const token = localStorage.getItem('token');

  const load = () => {
    axios.get(`${API_URL}/reviews`, { params: { shopId: filter.shopId, barberId: filter.barberId } })
      .then(r => setReviews(r.data || []))
      .catch(() => setError('Yuklashda xatolik'));
    axios.get(`${API_URL}/shops`).then(r => setShops(r.data || [])).catch(() => {});
    axios.get(`${API_URL}/barbers`).then(r => setBarbers(r.data || [])).catch(() => {});
  };

  useEffect(() => { load(); }, [filter]);

  const submitReview = (e) => {
    e.preventDefault();
    setError('');
    axios.post(`${API_URL}/reviews`, form)
      .then(() => {
        setSuccess('Fikr qoldirildi');
        setTimeout(() => setSuccess(''), 3000);
        setForm({ shopId: '', barberId: '', rating: 5, comment: '', userName: '' });
        load();
      })
      .catch(err => setError(err.response?.data?.error || 'Xatolik')); 
  };

  const deleteReview = (id) => {
    if (!token) return setError('Admin kirishi kerak');
    axios.delete(`${API_URL}/reviews/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => load())
      .catch(err => setError(err.response?.data?.error || 'O‘chirishda xatolik'));
  };

  return (
    <div>
      <h2 className="fw-bold mb-4">⭐ Sharh va reytinglar</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
        <Card.Body>
          <Form onSubmit={submitReview}>
            <Row className="g-3">
              <Col md={4}><Form.Group><Form.Label>Salon</Form.Label><Form.Select value={form.shopId} onChange={e => setForm({ ...form, shopId: e.target.value, barberId: '' })}><option value="">-- Tanlang --</option>{shops.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</Form.Select></Form.Group></Col>
              <Col md={4}><Form.Group><Form.Label>Sartarosh</Form.Label><Form.Select value={form.barberId} onChange={e => setForm({ ...form, barberId: e.target.value })}><option value="">-- Tanlang --</option>{barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</Form.Select></Form.Group></Col>
              <Col md={4}><Form.Group><Form.Label>Foydalanuvchi</Form.Label><Form.Control value={form.userName} onChange={e => setForm({ ...form, userName: e.target.value })} placeholder="Ism" /></Form.Group></Col>
              <Col md={2}><Form.Group><Form.Label>Reyting</Form.Label><Form.Control type="number" min="1" max="5" value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} /></Form.Group></Col>
              <Col md={10}><Form.Group><Form.Label>Izoh</Form.Label><Form.Control as="textarea" rows={2} value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} /></Form.Group></Col>
            </Row>
            <div className="mt-3"><Button type="submit" style={{ background: 'linear-gradient(135deg,#667EEA,#764BA2)', border: 'none' }}>Sharh qoldirish</Button></div>
          </Form>
        </Card.Body>
      </Card>
      <Card className="border-0 shadow-sm" style={{ borderRadius: 16 }}>
        <Card.Header className="bg-white fw-bold py-3">Sharhlar</Card.Header>
        <Card.Body>
          <Row className="mb-3 g-3">
            <Col md={4}><Form.Select value={filter.shopId} onChange={e => setFilter({ ...filter, shopId: e.target.value })}><option value="">Barchasi</option>{shops.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</Form.Select></Col>
            <Col md={4}><Form.Select value={filter.barberId} onChange={e => setFilter({ ...filter, barberId: e.target.value })}><option value="">Barchasi</option>{barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</Form.Select></Col>
          </Row>
          <Table hover responsive>
            <thead><tr><th>User</th><th>Rating</th><th>Comment</th><th>Salon</th><th>Sartarosh</th><th>Vaxta</th><th>Amallar</th></tr></thead>
            <tbody>{reviews.map(review => (
              <tr key={review.id}>
                <td>{review.userName}</td>
                <td>{review.rating}</td>
                <td>{review.comment}</td>
                <td>{shops.find(s => s.id === review.shopId)?.name || '-'}</td>
                <td>{barbers.find(b => b.id === review.barberId)?.name || '-'}</td>
                <td>{new Date(review.createdAt).toLocaleString('uz-UZ')}</td>
                <td><Button size="sm" variant="outline-danger" onClick={() => deleteReview(review.id)}>O‘chirish</Button></td>
              </tr>
            ))}
            {reviews.length === 0 && <tr><td colSpan="7" className="text-center text-muted py-4">Hech qanday sharh yo‘q</td></tr>}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Reviews;
