import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Spinner, Button } from 'react-bootstrap';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AILogs = () => {
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    axios.get(`${API_URL}/auth/ai-logs`)
      .then(r => setLogs(r.data))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fw-bold">🤖 AI Eslatmalar</h2>
        <Button variant="outline-primary" size="sm" onClick={load}>🔄 Yangilash</Button>
      </div>

      {/* Info box */}
      <div className="alert" style={{background:'#EEF2FF', border:'1px solid #667EEA', borderRadius:12, color:'#667EEA'}}>
        <strong>🤖 AI Reminder tizimi:</strong> Bron vaqtidan 2 soat oldin mijozga avtomatik eslatma yuboradi.
        Scheduler har 5 daqiqada tekshiradi.
      </div>

      <Card className="border-0 shadow-sm" style={{borderRadius:'16px'}}>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5"><Spinner animation="border" style={{color:'#667EEA'}} /></div>
          ) : (
            <Table hover responsive className="mb-0">
              <thead className="table-light">
                <tr><th>#</th><th>Mijoz</th><th>Telefon</th><th>Bron vaqti</th><th>Holat</th><th>Yuborildi</th></tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <div style={{fontSize:48}}>🤖</div>
                      <div className="text-muted mt-2">Hali AI eslatma yuborilmagan</div>
                      <small className="text-muted">Bron vaqtiga 2 soat qolganda avtomatik yuboriladi</small>
                    </td>
                  </tr>
                ) : logs.map((log, i) => (
                  <tr key={log.id}>
                    <td className="text-muted">{i+1}</td>
                    <td className="fw-bold">{log.customerName}</td>
                    <td>📞 {log.customerPhone}</td>
                    <td><strong>{log.date}</strong> ⏰ {log.time}</td>
                    <td><Badge bg="success">✅ Yuborildi</Badge></td>
                    <td className="text-muted small">
                      {new Date(log.sentAt).toLocaleString('uz-UZ')}
                    </td>
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

export default AILogs;
