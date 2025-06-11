const { computeAssignments } = require('../src/assign');

test('assignation séquentielle', () => {
  const res = computeAssignments({ startRoom: 1, startDay: 1, daysInMonth: 3 });
  expect(res).toEqual(['1', '2', '3']);
});

test('ignore les chambres exclues', () => {
  const res = computeAssignments({ startRoom: 1, startDay: 1, daysInMonth: 2, excludedRooms: [1] });
  expect(res[0]).toBe('2');
});

test('prend en compte les chambres liées', () => {
  const res = computeAssignments({ startRoom: 1, startDay: 1, daysInMonth: 2, linkedRooms: { 1: [10] } });
  expect(res[0]).toBe('1 / 10');
  expect(res[1]).toBe('2');
});
