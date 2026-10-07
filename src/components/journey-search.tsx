import { useState, type FormEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, ArrowRightLeft, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { locations } from '@/lib/transport';
import { useTransport } from '@/lib/transport-context';
export function JourneySearch() {
 const transport = useTransport();
 const [from, setFrom] = useState(transport.from);
 const [to, setTo] = useState(transport.to);
 const [error, setError] = useState('');
 const navigate = useNavigate();
 function submit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const pickedFrom = String(data.get('from') ?? from);
  const pickedTo = String(data.get('to') ?? to);
  if (pickedFrom === pickedTo) { setError('Choose a different destination Bus Stop.'); return; }
  setFrom(pickedFrom); setTo(pickedTo);
  transport.setJourney(pickedFrom, pickedTo);
  navigate({ to: '/buses' });
 }
 return <form className="journey-form" onSubmit={submit}>
  <div className="journey-fields"><label className="journey-field"><span><MapPin size={15}/>FROM · BUS STOP</span><select name="from" aria-label="From Bus Stop" value={from} onChange={e => { setFrom(e.target.value); setError(''); }}>{locations.map(place => <option key={place}>{place}</option>)}</select></label>
  <Button type="button" variant="outline" size="icon" className="swap-button" aria-label="Swap Bus Stops" title="Swap Bus Stops" onClick={() => { setFrom(to); setTo(from); setError(''); }}><ArrowRightLeft/></Button>
  <label className="journey-field"><span><MapPin size={15}/>TO · BUS STOP</span><select name="to" aria-label="To Bus Stop" value={to} onChange={e => { setTo(e.target.value); setError(''); }}>{locations.map(place => <option key={place}>{place}</option>)}</select></label>
  <Button className="search-button" type="submit">Find my best bus <ArrowRight/></Button></div>
  {error && <p className="form-error" role="alert">{error}</p>}
  <div className="search-footnote"><span className="status-dot positive"/>Andhra Pradesh <span className="footnote-separator">/</span> Next 60 minutes <span className="footnote-end">A better journey starts here.</span></div>
 </form>;
}
