import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Button, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PublicHome = () => {
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [shops, setShops] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [serviceRes, barberRes, shopRes, reviewRes] = await Promise.all([
          axios.get(`${API_URL}/services`),
          axios.get(`${API_URL}/barbers`),
          axios.get(`${API_URL}/shops`),
          axios.get(`${API_URL}/reviews`)
        ]);
        if (!mounted) return;
        setServices(serviceRes.data || []);
        setBarbers(barberRes.data || []);
        setShops(shopRes.data || []);
        setReviews(reviewRes.data.slice(0, 4) || []);
      } catch (err) {
        console.error(err);
      } finally {
        mounted && setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <div className="p-4 rounded-4 shadow-sm mb-4" style={{ background: 'linear-gradient(135deg, #667EEA, #764BA2)', color: '#fff' }}>
        <h1 className="display-5 fw-bold">Sartaroshxona platformasi</h1>
        <p className="lead">Eng yaqin salonlarni toping, xizmat tanlang, sartaroshni bron qiling va sharh-qayta ishlamang.</p>
        <div className="d-flex flex-wrap gap-2">
          <Button as={Link} to="/public/booking" variant="light">Bron qilish</Button>
          <Button as={Link} to="/public/map" variant="outline-light">Xaritada qidirish</Button>
          <Button as={Link} to="/public/reviews" variant="outline-light">Sharh qoldirish</Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : (
        <>
          <Row className="g-4 mb-4">
            <Col md={6} lg={4}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <h5>Xizmatlar</h5>
                  <p className="text-muted">Mashhur xizmatlar va narxlar.</p>
                  {services.slice(0, 4).map(service => (
                    <div key={service.id || service._id} className="mb-2">
                      <strong>{service.name}</strong>
                      <div className="text-muted small">{Number(service.price).toLocaleString('uz-UZ')} so'm · {service.duration} min</div>
                    </div>
                  ))}
                  <Button as={Link} to="/public/services" variant="primary" className="mt-3">Barcha xizmatlar</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <h5>Sartaroshlar</h5>
                  <p className="text-muted">Yaxshi baholangan sartaroshlar.</p>
                  {barbers.slice(0, 4).map(barber => (
                    <div key={barber.id || barber._id} className="mb-2">
                      <strong>{barber.name}</strong>
                      <div className="text-muted small">{barber.instagram ? `@${barber.instagram}` : 'Instagram yo‘q'}</div>
                    </div>
                  ))}
                  <Button as={Link} to="/public/barbers" variant="primary" className="mt-3">Barcha sartaroshlar</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={12} lg={4}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <h5>Salonlar</h5>
                  <p className="text-muted">Yaqqol ko‘rinishdagi yaqin salonlar.</p>
                  {shops.slice(0, 4).map(shop => (
                    <div key={shop.id || shop._id} className="mb-2">
                      <strong>{shop.name}</strong>
                      <div className="text-muted small">{shop.address || 'Manzil yo‘q'}</div>
                    </div>
                  ))}
                  <Button as={Link} to="/public/shops" variant="primary" className="mt-3">Salonlarni ko‘rish</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">So‘nggi sharhlar</h4>
              <Button as={Link} to="/public/reviews" variant="outline-secondary" size="sm">Barcha sharhlar</Button>
            </div>
            <Row className="g-3">
              {reviews.length === 0 && <p className="text-muted">Hozircha sharhlar yo‘q.</p>}
              {reviews.map(review => (
                <Col md={6} lg={3} key={review.id || review._id}>
                  <Card className="h-100 shadow-sm">
                    <Card.Body>
                      <Badge bg="warning" text="dark" className="mb-2">{review.rating}⭐</Badge>
                      <div className="fw-bold mb-2">{review.userName || 'Mehmon'}</div>
                      <p className="small text-muted">{review.comment || 'Sharh mavjud emas'}</p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </>
      )}
    </div>
  );
};

export default PublicHome;
