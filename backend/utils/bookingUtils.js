function t2m(t) {
    const [hh, mm] = t.split(':').map(Number);
    return hh * 60 + mm;
}

function hasConflict(bookings = [], newBooking = {}, services = []) {
    const { barberId, date, time, serviceId } = newBooking;
    const service = services.find(s => s.id === serviceId) || {};
    const reqStart = t2m(time);
    const reqEnd = reqStart + Number(service.duration || 30);

    return bookings.find(b => {
        if (b.barberId !== barberId) return false;
        if (b.date !== date) return false;
        if (b.status === 'cancelled') return false;
        const existingService = services.find(s => s.id === b.serviceId) || {};
        const existDur = Number(existingService.duration || 30);
        const existStart = t2m(b.time);
        const existEnd = existStart + existDur;
        return (reqStart < existEnd && existStart < reqEnd);
    }) || null;
}

module.exports = { hasConflict, t2m };
