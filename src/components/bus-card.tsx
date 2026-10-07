import { Link } from '@tanstack/react-router';
import { ArrowUpRight, BusFront, Clock3, ShieldCheck, Users, Route as RouteIcon } from 'lucide-react';
import { Button } from './ui/button';
import { freshness, type Bus } from '@/lib/transport';
export function BusCard({ bus, optimal = false }: { bus: Bus; optimal?: boolean }) {
 const status = bus.breakdown ? 'Breakdown' : bus.delay ? `Delayed · ${bus.delay} min` : 'On time';
 return <article className={`bus-card ${optimal ? 'bus-optimal' : ''}`}>
  <div className="bus-card-top"><span className="bus-icon"><BusFront size={22}/></span><span className="service-label">{bus.service}</span>{bus.pass && <span className="pass-badge">FREE / PASS</span>}</div>
  <div className="bus-heading"><h3>APSRTC <span>• {bus.id}</span></h3>{optimal && <span className="best-label">BEST CHOICE</span>}</div>
  <p className="registration">Vehicle Registration · {bus.registration}</p><p className="operator-label">{bus.operator} • APSRTC</p>
  <div className="arrival"><strong>{bus.breakdown ? '—' : bus.eta}<span>{!bus.breakdown && ' min'}</span></strong><span>ETA at your Bus Stop</span></div>
  <div className="bus-details"><span><Clock3 size={15}/>{status}<i className={`status-dot ${bus.breakdown ? 'negative' : bus.delay ? 'warning' : 'positive'}`}/></span><span><Users size={15}/>{bus.crowd} crowding<i className={`status-dot ${bus.crowd === 'High' ? 'negative' : bus.crowd === 'Medium' ? 'warning' : 'positive'}`}/></span><span><RouteIcon size={15}/>{bus.route === 'Normal' ? 'Normal route' : 'Route Change'}<i className={`status-dot ${bus.route === 'Normal' ? 'positive' : 'warning'}`}/></span></div>
  <div className="bus-freshness"><ShieldCheck size={13}/><span>{freshness(bus)}<small>{bus.reported ? 'Passenger reported' : 'Verified demo data'}</small></span></div>
  <Button asChild variant="ghost" className="bus-report-link"><Link to="/report">Report this bus <ArrowUpRight/></Link></Button>
 </article>;
}
