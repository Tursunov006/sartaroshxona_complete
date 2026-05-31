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
        <div className="public-page">
            <section className="public-hero p-5 mb-5">
                <Row className="align-items-center gy-4">
                    <Col lg={7}>
                        <span className="public-label">Sartaroshxona.uz</span>
                        <h1 className="display-5 fw-bold my-4">Sizga eng yaqin sartaroshni topish va bron qilish oson.</h1>
                        <p className="lead text-white-75 mb-4">Eng yaqin salonlarni toping, xizmatlarni solishtiring va bronni bir necha soniyada yakunlang.</p>
                        <div className="d-flex flex-wrap gap-3">
                            <Button as={Link} to="/public/booking" variant="light" className="btn-modern">Bron qilish</Button>
                            <Button as={Link} to="/public/map" variant="outline-light" className="btn-modern">Xaritada qidirish</Button>
                        </div>
                        <Row className="g-3 mt-4">
                            <Col md={4}>
                                <Card className="glass-card p-3 h-100">
                                    <div className="text-muted mb-2">Salonlar</div>
                                    <h3 className="mb-0">{shops.length || 12}+</h3>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card className="glass-card p-3 h-100">
                                    <div className="text-muted mb-2">Sartaroshlar</div>
                                    <h3 className="mb-0">{barbers.length || 8}+</h3>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card className="glass-card p-3 h-100">
                                    <div className="text-muted mb-2">Sharhlar</div>
                                    <h3 className="mb-0">{reviews.length || 24}+</h3>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={5}>
                        <Card className="glass-card p-4 h-100">
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <div className="text-muted">Ajoyib xizmat</div>
                                        <h3 className="mb-0">Har bir bron tez va ishonchli</h3>
                                    </div>
                                    <Badge bg="info" pill>Yangi</Badge>
                                </div>
                                <p className="text-muted">Platformamiz yordamida mijozlar, sartaroshlar va salonlar bir joyda birlashadi.</p>
                            </div>
                            <div className="d-grid gap-3">
                                <div className="p-3 border rounded-4 bg-white">
                                    <strong>24/7 onlayn bron</strong>
                                    <p className="mb-0 text-muted small">Har doim kerakli vaqtda band qiling.</p>
                                </div>
                                <div className="p-3 border rounded-4 bg-white">
                                    <strong>Real baholar</strong>
                                    <p className="mb-0 text-muted small">Foydalanuvchi sharhlari asosida eng yaxshi sartaroshlar.</p>
                                </div>
                                <div className="p-3 border rounded-4 bg-white">
                                    <strong>Xavfsiz ma'lumotlar</strong>
                                    <p className="mb-0 text-muted small">Foydalanuvchi va salon ma'lumotlari himoyalangan.</p>
                                </div>
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
                        <span>Eng ko‘p tanlangan variantlar</span>
                    </div>
                    <Row className="g-4 mb-4">
                        {services.slice(0, 4).map(service => (
                            <Col md={6} lg={3} key={service.id || service._id}>
                                <Card className="feature-card card-modern h-100 p-4">
                                    <div className="mb-3 text-muted">{service.duration} min</div>
                                    <h5>{service.name}</h5>
                                    <div className="mt-3 fs-5 fw-bold">{Number(service.price).toLocaleString('uz-UZ')} so'm</div>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <div className="section-title mt-5">
                        <h2>Tez bron</h2>
                        <span>Siz uchun mos keluvchi sartaroshlar</span>
                    </div>
                    <Row className="g-4 mb-4">
                        {barbers.slice(0, 4).map(barber => (
                            <Col md={6} lg={3} key={barber.id || barber._id}>
                                <Card className="feature-card card-modern h-100 p-4">
                                    <h5>{barber.name}</h5>
                                    <div className="text-muted small">Instagram: {barber.instagram ? `@${barber.instagram}` : 'mavjud emas'}</div>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <div className="section-title mt-5">
                        <h2>Sharhlar</h2>
                        <span>So‘nggi mijoz mulohazalari</span>
                    </div>
                    <Row className="g-4">
                        {reviews.length === 0 ? (
                            <p className="text-muted">Hozircha sharhlar yo‘q.</p>
                        ) : (
                            reviews.map(review => (
                                <Col md={6} lg={3} key={review.id || review._id}>
                                    <Card className="feature-card card-modern h-100 p-4">
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
