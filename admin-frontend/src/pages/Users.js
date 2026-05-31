import React, { useState, useEffect } from 'react';
import { Card, Table, Spinner, Button } from 'react-bootstrap';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    axios.get(`${API_URL}/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setUsers(r.data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const del = async (id) => {
    if (!window.confirm('Foydalanuvchini o\'chirishni tasdiqlaysizmi?')) return;
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  return (
    <div>
      <h2 className="fw-bold mb-4">👥 Foydalanuvchilar</h2>
      <Card className="border-0 shadow-sm" style={{ borderRadius: 16 }}>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5"><Spinner animation="border" style={{ color: '#667EEA' }} /></div>
          ) : (
            <Table hover responsive className="mb-0">
              <thead className="table-light"><tr><th>#</th><th>Ism</th><th>Email</th><th>Telefon</th><th>Role</th><th>Amallar</th></tr></thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-4 text-muted">Foydalanuvchilar topilmadi</td></tr>
                ) : users.map((u, i) => (
                  <tr key={u.id}>
                    <td className="text-muted">{i + 1}</td>
                    <td className="fw-bold">{u.fullName}</td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td>{u.role}</td>
                    <td><Button size="sm" variant="outline-danger" onClick={() => del(u.id)}>🗑 O'chirish</Button></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Users;
