import React from 'react';
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

function App() {
    return (
        <BrowserRouter>
            <div className="container py-4">
                <nav className="mb-4">
                    <Link to="/">Dashboard</Link> | <Link to="/services">Services</Link> | <Link to="/bookings">Bookings</Link> | <Link to="/settings">Settings</Link> | <Link to="/users">Users</Link> | <Link to="/shops">Shops</Link> | <Link to="/barbers">Barbers</Link> | <Link to="/reviews">Reviews</Link> | <Link to="/payments">Payments</Link> | <Link to="/calendar">Calendar</Link> | <Link to="/public-booking">Public Booking</Link> | <Link to="/map">Map Search</Link>
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
                    <Route path="/public-booking" element={<PublicBooking />} />
                    <Route path="/map" element={<MapSearch />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
