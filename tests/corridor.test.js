import test from 'node:test';
import assert from 'node:assert/strict';
import { corridorLighting, corridorRooms } from '../src/corridor.js';

test('corridor lights belong only to completed rooms, ceiling requires all three', () => {
  assert.deepEqual(corridorLighting(['cockpit','airlock']), {doors:[], ceiling:false});
  for (let mask=0;mask<8;mask++) {
    const ids=corridorRooms.filter((_,i)=>mask & (1<<i));
    const result=corridorLighting([...ids,...ids,'cockpit']);
    assert.deepEqual(result.doors,ids);
    assert.equal(result.ceiling,mask===7);
  }
});
