import { createFileRoute } from '@tanstack/react-router';
import { TriangleAlert } from 'lucide-react';
import { PageTitle, DemoNotice, ResetDemo } from '@/components/movit-shell';
import { BusCard } from '@/components/bus-card';
import { useTransport } from '@/lib/transport-context';
import { availableBuses } from '@/lib/transport';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/status')({ head: () => pageHead('Transport Status', 'See simulated APSRTC bus delays, crowding, service disruption and route alerts in the MOVIT demo.'), component: StatusPage });
function StatusPage() {
 const { buses, from, to } = useTransport();
 const metrics = [{label:'Available in the next hour',value:availableBuses(buses).length},{label:'Delayed buses',value:buses.filter(b=>b.delay>0).length},{label:'High crowding',value:buses.filter(b=>b.crowd==='High').length},{label:'Route alerts',value:buses.filter(b=>b.route!=='Normal').length}];
 return <main className="page-content"><DemoNotice/><PageTitle number="03" eyebrow="STAY INFORMED" title="Know before you go." subtitle={`${from} → ${to} · A clear view of your demo transport conditions.`}/><div className="status-summary">{metrics.map(m=><div key={m.label}><strong>{m.value.toString().padStart(2,'0')}</strong><span>{m.label}</span></div>)}</div><div className="status-heading"><h2>Current bus status</h2><ResetDemo/></div><div className="bus-grid">{buses.map(bus=><BusCard key={bus.id} bus={bus}/>)}</div>{buses.filter(b=>b.route!=='Normal'||b.breakdown).map(b=><div className="route-alert" key={b.id}><TriangleAlert size={18}/><span>APSRTC • {b.id} — {b.breakdown ? 'Breakdown reported. Service unavailable.' : 'Route Change: alternate route in this demo.'}{b.comment ? ` Passenger Report: ${b.comment}` : ''}</span></div>)}</main>;
}
