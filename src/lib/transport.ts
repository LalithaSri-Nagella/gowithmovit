export const locations = ['Tirupati', 'Chittoor', 'Renigunta', 'Chandragiri', 'Pileru', 'Rangampeta'] as const;
export function journeyFromSearch(search: Record<string, unknown>) {
  const known = (value: unknown) => typeof value === 'string' && (locations as readonly string[]).includes(value);
  const from = known(search['from']) ? String(search['from']) : '';
  const to = known(search['to']) ? String(search['to']) : '';
  return from && to && from !== to ? { from, to } : null;
}
export type Crowd = 'Low' | 'Medium' | 'High';
export type Bus = { id: string; registration: string; service: string; operator: 'Government' | 'Private'; pass: boolean; eta: number; delay: number; crowd: Crowd; route: 'Normal' | 'Route changed'; breakdown: boolean; updatedAt: number; reported: boolean; comment?: string };
export const initialBuses: Bus[] = [
  { id: '500', registration: 'AP15Z1234', service: 'Palle Velugu', operator: 'Government', pass: true, eta: 7, delay: 0, crowd: 'Low', route: 'Normal', breakdown: false, updatedAt: 0, reported: false },
  { id: '512', registration: 'AP03TA4821', service: 'Express', operator: 'Government', pass: false, eta: 4, delay: 5, crowd: 'High', route: 'Normal', breakdown: false, updatedAt: 0, reported: false },
  { id: '555', registration: 'AP39U7612', service: 'Deluxe', operator: 'Government', pass: false, eta: 11, delay: 0, crowd: 'Medium', route: 'Normal', breakdown: false, updatedAt: 0, reported: false },
  { id: '700', registration: 'AP04X9137', service: 'Super Luxury', operator: 'Government', pass: false, eta: 24, delay: 2, crowd: 'Low', route: 'Route changed', breakdown: false, updatedAt: 0, reported: false },
];
export type Filters = { service: string; operator: string; fare: string };
export const defaultFilters: Filters = { service: 'All', operator: 'All', fare: 'All' };
export function availableBuses(buses: Bus[], filters: Filters = defaultFilters) {
  return buses.filter(b => !b.breakdown && b.eta >= 0 && b.eta <= 60 && (filters.service === 'All' || b.service === filters.service) && (filters.operator === 'All' || b.operator === filters.operator) && (filters.fare === 'All' || (filters.fare === 'Free / Pass Eligible' ? b.pass : !b.pass))).sort((a, b) => a.eta - b.eta);
}
function cost(b: Bus, now: number) {
  const age = b.updatedAt ? Math.max(0, (now - b.updatedAt) / 60000) : 2;
  return b.eta + b.delay * 1.5 + ({ Low: 0, Medium: 5, High: 16 }[b.crowd]) + (b.route === 'Normal' ? 0 : 22) + Math.min(age, 30) * 0.25;
}
export function recommend(buses: Bus[], now = Date.now()): Bus | undefined {
  return availableBuses(buses).sort((a, b) => cost(a, now) - cost(b, now))[0];
}
export type PassengerReport = { crowd: Crowd; status: 'On time' | 'Delayed' | 'Breakdown'; route: Bus['route']; comment: string };
export function applyReport(bus: Bus, report: PassengerReport, now: number): Bus {
  return { ...bus, crowd: report.crowd, delay: report.status === 'Delayed' ? 5 : 0, breakdown: report.status === 'Breakdown', route: report.route, comment: report.comment.trim(), reported: true, updatedAt: now };
}
export function explanation(bus: Bus, buses: Bus[]) {
  const fastest = availableBuses(buses)[0];
  const arrival = fastest && fastest.id !== bus.id ? 'A little later than the first bus, but a better overall journey.' : 'A short wait and the best overall journey among your options.';
  const conditions = `${bus.crowd === 'Low' ? 'Low crowding' : bus.crowd === 'Medium' ? 'Moderate crowding' : 'Despite high crowding'}, ${bus.delay === 0 ? 'no reported delay' : 'a reported delay'}, and ${bus.route === 'Normal' ? 'a normal route' : 'an alternate route'}.`;
  return `${arrival} ${conditions}${bus.pass ? ' Free / Pass Eligible in this demo.' : ''}`;
}
export function freshness(bus: Bus, now = Date.now()) {
  if (!bus.updatedAt) return 'Updated 2 min ago';
  const minutes = Math.max(0, Math.floor((now - bus.updatedAt) / 60000));
  return minutes === 0 ? 'Updated just now' : `Updated ${minutes} min ago`;
}
