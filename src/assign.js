function computeAssignments({ startRoom, startDay, daysInMonth, excludedRooms = [], linkedRooms = {} }) {
  const visited = new Set();
  const assignments = [];
  let room = startRoom;
  for (let i = startDay - 1; i < daysInMonth; i++) {
    let safety = 0;
    while (excludedRooms.includes(room) || visited.has(room)) {
      room++;
      if (room > 54) room = 1;
      if (++safety > 54) break;
    }
    const rooms = [room];
    const linked = linkedRooms[room] || [];
    linked.forEach(r => {
      if (!excludedRooms.includes(r) && !visited.has(r) && !rooms.includes(r)) {
        rooms.push(r);
      }
    });
    rooms.forEach(r => visited.add(r));
    assignments.push(rooms.join(' / '));
    room++;
    if (room > 54) room = 1;
  }
  return assignments;
}

module.exports = { computeAssignments };
