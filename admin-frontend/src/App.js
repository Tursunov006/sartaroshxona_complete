import React from 'react';
import './styles/PublicTheme.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Services from './pages/Services';
import Bookings from './pages/Bookings';
import Settings from './pages/Settings';
import Users from './pages/Users';
import AILogs from './pages/AILogs';
import Shops from './pages/Shops';
import Barbers from './pages/Barbers';
import Reviews from './pages/Reviews';
import Payments from './pages/Payments';
import CalendarPage from './pages/Calendar';
import PublicBooking from './pages/PublicBooking';
import MapSearch from './pages/MapSearch';
import PublicHome from './pages/PublicHome';
import PublicServices from './pages/PublicServices';
import PublicBarbers from './pages/PublicBarbers';
import PublicShops from './pages/PublicShops';
import PublicReviews from './pages/PublicReviews';
import PublicLogin from './pages/PublicLogin';
import PublicRegister from './pages/PublicRegister';

function App() {
    return (
        <BrowserRouter>
            <div className="container py-4">
                <nav className="mb-3">
                    <strong>Admin panel:</strong> {' '}
                    <Link to="/">Dashboard</Link> | <Link to="/services">Xizmatlar</Link> | <Link to="/bookings">Bronlar</Link> | <Link to="/settings">Sozlamalar</Link> | <Link to="/users">Foydalanuvchilar</Link> | <Link to="/shops">Salonlar</Link> | <Link to="/barbers">Sartaroshlar</Link> | <Link to="/reviews">Sharhlar</Link> | <Link to="/payments">To‘lovlar</Link> | <Link to="/calendar">Kalendar</Link>
                </nav>
                <nav className="mb-4">
                    <strong>Mijoz sayti:</strong> {' '}
                    <Link to="/public">Bosh sahifa</Link> | <Link to="/public/services">Xizmatlar</Link> | <Link to="/public/barbers">Sartaroshlar</Link> | <Link to="/public/shops">Salonlar</Link> | <Link to="/public/reviews">Sharhlar</Link> | <Link to="/public/booking">Bron</Link> | <Link to="/public/map">Xarita</Link> | <Link to="/public/login">Kirish</Link> | <Link to="/public/register">Ro‘yxatdan o‘tish</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/bookings" element={<Bookings />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/ai-logs" element={<AILogs />} />
                    <Route path="/shops" element={<Shops />} />
                    <Route path="/barbers" element={<Barbers />} />
                    <Route path="/reviews" element={<Reviews />} />
                    <Route path="/payments" element={<Payments />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/public" element={<PublicHome />} />
                    <Route path="/public/services" element={<PublicServices />} />
                    <Route path="/public/barbers" element={<PublicBarbers />} />
                    <Route path="/public/shops" element={<PublicShops />} />
                    <Route path="/public/reviews" element={<PublicReviews />} />
                    <Route path="/public/booking" element={<PublicBooking />} />
                    <Route path="/public/map" element={<MapSearch />} />
                    <Route path="/public/login" element={<PublicLogin />} />
                    <Route path="/public/register" element={<PublicRegister />} />
                    <Route path="/public-booking" element={<PublicBooking />} />
                    <Route path="/map" element={<MapSearch />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
