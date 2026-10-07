import { Link } from '@tanstack/react-router';
import { ArrowUpRight, MoveUpRight, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { useTransport } from '@/lib/transport-context';
const nav = [{ to: '/', label: 'Journey' }, { to: '/buses', label: 'Find a Bus' }, { to: '/status', label: 'Transport Status' }, { to: '/report', label: 'Passenger Report' }] as const;
export function MovitHeader() {
  return <header className="site-header"><div className="header-inner"><Link to="/" className="brand" aria-label="MOVIT home"><span className="brand-mark"><MoveUpRight size={23}/></span>MOVIT<span className="brand-period">.</span></Link><nav aria-label="Main navigation">{nav.map(item => <Link key={item.to} to={item.to} activeOptions={{ exact: true }} activeProps={{ className: 'nav-active' }}>{item.label}</Link>)}</nav><span className="demo-pill"><span/> DEMO MODE</span></div></header>;
}
export function MovitFooter() {
  return <footer className="site-footer"><div><Link to="/" className="footer-brand">MOVIT.</Link><span>Move smarter. Wait less.</span></div><p>DEMO DATA — NOT LIVE APSRTC INFORMATION</p><Button variant="link" asChild><Link to="/about">About MOVIT <ArrowUpRight/></Link></Button></footer>;
}
export function DemoNotice() { return <div className="demo-notice"><span className="status-dot warning"/><span>DEMO DATA — NOT LIVE APSRTC INFORMATION</span><span className="notice-detail">Bus labels, routes and timings are simulated.</span></div>; }
export function PageTitle({ number, eyebrow, title, subtitle }: { number: string; eyebrow: string; title: string; subtitle: string }) {
  return <div className="page-title"><div className="eyebrow"><span>{number}</span> {eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div>;
}
export function ResetDemo() {
 const { reset } = useTransport();
 return <Button variant="ghost" onClick={reset}><RotateCcw/>Reset demo</Button>;
}
