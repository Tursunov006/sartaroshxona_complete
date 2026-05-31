import React, { useEffect, useRef, useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function MapSearch() {
    const mapRef = useRef(null);
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                // try to get user location
                const pos = await new Promise((resolve) => {
                    if (!navigator.geolocation) return resolve(null);
                    navigator.geolocation.getCurrentPosition(p => resolve(p.coords), () => resolve(null));
                });

                const lat = pos ? pos.latitude : 41.2995;
                const lng = pos ? pos.longitude : 69.2401;

                const res = await fetch(`${API}/shops/nearby?lat=${lat}&lng=${lng}&radius=10`);
                const arr = await res.json();
                if (!mounted) return;
                setShops(arr || []);

                // init map
                if (window.L && !mapRef.current) {
                    const map = window.L.map('map').setView([lat, lng], 13);
                    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        maxZoom: 19,
                        attribution: '&copy; OpenStreetMap'
                    }).addTo(map);

                    mapRef.current = map;
                }

                // add markers
                if (mapRef.current) {
                    arr.forEach(s => {
                        if (s.lat == null || s.lng == null) return;
                        const m = window.L.marker([s.lat, s.lng]).addTo(mapRef.current);
                        m.bindPopup(`<b>${s.name}</b><br/>${s.address || ''}<br/>${s.phone || ''}<br/>${s.distance != null ? s.distance + ' km' : ''}`);
                    });
                }

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
        return () => { mounted = false; };
    }, []);

    return (
        <div>
            <h3 className="mb-3">Xaritada qidirish</h3>
            {loading && <div className="text-muted">Yuklanmoqda...</div>}
            <div id="map" style={{ height: 500, borderRadius: 8 }} />
            <div className="mt-3">
                <h5>Topilgan salonlar</h5>
                <ul>
                    {shops.map(s => (
                        <li key={s.id}>{s.name} — {s.address} {s.distance ? `(${s.distance} km)` : ''}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
