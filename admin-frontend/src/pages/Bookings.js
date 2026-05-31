import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Spinner, Button, Form, InputGroup, Modal } from 'react-bootstrap';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const statusColors = { pending:'warning', confirmed:'success', cancelled:'danger', completed:'info' };
const statusLabels = { pending:'Kutilmoqda', confirmed:'Tasdiqlangan', cancelled:'Bekor qilindi', completed:'Bajarildi' };

const Bookings = () => {
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState('all');
  const [selected, setSelected]   = useState(null);
  const [showModal, setShowModal] = useState(false);

  const load = () => {
    setLoading(true);
    axios.get(`${API_URL}/bookings`)
      .then(r => setBookings(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const changeStatus = async (id, status) => {
    await axios.patch(`${API_URL}/bookings/${id}/status`, { status });
    load();
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Bronni o'chirishni tasdiqlaysizmi?")) return;
    await axios.delete(`${API_URL}/bookings/${id}`);
    load();
  };

  const filtered = bookings
    .filter(b => filter === 'all' || b.status === filter)
    .filter(b => {
      const q = search.toLowerCase();
      return !q ||
        b.customerName?.toLowerCase().includes(q) ||
        b.customerPhone?.includes(q) ||
        b.date?.includes(q);
    });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fw-bold">📋 Bronlar</h2>
        <Button variant="outline-primary" size="sm" onClick={load}>🔄 Yangilash</Button>
      </div>

      {/* Filter qatori */}
      <div className="d-flex gap-2 mb-3 flex-wrap">
        <InputGroup style={{maxWidth:280}}>
          <InputGroup.Text>🔍</InputGroup.Text>
          <Form.Control placeholder="Mijoz yoki telefon..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </InputGroup>
        {['all','pending','confirmed','completed','cancelled'].map(s => (
          <Button key={s} size="sm"
            variant={filter === s ? 'primary' : 'outline-secondary'}
            onClick={() => setFilter(s)}>
            {s === 'all' ? 'Hammasi' : statusLabels[s]}
          </Button>
        ))}
      </div>

      <Card className="border-0 shadow-sm" style={{borderRadius:'16px'}}>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5"><Spinner animation="border" style={{color:'#667EEA'}} /></div>
          ) : (
            <Table hover responsive className="mb-0">
              <thead className="table-light">
                <tr><th>#</th><th>Mijoz</th><th>Telefon</th><th>Xizmat</th><th>Sartarosh</th><th>Sana / Vaqt</th><th>Holat</th><th>Amallar</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="8" className="text-center text-muted py-5">Bronlar topilmadi</td></tr>
                ) : filtered.map((b, i) => (
                  <tr key={b._id}>
                    <td className="text-muted">{i+1}</td>
                    <td className="fw-bold">{b.customerName}</td>
                    <td>
                      <a href={`tel:${b.customerPhone}`} className="text-decoration-none">
                        📞 {b.customerPhone}
                      </a>
                    </td>
                    <td>{b.serviceName || b.serviceId}</td>
                    <td>{b.barberName || b.barberId}</td>
                    <td>
                      <strong>{b.date}</strong><br/>
                      <small className="text-muted">⏰ {b.time}</small>
                    </td>
                    <td>
                      <Form.Select size="sm" style={{minWidth:140}}
                        value={b.status}
                        onChange={e => changeStatus(b._id, e.target.value)}>
                        {Object.entries(statusLabels).map(([k,v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </Form.Select>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button size="sm" variant="outline-info"
                          onClick={() => { setSelected(b); setShowModal(true); }}>👁</Button>
                        <Button size="sm" variant="outline-danger"
                          onClick={() => deleteBooking(b._id)}>🗑</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
        {filtered.length > 0 && (
          <Card.Footer className="bg-white text-muted small py-2 px-3" style={{borderRadius:'0 0 16px 16px'}}>
            Jami: {filtered.length} ta bron
          </Card.Footer>
        )}
      </Card>

      {/* Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>📋 Bron tafsiloti</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <div className="d-flex flex-column gap-2">
              {[
                ['👤 Mijoz',    selected.customerName],
                ['📞 Telefon',  selected.customerPhone],
                ['✂️ Xizmat',   selected.serviceName || selected.serviceId],
                ['💈 Sartarosh',selected.barberName || selected.barberId],
                ['📅 Sana',     selected.date],
                ['⏰ Vaqt',     selected.time],
                ['🤖 Eslatma',  selected.reminderSent ? '✅ Yuborildi' : '⏳ Kutilmoqda'],
                ['🕐 Yaratildi',new Date(selected.createdAt).toLocaleString('uz-UZ')],
              ].map(([k, v]) => (
                <div key={k} className="d-flex justify-content-between p-2 bg-light rounded">
                  <span className="fw-bold text-muted small">{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Yopish</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Bookings;
