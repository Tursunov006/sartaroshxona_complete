import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/bookings`)
      .then(r => setBookings(r.data))
      .catch(() => setError("Ma'lumotlarni yuklashda xatolik"))
      .finally(() => setLoading(false));
  }, []);

  const today    = new Date().toISOString().split('T')[0];
  const stats = [
    { label: 'Jami bronlar',       value: bookings.length,
      icon: '📅', color: '#667EEA', bg: '#EEF2FF' },
    { label: 'Bugungi bronlar',    value: bookings.filter(b => b.date === today).length,
      icon: '🕐', color: '#36b9cc', bg: '#E0F7FA' },
    { label: 'Kutilmoqda',         value: bookings.filter(b => b.status === 'pending').length,
      icon: '⏳', color: '#f6c23e', bg: '#FFFDE7' },
    { label: 'Eslatma yuborilgan', value: bookings.filter(b => b.reminderSent).length,
      icon: '🤖', color: '#1cc88a', bg: '#E8F5E9' },
  ];

  const statusBadge = (s) => ({
    pending:   <Badge bg="warning"  text="dark">Kutilmoqda</Badge>,
    confirmed: <Badge bg="success">Tasdiqlangan</Badge>,
    cancelled: <Badge bg="danger">Bekor qilindi</Badge>,
    completed: <Badge bg="info">Bajarildi</Badge>,
  }[s] || <Badge bg="secondary">{s}</Badge>);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fw-bold">📊 Dashboard</h2>
        <small className="text-muted">{new Date().toLocaleDateString('uz-UZ', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</small>
      </div>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" style={{color:'#667EEA'}} /></div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          {/* Statistika */}
          <Row className="g-3 mb-4">
            {stats.map((s, i) => (
              <Col lg={3} md={6} key={i}>
                <Card className="border-0 shadow-sm h-100" style={{borderRadius:'16px'}}>
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="text-muted small mb-1">{s.label}</div>
                        <h2 className="mb-0 fw-bold" style={{color: s.color}}>{s.value}</h2>
                      </div>
                      <div style={{
                        width:56, height:56, borderRadius:'50%',
                        background: s.bg, display:'flex',
                        alignItems:'center', justifyContent:'center', fontSize:24
                      }}>{s.icon}</div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* So'nggi bronlar */}
          <Card className="border-0 shadow-sm" style={{borderRadius:'16px'}}>
            <Card.Header className="bg-white fw-bold py-3" style={{borderRadius:'16px 16px 0 0'}}>
              📋 So'nggi bronlar
            </Card.Header>
            <Card.Body className="p-0">
              <Table hover responsive className="mb-0">
                <thead className="table-light">
                  <tr><th>Mijoz</th><th>Telefon</th><th>Xizmat</th><th>Sartarosh</th><th>Sana</th><th>Vaqt</th><th>Holat</th></tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 8).map(b => (
                    <tr key={b._id}>
                      <td className="fw-bold">{b.customerName}</td>
                      <td>{b.customerPhone}</td>
                      <td><Badge bg="light" text="dark">{b.serviceName || b.serviceId}</Badge></td>
                      <td>{b.barberName || b.barberId}</td>
                      <td>{b.date}</td>
                      <td><strong>{b.time}</strong></td>
                      <td>{statusBadge(b.status)}</td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr><td colSpan="7" className="text-center text-muted py-4">Hali bron yo'q</td></tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default Dashboard;
