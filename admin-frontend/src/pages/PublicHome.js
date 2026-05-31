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
    const loadData = async () => {
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
        setReviews((reviewRes.data || []).slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="public-page">
      <section className="public-hero p-5 mb-5">
        <Row className="align-items-center gy-4">
          <Col lg={6}>
            <span className="public-label">Sartaroshxona.uz</span>
            <h1 className="display-5 fw-bold my-4">O‘z uslubingizni toping va ko‘rinishingizni yangilang.</h1>
            <p className="lead text-white-75 mb-4">Tez bron, chinakam sharhlar va yaqin atrofdagi salonlar — hammasi bitta platformada.</p>
            <div className="d-flex flex-wrap gap-3">
              <Button as={Link} to="/public/booking" className="btn-modern btn-light">Bron qilish</Button>
              <Button as={Link} to="/public/services" className="btn-modern btn-outline-light">Xizmatlar</Button>
            </div>
            <div className="hero-stats mt-5">
              <div className="hero-stat">
                <span className="section-note">Salonlar</span>
                <strong>{shops.length || 12}+</strong>
              </div>
              <div className="hero-stat">
                <span className="section-note">Sartaroshlar</span>
                <strong>{barbers.length || 8}+</strong>
              </div>
              <div className="hero-stat">
                <span className="section-note">Sharhlar</span>
                <strong>{reviews.length || 24}+</strong>
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <Card className="glass-card p-4 h-100">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <div className="text-muted">Dinamik bron</div>
                  <h3 className="mb-0">Har bir xizmat shaxsiylashtirilgan</h3>
                </div>
                <Badge bg="secondary" pill className="status-badge">Ishonchli</Badge>
              </div>
              <div className="list-panel">
                <h4>Platformaning afzalliklari</h4>
                <ul className="small-note mb-0">
                  <li>Chiroyli interfeys va tezkor qidiruv</li>
                  <li>Har bir bron uchun real tasdiq</li>
                  <li>Salon va sartarosh topish endi oson</li>
                </ul>
              </div>
            </Card>
          </Col>
        </Row>
      </section>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : (
        <>
          <div className="section-title">
            <h2>Asosiy xizmatlar</h2>
            <span>Tez va ishonchli tanlovlar</span>
          </div>

          <Row className="g-4 mb-4">
            {services.slice(0, 4).map(service => (
              <Col md={6} lg={3} key={service.id || service._id}>
                <Card className="feature-card card-modern h-100 p-4">
                  <div className="service-badge mb-3">{service.duration} min</div>
                  <h5>{service.name}</h5>
                  <div className="mt-4 fw-bold">{Number(service.price).toLocaleString('uz-UZ')} so'm</div>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="section-title mt-5">
            <h2>Ustalar</h2>
            <span>O‘z xizmatini biladigan sartaroshlar</span>
          </div>
          <Row className="g-4 mb-4">
            {barbers.slice(0, 4).map(barber => (
              <Col md={6} lg={3} key={barber.id || barber._id}>
                <Card className="feature-card card-modern h-100 p-4 barber-card">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5>{barber.name}</h5>
                      <div className="small-note">Instagram: {barber.instagram ? `@${barber.instagram}` : 'mavjud emas'}</div>
                    </div>
                    <span className="badge-trend">Top</span>
                  </div>
                  <p className="small-note mb-0">Sartaroshning maxsus xizmatlarini tanlang va o‘z vaqtingizni tejang.</p>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="section-title mt-5">
            <h2>Sharhlar</h2>
            <span>Mijozlarimiz nimani maqtashadi</span>
          </div>
          <Row className="g-4">
            {reviews.length === 0 ? (
              <p className="text-muted">Hozircha sharhlar yo‘q.</p>
            ) : (
              reviews.map(review => (
                <Col md={6} lg={3} key={review.id || review._id}>
                  <Card className="quote-card feature-card card-modern h-100 p-4">
                    <Badge bg="warning" text="dark" className="mb-3">{review.rating}⭐</Badge>
                    <div className="fw-bold mb-2">{review.userName || 'Mehmon'}</div>
                    <p className="text-muted small mb-0">{review.comment || 'Sharh mavjud emas'}</p>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </>
      )}
    </div>
  );
};

export default PublicHome;
