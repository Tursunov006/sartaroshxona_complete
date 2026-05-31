import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
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
    }).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <h2 className="mb-4">Sartaroshlar</h2>
      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : (
        <Row className="g-3">
          {barbers.length === 0 && <p className="text-muted">Hozircha sartaroshlar mavjud emas.</p>}
          {barbers.map(barber => (
            <Col md={6} key={barber.id || barber._id}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title>{barber.name}</Card.Title>
                  <Card.Text className="text-muted">Sartaroshning maxsus xizmatlari bilan bron qiling.</Card.Text>
                  <div className="text-muted small">Instagram: {barber.instagram ? `@${barber.instagram}` : 'Yo‘q'}</div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default PublicBarbers;
