export const corridorRooms = ['crew-quarters', 'galley', 'engine-room'];

// Completion of the cockpit or airlock must never power these room indicators.
export function corridorLighting(completedRoomIds = []) {
  const doors = corridorRooms.filter(id => completedRoomIds.includes(id));
  return { doors, ceiling: doors.length === corridorRooms.length };
}
