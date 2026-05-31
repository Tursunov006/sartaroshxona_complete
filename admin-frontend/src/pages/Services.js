import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Services = () => {
  const [services, setServices]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showAdd, setShowAdd]     = useState(false);
  const [form, setForm]           = useState({ name:'', price:'', duration:'' });
  const [saving, setSaving]       = useState(false);

  const load = () => {
    setLoading(true);
    axios.get(`${API_URL}/services`)
      .then(r => setServices(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleAdd = async () => {
    if (!form.name || !form.price || !form.duration) return;
    setSaving(true);
    await axios.post(`${API_URL}/services`, form);
    setSaving(false);
    setShowAdd(false);
    setForm({ name:'', price:'', duration:'' });
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xizmatni o'chirishni tasdiqlaysizmi?")) return;
    await axios.delete(`${API_URL}/services/${id}`);
    load();
  };

  const fmtPrice = n => Number(n).toLocaleString('uz-UZ') + ' so\'m';

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fw-bold">✂️ Xizmatlar</h2>
        <Button style={{background:'linear-gradient(135deg,#667EEA,#764BA2)', border:'none'}}
          onClick={() => setShowAdd(true)}>+ Yangi xizmat</Button>
      </div>

      <Card className="border-0 shadow-sm" style={{borderRadius:'16px'}}>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5"><Spinner animation="border" style={{color:'#667EEA'}} /></div>
          ) : (
            <Table hover responsive className="mb-0">
              <thead className="table-light">
                <tr><th>#</th><th>Xizmat nomi</th><th>Narxi</th><th>Davomiyligi</th><th>Amallar</th></tr>
              </thead>
              <tbody>
                {services.map((s, i) => (
                  <tr key={s.id || s._id}>
                    <td className="text-muted">{i+1}</td>
                    <td className="fw-bold">✂️ {s.name}</td>
                    <td><Badge bg="light" text="dark" style={{fontSize:13}}>{fmtPrice(s.price)}</Badge></td>
                    <td>⏱ {s.duration} daqiqa</td>
                    <td>
                      <Button size="sm" variant="outline-danger"
                        onClick={() => handleDelete(s.id || s._id)}>🗑 O'chirish</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showAdd} onHide={() => setShowAdd(false)} centered>
        <Modal.Header closeButton><Modal.Title>+ Yangi xizmat qo'shish</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Xizmat nomi</Form.Label>
            <Form.Control value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="Soch olish" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Narxi (so'm)</Form.Label>
            <Form.Control type="number" value={form.price} onChange={e => setForm({...form, price:e.target.value})} placeholder="50000" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Davomiyligi (daqiqa)</Form.Label>
            <Form.Control type="number" value={form.duration} onChange={e => setForm({...form, duration:e.target.value})} placeholder="30" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAdd(false)}>Bekor qilish</Button>
          <Button style={{background:'linear-gradient(135deg,#667EEA,#764BA2)', border:'none'}}
            onClick={handleAdd} disabled={saving}>
            {saving ? 'Saqlanmoqda...' : 'Saqlash'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Services;
