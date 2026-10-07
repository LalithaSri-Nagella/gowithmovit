import { useEffect, useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight, BusFront, Sparkles, TriangleAlert } from 'lucide-react';
import { useTransport } from '@/lib/transport-context';
import { availableBuses, defaultFilters, recommend, explanation, journeyFromSearch } from '@/lib/transport';
import { pageHead } from '@/lib/page-head';
import { PageTitle, DemoNotice } from '@/components/movit-shell';
import { BusCard } from '@/components/bus-card';
import { Button } from '@/components/ui/button';
export const Route = createFileRoute('/buses')({ validateSearch: (search: Record<string, unknown>): { from?: string; to?: string } => ({ from: typeof search['from'] === 'string' ? search['from'] : undefined, to: typeof search['to'] === 'string' ? search['to'] : undefined }), head: () => pageHead('Find a Bus', 'Compare every simulated bus arriving within 60 minutes and find the best overall journey with MOVIT.'), component: BusesPage });
function BusesPage() {
 const { buses, from: currentFrom, to: currentTo, setJourney } = useTransport();
 const search = Route.useSearch();
 const [filters, setFilters] = useState(defaultFilters);
 const available = availableBuses(buses, filters);
 const best = recommend(available);
 const journey = journeyFromSearch(search) ?? { from: currentFrom, to: currentTo };
 useEffect(() => { const picked = journeyFromSearch(search); if (picked && (picked.from !== currentFrom || picked.to !== currentTo)) setJourney(picked.from, picked.to); }, [search, currentFrom, currentTo, setJourney]);
 return <main className="page-content"><DemoNotice/><PageTitle number="02" eyebrow="YOUR OPTIONS" title="A better bus. A better journey." subtitle="Every arrival in the next hour, with the details that matter."/><div className="journey-summary">{journey.from}<ArrowRight size={18}/>{journey.to}<Button variant="link" asChild><Link to="/">Change journey</Link></Button></div>
 <div className="filters">{([{key:'service',label:'Service Type',options:['All','Palle Velugu','Express','Super Luxury','Deluxe','City Bus']},{key:'operator',label:'Operator',options:['All','Government','Private']},{key:'fare',label:'Fare',options:['All','Free / Pass Eligible','Paid']}] as const).map(filter => <label key={filter.key}>{filter.label}<select aria-label={filter.label} value={filters[filter.key]} onChange={e => setFilters({...filters,[filter.key]:e.target.value})}>{filter.options.map(option => <option key={option}>{option}</option>)}</select></label>)}<span className="filter-count">{available.length} buses · Earliest arrival first</span></div>
 <div className="section-heading"><span className="section-number"><BusFront size={14}/></span><h2>Available Buses — Next 1 Hour</h2></div>
 {available.length ? <div className="bus-grid">{available.map(bus => <BusCard key={bus.id} bus={bus} optimal={bus.id===best?.id}/>)}</div> : <div className="empty-state"><BusFront size={30}/><h3>No buses available in the next hour.</h3><p>{filters.service !== 'All' || filters.operator !== 'All' || filters.fare !== 'All' ? 'Try a different filter to see more options.' : 'Please try a different journey.'}</p><Button variant="link" onClick={() => setFilters(defaultFilters)}>Clear filters</Button></div>}
 {best && <section className="recommendation" aria-live="polite"><div className="section-heading"><span className="section-number"><Sparkles size={14}/></span><h2>Optimal Bus</h2><p>The right bus, not just the fastest.</p></div><div className="recommendation-body" key={`${best.id}-${best.updatedAt}`}><div><div className="eyebrow"><Sparkles size={13}/>RECOMMENDED FOR YOU</div><h3>APSRTC • {best.id}</h3><div className="recommendation-status"><span>{best.eta} min away</span><span>{best.crowd} crowding</span><span>{best.delay ? 'Delayed' : 'On time'}</span></div></div><div className="recommendation-why"><h4>Why this bus?</h4><p>{explanation(best, available)}</p></div></div></section>}
 {buses.filter(b=>b.route!=='Normal' || b.breakdown).map(b=><div className="route-alert" key={b.id}><TriangleAlert size={17}/><span><strong>{b.breakdown ? 'Service unavailable' : 'Route Change'} · APSRTC • {b.id}</strong> — {b.breakdown ? 'Breakdown reported. This bus is excluded from available options.' : 'An alternate route is shown in the demo.'}</span></div>)}
 </main>;
}
