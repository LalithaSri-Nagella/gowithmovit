import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { PageTitle, DemoNotice } from '@/components/movit-shell';
import { BusCard } from '@/components/bus-card';
import { Button } from '@/components/ui/button';
import { useTransport } from '@/lib/transport-context';
import { recommend, type PassengerReport } from '@/lib/transport';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/report')({ head: () => pageHead('Passenger Report', 'Share simulated crowding, delay and route updates. See MOVIT recommendations change with your passenger report.'), component: ReportPage });
function ReportPage() {
 const { buses, report } = useTransport();
 const [id, setId] = useState('500');
 const [values, setValues] = useState<PassengerReport>({crowd:'Low',status:'On time',route:'Normal',comment:''});
 const [confirmation, setConfirmation] = useState('');
 const bus = buses.find(b=>b.id===id);
 const change = <K extends keyof PassengerReport>(key:K,value:PassengerReport[K]) => {setValues(current=>({...current,[key]:value}));setConfirmation('');};
 return <main className="page-content"><DemoNotice/><PageTitle number="04" eyebrow="TRAVEL TOGETHER" title="Your update matters." subtitle="Share what you see. Help the next passenger make a better choice."/><div className="report-layout"><form className="report-form" onSubmit={e=>{e.preventDefault();report(id,values);setConfirmation('Report submitted. Bus conditions and recommendations updated.');}}><label>Bus<select aria-label="Bus" value={id} onChange={e=>{setId(e.target.value);setConfirmation('');const next=buses.find(b=>b.id===e.target.value);if(next)setValues({crowd:next.crowd,status:next.breakdown?'Breakdown':next.delay?'Delayed':'On time',route:next.route,comment:''});}}>{buses.map(b=><option value={b.id} key={b.id}>APSRTC • {b.id} — {b.service}</option>)}</select></label>
 <fieldset><legend>Crowding</legend><div className="segmented-control">{(['Low','Medium','High'] as const).map(c=><Button type="button" variant="outline" aria-pressed={values.crowd===c} className={`segment ${values.crowd===c?'segment-selected':''}`} key={c} onClick={()=>change('crowd',c)}>{c}</Button>)}</div></fieldset>
 <fieldset><legend>Bus status</legend><div className="segmented-control">{(['On time','Delayed','Breakdown'] as const).map(s=><Button type="button" variant="outline" aria-pressed={values.status===s} className={`segment ${values.status===s?'segment-selected':''}`} key={s} onClick={()=>change('status',s)}>{s}</Button>)}</div></fieldset>
 <fieldset><legend>Route status</legend><div className="segmented-control">{(['Normal','Route changed'] as const).map(r=><Button type="button" variant="outline" aria-pressed={values.route===r} className={`segment ${values.route===r?'segment-selected':''}`} key={r} onClick={()=>change('route',r)}>{r}</Button>)}</div></fieldset>
 <label>Comment <span className="sr-only">(optional)</span><textarea placeholder="Anything else? (optional)" aria-label="Comment" maxLength={300} value={values.comment} onChange={e=>change('comment',e.target.value)}/></label><Button type="submit" className="report-submit">Submit passenger report <ArrowRight/></Button>{confirmation&&<div className="report-confirmation" role="status"><CheckCircle2 size={20}/><div>{confirmation}<span>Optimal Bus: APSRTC • {recommend(buses)?.id ?? 'none available'}. Demo updates last for this session.</span></div></div>}</form><aside className="report-preview"><h2>Selected bus · Current demo conditions</h2>{bus&&<BusCard bus={bus}/>}</aside></div></main>;
}
