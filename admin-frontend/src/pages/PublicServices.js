import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PublicServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    axios.get(`${API_URL}/services`).then(res => {
      if (mounted) setServices(res.data || []);
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      mounted && setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <h2 className="mb-4">Xizmatlar</h2>
      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : (
        <Row className="g-3">
          {services.length === 0 && <p className="text-muted">Hozircha xizmatlar mavjud emas.</p>}
          {services.map(service => (
            <Col md={6} lg={4} key={service.id || service._id}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title>{service.name}</Card.Title>
                  <Card.Text className="text-muted">{service.duration} daqiqa</Card.Text>
                  <div className="fs-5 fw-bold">{Number(service.price).toLocaleString('uz-UZ')} so'm</div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default PublicServices;
