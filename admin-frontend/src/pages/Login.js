import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Login = () => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (res.data.user.role === 'admin') {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        window.location.href = '/dashboard';
      } else {
        setError('Siz admin emassiz!');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Email yoki parol noto\'g\'ri');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100"
      style={{ background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)' }}>
      <Container style={{ maxWidth: '420px' }}>
        <Card className="border-0 shadow-lg" style={{ borderRadius: 20 }}>
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <div style={{
                width: 72, height: 72, borderRadius: '50%', margin: '0 auto 16px',
                background: 'linear-gradient(135deg, #667EEA, #764BA2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32
              }}>✂️</div>
              <h4 className="fw-bold">Sartaroshxona.uz</h4>
              <p className="text-muted">Admin panelga kirish</p>
            </div>

            {error && <Alert variant="danger" className="py-2">{error}</Alert>}

            {/* Test uchun hint */}
            <div className="alert py-2 mb-3" style={{background:'#EEF2FF', border:'1px solid #667EEA', borderRadius:10, fontSize:13}}>
              <strong>Test kirish:</strong><br/>
              📧 admin@sartaroshxona.uz<br/>
              🔑 admin123
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={email}
                  onChange={e => setEmail(e.target.value)} required
                  placeholder="admin@sartaroshxona.uz" />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Parol</Form.Label>
                <Form.Control type="password" value={password}
                  onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••" />
              </Form.Group>
              <Button type="submit" className="w-100 py-2 fw-bold" disabled={loading}
                style={{ background: 'linear-gradient(135deg, #667EEA, #764BA2)', border: 'none', borderRadius: 10 }}>
                {loading ? '⏳ Kirilmoqda...' : '🔐 Kirish'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Login;
