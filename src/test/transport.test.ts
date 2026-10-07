import { describe, expect, it } from 'vitest';
import { initialBuses, availableBuses, recommend, applyReport, defaultFilters, type Bus } from '@/lib/transport';
const base = initialBuses[0];
describe('MOVIT transport rules', () => {
 it('includes arrivals from 0 through 60 minutes only and sorts earliest first', () => {
  const buses: Bus[] = [61,60,-1,0,7].map(eta=>({...base, id:String(eta),eta}));
  expect(availableBuses(buses).map(b=>b.eta)).toEqual([0,7,60]);
 });
 it('keeps all four available APSRTC demo services visible', () => {
  expect(availableBuses(initialBuses).map(b=>b.id)).toEqual(['512','500','555','700']);
 });
 it('recommends 500 at 7 minutes instead of crowded delayed 512 at 4 minutes', () => {
  expect(recommend(initialBuses)?.id).toBe('500');
 });
 it('switches to 555 when passenger reports high crowding on 500 without hiding options', () => {
  const buses=initialBuses.map(b=>b.id==='500'?applyReport(b,{crowd:'High',status:'On time',route:'Normal',comment:''},1000):b);
  expect(recommend(buses,1000)?.id).toBe('555');
  expect(availableBuses(buses)).toHaveLength(4);
 });
 it('records passenger route, delay and freshness immediately', () => {
  const bus=applyReport(base,{crowd:'Medium',status:'Delayed',route:'Route changed',comment:' Alternate stop '},12345);
  expect(bus).toMatchObject({crowd:'Medium',delay:5,route:'Route changed',comment:'Alternate stop',reported:true,updatedAt:12345});
 });
 it('excludes reported breakdowns from available and recommended buses', () => {
  const broken=applyReport(base,{crowd:'Low',status:'Breakdown',route:'Normal',comment:''},1000);
  expect(availableBuses([broken])).toEqual([]);
  expect(recommend([broken])).toBeUndefined();
 });
 it('filters services by explicit category', () => {
  expect(availableBuses(initialBuses,{...defaultFilters,service:'Express'}).map(b=>b.id)).toEqual(['512']);
 });
 it('filters operators without claiming private demo buses exist', () => {
  expect(availableBuses(initialBuses,{...defaultFilters,operator:'Private'})).toEqual([]);
 });
 it('uses explicit pass eligibility rather than all government buses', () => {
  expect(availableBuses(initialBuses,{...defaultFilters,fare:'Free / Pass Eligible'}).map(b=>b.id)).toEqual(['500']);
  expect(availableBuses(initialBuses,{...defaultFilters,fare:'Paid'}).map(b=>b.id)).toEqual(['512','555','700']);
 });
 it('does not rank buses based on free fare or government operator', () => {
  const normal={...base,pass:false,operator:'Private' as const,eta:7};
  const worse={...base,id:'free',eta:20,pass:true};
  expect(recommend([worse,normal])?.id).toBe('500');
 });
 it('penalizes stale information when all journey conditions are equal', () => {
  expect(recommend([{...base,id:'old',updatedAt:1000},{...base,id:'fresh',updatedAt:1200000}],1200000)?.id).toBe('fresh');
 });
 it('penalizes route changes when arrival conditions are equal', () => {
  expect(recommend([{...base,id:'changed',route:'Route changed'},{...base,id:'normal'}])?.id).toBe('normal');
 });
});
