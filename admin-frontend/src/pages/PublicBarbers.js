import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PublicBarbers = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    axios.get(`${API_URL}/barbers`).then(res => {
      if (mounted) setBarbers(res.data || []);
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="public-page">
      <div className="section-title mb-4">
        <h2>Sartaroshlar</h2>
        <span>O‘z xizmatini biladigan sartaroshlar</span>
      </div>
      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : (
        <Row className="g-4">
          {barbers.length === 0 && <p className="text-muted">Hozircha sartaroshlar mavjud emas.</p>}
          {barbers.map(barber => (
            <Col md={6} lg={4} key={barber.id || barber._id}>
              <Card className="feature-card card-modern h-100 p-4 barber-card">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="mb-1">{barber.name}</h5>
                    <div className="small-note">Sartaroshning maxsus xizmatlari bilan bron qiling.</div>
                  </div>
                  <Badge bg="secondary" pill>Top</Badge>
                </div>
                <div className="small-note">Instagram: {barber.instagram ? `@${barber.instagram}` : 'Yo‘q'}</div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default PublicBarbers;
