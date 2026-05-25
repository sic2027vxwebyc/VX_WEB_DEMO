const { calculateScheduleState, getProgress } = require('../src/utils/scheduleTime');

// Mock data
const mockEvents = [
  { id: '1', normalizedTime: '09:00', day: 'friday', title: 'Session 1' },
  { id: '2', normalizedTime: '10:00', day: 'friday', title: 'Session 2' },
  { id: '3', normalizedTime: '11:00', day: 'friday', title: 'Session 3' }
];

// Helper to create date
function createDate(time) {
  const [h, m] = time.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  // Set day to Friday
  const currentDay = d.getDay(); // 0 is Sunday, 5 is Friday
  const diff = 5 - currentDay;
  d.setDate(d.getDate() + diff);
  return d;
}

console.log('--- Schedule Logic Verification ---');

// Case 1: Before all events
const state1 = calculateScheduleState(mockEvents, createDate('08:00'));
console.log('08:00 - Before First:', state1.nextEvent.title === 'Session 1' ? 'PASS' : 'FAIL');
console.log('08:00 - Current:', state1.currentEvent === null ? 'PASS' : 'FAIL');

// Case 2: During first event
const state2 = calculateScheduleState(mockEvents, createDate('09:15'));
console.log('09:15 - During First:', state2.currentEvent.title === 'Session 1' ? 'PASS' : 'FAIL');
console.log('09:15 - Progress:', getProgress(state2.currentEvent, createDate('09:15')) === 25 ? 'PASS' : 'FAIL'); // (15/60)*100

// Case 3: Between events
const state3 = calculateScheduleState(mockEvents, createDate('10:00'));
console.log('10:00 - At Start of Second:', state3.currentEvent.title === 'Session 2' ? 'PASS' : 'FAIL');

// Case 4: After all events
const state4 = calculateScheduleState(mockEvents, createDate('12:00'));
console.log('12:00 - After All:', state4.allCompleted ? 'PASS' : 'FAIL');
console.log('12:00 - Next:', state4.nextEvent === null ? 'PASS' : 'FAIL');
