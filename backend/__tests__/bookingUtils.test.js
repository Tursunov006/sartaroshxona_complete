const { hasConflict, t2m } = require('../utils/bookingUtils');

describe('bookingUtils', () => {
  const services = [
    { id: 's1', name: 'Haircut', duration: 30 },
    { id: 's2', name: 'Shave', duration: 20 }
  ];

  test('t2m converts time correctly', () => {
    expect(t2m('00:00')).toBe(0);
    expect(t2m('01:30')).toBe(90);
    expect(t2m('23:59')).toBe(23*60+59);
  });

  test('detects conflict when overlapping', () => {
    const existing = [{ barberId: 'b1', date: '2026-06-01', time: '10:00', serviceId: 's1', status: 'pending' }];
    const newBooking = { barberId: 'b1', date: '2026-06-01', time: '10:15', serviceId: 's1' };
    const c = hasConflict(existing, newBooking, services);
    expect(c).not.toBeNull();
  });

  test('no conflict when different barber', () => {
    const existing = [{ barberId: 'b2', date: '2026-06-01', time: '10:00', serviceId: 's1', status: 'pending' }];
    const newBooking = { barberId: 'b1', date: '2026-06-01', time: '10:15', serviceId: 's1' };
    const c = hasConflict(existing, newBooking, services);
    expect(c).toBeNull();
  });

  test('no conflict when times do not overlap', () => {
    const existing = [{ barberId: 'b1', date: '2026-06-01', time: '09:00', serviceId: 's1', status: 'pending' }];
    const newBooking = { barberId: 'b1', date: '2026-06-01', time: '10:00', serviceId: 's1' };
    const c = hasConflict(existing, newBooking, services);
    expect(c).toBeNull();
  });
});
