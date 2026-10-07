import { createContext, useContext, useState, type ReactNode } from 'react';
import { applyReport, initialBuses, type Bus, type PassengerReport } from './transport';
type TransportState = { buses: Bus[]; from: string; to: string; setJourney: (from: string, to: string) => void; report: (id: string, report: PassengerReport) => void; reset: () => void };
const TransportContext = createContext<TransportState | undefined>(undefined);
export function TransportProvider({ children }: { children: ReactNode }) {
  const [buses, setBuses] = useState(initialBuses);
  const [journey, setJourneyState] = useState({ from: 'Tirupati', to: 'Chittoor' });
  const value: TransportState = { buses, ...journey, setJourney: (from, to) => setJourneyState({ from, to }), report: (id, report) => setBuses(current => current.map(bus => bus.id === id ? applyReport(bus, report, Date.now()) : bus)), reset: () => setBuses(initialBuses.map(b => ({ ...b }))) };
  return <TransportContext.Provider value={value}>{children}</TransportContext.Provider>;
}
export function useTransport() {
  const context = useContext(TransportContext);
  if (!context) throw new Error('TransportProvider is required');
  return context;
}
