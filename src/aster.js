export const asterDestinations={
  "buoy": {
    "title": "Survey buoy",
    "key": "buoyCompleted",
    "repairs": [
      {
        "id": "buoy-power",
        "name": "Buoy power",
        "lesson": "Buoy power",
        "thought": "The buoy survived the crossing. Its reserve cells need a careful restart.",
        "result": "The reserve lights are on. The buoy is holding its position.",
        "action": "Restore expedition equipment",
        "room": "ASTER VEIL",
        "icon": "✦",
        "x": 50,
        "y": 70,
        "moves": 22,
        "ice": [],
        "tileSet": "aster",
        "level": {
          "rows": 7,
          "cols": 7,
          "types": 6
        },
        "goals": [
          {
            "type": 1,
            "target": 21,
            "label": "Energy crystals"
          },
          {
            "type": 0,
            "target": 12,
            "label": "Fuel cells"
          }
        ],
        "target": 33,
        "targetType": null,
        "objective": "Collect 21 energy crystals, 12 fuel cells."
      },
      {
        "id": "buoy-antenna",
        "name": "Survey antenna",
        "lesson": "Survey antenna",
        "thought": "Copper-rich dust has jammed the antenna. Clear its relays and turn it toward the inner planets.",
        "result": "The antenna tracks two expedition signals. Their bearings are stable.",
        "action": "Restore expedition equipment",
        "room": "ASTER VEIL",
        "icon": "✦",
        "x": 65,
        "y": 30,
        "moves": 24,
        "ice": [],
        "tileSet": "aster",
        "level": {
          "rows": 7,
          "cols": 7,
          "types": 6
        },
        "goals": [
          {
            "type": 2,
            "target": 21,
            "label": "Blue comets"
          },
          {
            "type": 3,
            "target": 15,
            "label": "Alien ore"
          }
        ],
        "target": 36,
        "targetType": null,
        "objective": "Collect 21 blue comets, 15 alien ore."
      },
      {
        "id": "buoy-archive",
        "name": "Buoy flight record",
        "lesson": "Buoy flight record",
        "thought": "The last packet is protected. Recover it before we choose where to land.",
        "result": "Routes recovered. The garden world and shattered moon are now accessible.",
        "action": "Restore expedition equipment",
        "room": "ASTER VEIL",
        "icon": "✦",
        "x": 50,
        "y": 48,
        "moves": 26,
        "ice": [
          15,
          19,
          29,
          33
        ],
        "tileSet": "aster",
        "level": {
          "rows": 8,
          "cols": 7,
          "types": 6
        },
        "goals": [
          {
            "type": 4,
            "target": 18,
            "label": "Stars"
          },
          {
            "type": 5,
            "target": 18,
            "label": "Biological cores"
          }
        ],
        "target": 36,
        "targetType": null,
        "objective": "Collect 18 stars, 18 biological cores. Break all protective covers."
      }
    ],
    "logs": [
      {
        "id": "buoy-power-log",
        "repair": "buoy-power",
        "title": "A patient witness",
        "text": "The buoy has counted every crossing since the expedition arrived. Their ships came through together. None of them has returned to Haven.",
        "source": "Expedition log",
        "time": "Aster Veil / Survey buoy 1",
        "unlockAt": 56
      },
      {
        "id": "buoy-antenna-log",
        "repair": "buoy-antenna",
        "title": "Two destinations",
        "text": "One signal comes from a green world. The other rises out of a fracture on a broken moon. Both carry the same expedition signature.",
        "source": "Expedition log",
        "time": "Aster Veil / Survey buoy 2",
        "unlockAt": 57
      },
      {
        "id": "buoy-archive-log",
        "repair": "buoy-archive",
        "title": "Leave the lights on",
        "text": "A recorded voice asks the next ship to restore both outposts. The living samples and mineral record must be compared before anyone follows the deeper signal.",
        "source": "Expedition log",
        "time": "Aster Veil / Survey buoy 3",
        "unlockAt": 58
      }
    ],
    "image": "aster-buoy",
    "clips": [],
    "system": "system2",
    "complete": "Outpost restored. Its record is safe."
  },
  "verdant": {
    "title": "Verdant world",
    "key": "verdantCompleted",
    "repairs": [
      {
        "id": "verdant-pad",
        "name": "Research landing pad",
        "lesson": "Research landing pad",
        "thought": "The plants have reclaimed the pad. Secure the supports before bringing equipment down.",
        "result": "The landing platform is safe and its guide lights are restored.",
        "action": "Restore expedition equipment",
        "room": "ASTER VEIL",
        "icon": "✦",
        "x": 25,
        "y": 76,
        "moves": 23,
        "ice": [],
        "tileSet": "aster",
        "level": {
          "rows": 7,
          "cols": 7,
          "types": 6
        },
        "goals": [
          {
            "type": 3,
            "target": 18,
            "label": "Alien ore"
          },
          {
            "type": 0,
            "target": 15,
            "label": "Fuel cells"
          }
        ],
        "target": 33,
        "targetType": null,
        "objective": "Collect 18 alien ore, 15 fuel cells."
      },
      {
        "id": "verdant-water",
        "name": "Water circulation",
        "lesson": "Water circulation",
        "thought": "The roots are dry. Restart the water loop without disturbing the sealed beds.",
        "result": "Water flows through the greenhouse beds again.",
        "action": "Restore expedition equipment",
        "room": "ASTER VEIL",
        "icon": "✦",
        "x": 26,
        "y": 48,
        "moves": 24,
        "ice": [],
        "tileSet": "aster",
        "level": {
          "rows": 7,
          "cols": 7,
          "types": 6
        },
        "goals": [
          {
            "type": 2,
            "target": 21,
            "label": "Blue comets"
          },
          {
            "type": 1,
            "target": 15,
            "label": "Energy crystals"
          }
        ],
        "target": 36,
        "targetType": null,
        "objective": "Collect 21 blue comets, 15 energy crystals."
      },
      {
        "id": "verdant-power",
        "name": "Greenhouse power",
        "lesson": "Greenhouse power",
        "thought": "Protective relays have isolated the growing lamps. Reconnect them gently.",
        "result": "The growing lamps are online. Pink leaves turn toward the light.",
        "action": "Restore expedition equipment",
        "room": "ASTER VEIL",
        "icon": "✦",
        "x": 25,
        "y": 28,
        "moves": 25,
        "ice": [
          15,
          19,
          29,
          33
        ],
        "tileSet": "aster",
        "level": {
          "rows": 7,
          "cols": 7,
          "types": 6
        },
        "goals": [
          {
            "type": 1,
            "target": 24,
            "label": "Energy crystals"
          },
          {
            "type": 5,
            "target": 12,
            "label": "Biological cores"
          }
        ],
        "target": 36,
        "targetType": null,
        "objective": "Collect 24 energy crystals, 12 biological cores. Break all protective covers."
      },
      {
        "id": "verdant-habitat",
        "name": "Sealed growing beds",
        "lesson": "Sealed growing beds",
        "thought": "The specimen beds need clean air and intact seals. Keep the samples inside their habitat.",
        "result": "The greenhouse is sealed and its living samples are stable.",
        "action": "Restore expedition equipment",
        "room": "ASTER VEIL",
        "icon": "✦",
        "x": 73,
        "y": 50,
        "moves": 26,
        "ice": [
          15,
          19,
          29,
          33
        ],
        "tileSet": "aster",
        "level": {
          "rows": 7,
          "cols": 7,
          "types": 6
        },
        "goals": [
          {
            "type": 5,
            "target": 24,
            "label": "Biological cores"
          },
          {
            "type": 0,
            "target": 15,
            "label": "Fuel cells"
          }
        ],
        "target": 39,
        "targetType": null,
        "objective": "Collect 24 biological cores, 15 fuel cells. Break all protective covers."
      },
      {
        "id": "verdant-scanner",
        "name": "Biological scanner",
        "lesson": "Biological scanner",
        "thought": "Scan one sealed core and recover the expedition comparison data.",
        "result": "The scanner has recovered the living core spectrum.",
        "action": "Restore expedition equipment",
        "room": "ASTER VEIL",
        "icon": "✦",
        "x": 78,
        "y": 25,
        "moves": 28,
        "ice": [
          9,
          12,
          23,
          26,
          37,
          40
        ],
        "tileSet": "aster",
        "level": {
          "rows": 7,
          "cols": 7,
          "types": 6
        },
        "goals": [
          {
            "type": 4,
            "target": 21,
            "label": "Stars"
          },
          {
            "type": 5,
            "target": 21,
            "label": "Biological cores"
          }
        ],
        "target": 42,
        "targetType": null,
        "objective": "Collect 21 stars, 21 biological cores. Break all protective covers."
      },
      {
        "id": "verdant-sample",
        "name": "Sealed sample capsule",
        "lesson": "Sealed sample capsule",
        "thought": "Prepare the sealed research capsule. The greenhouse will keep running while we compare the records.",
        "result": "Research capsule secured. The outpost is alive again.",
        "action": "Restore expedition equipment",
        "room": "ASTER VEIL",
        "icon": "✦",
        "x": 76,
        "y": 75,
        "moves": 30,
        "ice": [
          9,
          12,
          23,
          26,
          37,
          40
        ],
        "tileSet": "aster",
        "level": {
          "rows": 8,
          "cols": 7,
          "types": 6
        },
        "goals": [
          {
            "type": 5,
            "target": 24,
            "label": "Biological cores"
          },
          {
            "type": 2,
            "target": 21,
            "label": "Blue comets"
          }
        ],
        "target": 45,
        "targetType": null,
        "objective": "Collect 24 biological cores, 21 blue comets. Break all protective covers."
      }
    ],
    "logs": [
      {
        "id": "verdant-pad-log",
        "repair": "verdant-pad",
        "title": "A quiet camp",
        "text": "There are no signs of a hurried escape. Someone packed the camp carefully, but left the greenhouse connected to emergency power.",
        "source": "Expedition log",
        "time": "Aster Veil / Verdant world 1",
        "unlockAt": 59
      },
      {
        "id": "verdant-water-log",
        "repair": "verdant-water",
        "title": "Still alive",
        "text": "The first leaves uncurl as water returns. These plants survived months on a trickle. Their glowing cores pulse more slowly than any life I know.",
        "source": "Expedition log",
        "time": "Aster Veil / Verdant world 2",
        "unlockAt": 60
      },
      {
        "id": "verdant-power-log",
        "repair": "verdant-power",
        "title": "Borrowed daylight",
        "text": "The greenhouse lamps copy the blue star outside. The expedition was testing whether these plants could survive inside a station like Haven.",
        "source": "Expedition log",
        "time": "Aster Veil / Verdant world 3",
        "unlockAt": 61
      },
      {
        "id": "verdant-habitat-log",
        "repair": "verdant-habitat",
        "title": "A careful experiment",
        "text": "The notes insist on isolation. This is research, not a harvest. The crew wanted to understand the plants before carrying them anywhere else.",
        "source": "Expedition log",
        "time": "Aster Veil / Verdant world 4",
        "unlockAt": 62
      },
      {
        "id": "verdant-scanner-log",
        "repair": "verdant-scanner",
        "title": "The same rhythm",
        "text": "The core emits a faint regular pulse. The crew marked it for comparison with a mineral sample from the fractured moon.",
        "source": "Expedition log",
        "time": "Aster Veil / Verdant world 5",
        "unlockAt": 63
      },
      {
        "id": "verdant-sample-log",
        "repair": "verdant-sample",
        "title": "A garden behind us",
        "text": "The capsule is aboard, still sealed. Behind us the greenhouse lights shine through the leaves. The other half of the answer is waiting on the moon.",
        "source": "Expedition log",
        "time": "Aster Veil / Verdant world 6",
        "unlockAt": 64
      }
    ],
    "image": "aster-verdant",
    "clips": [],
    "system": "system2",
    "complete": "Outpost restored. Its record is safe."
  },
  "fracture": {
    "title": "Shattered moon",
    "key": "fractureCompleted",
    "repairs": [
      {
        "id": "fracture-bridge",
        "name": "Survey walkway",
        "lesson": "Survey walkway",
        "thought": "The fissure cuts through the approach. Anchor the walkway before crossing.",
        "result": "The walkway is secured across the fracture.",
        "action": "Restore expedition equipment",
        "room": "ASTER VEIL",
        "icon": "✦",
        "x": 25,
        "y": 77,
        "moves": 24,
        "ice": [],
        "tileSet": "aster",
        "level": {
          "rows": 7,
          "cols": 7,
          "types": 6
        },
        "goals": [
          {
            "type": 3,
            "target": 21,
            "label": "Alien ore"
          },
          {
            "type": 0,
            "target": 15,
            "label": "Fuel cells"
          }
        ],
        "target": 36,
        "targetType": null,
        "objective": "Collect 21 alien ore, 15 fuel cells."
      },
      {
        "id": "fracture-generator",
        "name": "Excavation generator",
        "lesson": "Excavation generator",
        "thought": "The generator can power the camp without drilling any deeper. Restore the safe circuits first.",
        "result": "The excavation grid is online. Work lights illuminate the fissure.",
        "action": "Restore expedition equipment",
        "room": "ASTER VEIL",
        "icon": "✦",
        "x": 23,
        "y": 49,
        "moves": 25,
        "ice": [],
        "tileSet": "aster",
        "level": {
          "rows": 7,
          "cols": 7,
          "types": 6
        },
        "goals": [
          {
            "type": 1,
            "target": 24,
            "label": "Energy crystals"
          },
          {
            "type": 0,
            "target": 15,
            "label": "Fuel cells"
          }
        ],
        "target": 39,
        "targetType": null,
        "objective": "Collect 24 energy crystals, 15 fuel cells."
      },
      {
        "id": "fracture-drill",
        "name": "Sample drill controls",
        "lesson": "Sample drill controls",
        "thought": "Release the covered controls and retract the drill. The loose sample tray is all we need.",
        "result": "The drill is parked safely. The mineral tray is accessible.",
        "action": "Restore expedition equipment",
        "room": "ASTER VEIL",
        "icon": "✦",
        "x": 26,
        "y": 28,
        "moves": 27,
        "ice": [
          15,
          19,
          29,
          33
        ],
        "tileSet": "aster",
        "level": {
          "rows": 7,
          "cols": 7,
          "types": 6
        },
        "goals": [
          {
            "type": 3,
            "target": 24,
            "label": "Alien ore"
          },
          {
            "type": 2,
            "target": 15,
            "label": "Blue comets"
          }
        ],
        "target": 39,
        "targetType": null,
        "objective": "Collect 24 alien ore, 15 blue comets. Break all protective covers."
      },
      {
        "id": "fracture-spectrum",
        "name": "Mineral spectrometer",
        "lesson": "Mineral spectrometer",
        "thought": "Bring the spectrometer back online and read the sample without damaging it.",
        "result": "The ore spectrum is recovered. Its pulse matches the research frequency.",
        "action": "Restore expedition equipment",
        "room": "ASTER VEIL",
        "icon": "✦",
        "x": 76,
        "y": 28,
        "moves": 28,
        "ice": [
          15,
          19,
          29,
          33
        ],
        "tileSet": "aster",
        "level": {
          "rows": 7,
          "cols": 7,
          "types": 6
        },
        "goals": [
          {
            "type": 3,
            "target": 24,
            "label": "Alien ore"
          },
          {
            "type": 4,
            "target": 18,
            "label": "Stars"
          }
        ],
        "target": 42,
        "targetType": null,
        "objective": "Collect 24 alien ore, 18 stars. Break all protective covers."
      },
      {
        "id": "fracture-sorter",
        "name": "Protected ore sorter",
        "lesson": "Protected ore sorter",
        "thought": "Clear the sorter safeguards. Recover only the marked research sample.",
        "result": "The marked mineral sample is isolated and secured.",
        "action": "Restore expedition equipment",
        "room": "ASTER VEIL",
        "icon": "✦",
        "x": 77,
        "y": 50,
        "moves": 29,
        "ice": [
          9,
          12,
          23,
          26,
          37,
          40
        ],
        "tileSet": "aster",
        "level": {
          "rows": 7,
          "cols": 7,
          "types": 6
        },
        "goals": [
          {
            "type": 3,
            "target": 27,
            "label": "Alien ore"
          },
          {
            "type": 1,
            "target": 18,
            "label": "Energy crystals"
          }
        ],
        "target": 45,
        "targetType": null,
        "objective": "Collect 27 alien ore, 18 energy crystals. Break all protective covers."
      },
      {
        "id": "fracture-probe",
        "name": "Archive probe",
        "lesson": "Archive probe",
        "thought": "Restore the probe archive and secure the mineral record for comparison in orbit.",
        "result": "The mineral record is aboard. Compare both outpost records in orbit.",
        "action": "Restore expedition equipment",
        "room": "ASTER VEIL",
        "icon": "✦",
        "x": 77,
        "y": 76,
        "moves": 31,
        "ice": [
          9,
          12,
          23,
          26,
          37,
          40
        ],
        "tileSet": "aster",
        "level": {
          "rows": 8,
          "cols": 7,
          "types": 6
        },
        "goals": [
          {
            "type": 2,
            "target": 24,
            "label": "Blue comets"
          },
          {
            "type": 3,
            "target": 24,
            "label": "Alien ore"
          }
        ],
        "target": 48,
        "targetType": null,
        "objective": "Collect 24 blue comets, 24 alien ore. Break all protective covers."
      }
    ],
    "logs": [
      {
        "id": "fracture-bridge-log",
        "repair": "fracture-bridge",
        "title": "An old wound",
        "text": "The moon broke long before the expedition came. Their equipment follows the exposed layers, as if the fracture opened a book they needed to read.",
        "source": "Expedition log",
        "time": "Aster Veil / Shattered moon 1",
        "unlockAt": 65
      },
      {
        "id": "fracture-generator-log",
        "repair": "fracture-generator",
        "title": "A deliberate stop",
        "text": "The drill was shut down by hand. A note beside the switch says: \"Enough samples. Listen before you dig.\"",
        "source": "Expedition log",
        "time": "Aster Veil / Shattered moon 2",
        "unlockAt": 66
      },
      {
        "id": "fracture-drill-log",
        "repair": "fracture-drill",
        "title": "Copper threads",
        "text": "Metallic threads run through the dark rock. Their shape is almost organic, but the expedition notes warn against jumping to conclusions.",
        "source": "Expedition log",
        "time": "Aster Veil / Shattered moon 3",
        "unlockAt": 67
      },
      {
        "id": "fracture-spectrum-log",
        "repair": "fracture-spectrum",
        "title": "An answering pulse",
        "text": "The rock answers the scanner with a faint pulse. Its interval matches the record from the garden world. The crew had found a connection.",
        "source": "Expedition log",
        "time": "Aster Veil / Shattered moon 4",
        "unlockAt": 68
      },
      {
        "id": "fracture-sorter-log",
        "repair": "fracture-sorter",
        "title": "Not a fuel source",
        "text": "The sample is not a new fuel. It carries a repeating pattern. Someone underlined that sentence twice in the expedition archive.",
        "source": "Expedition log",
        "time": "Aster Veil / Shattered moon 5",
        "unlockAt": 69
      },
      {
        "id": "fracture-probe-log",
        "repair": "fracture-probe",
        "title": "They followed the pattern",
        "text": "The last note says the two samples pointed toward the same distant source. The expedition followed it. With both records restored, we can reconstruct their next bearing.",
        "source": "Expedition log",
        "time": "Aster Veil / Shattered moon 6",
        "unlockAt": 70
      }
    ],
    "image": "aster-fracture",
    "clips": [],
    "system": "system2",
    "complete": "Outpost restored. Its record is safe."
  }
};
export const asterLogs=Object.values(asterDestinations).flatMap(site=>site.logs);
export const asterScenes=Object.keys(asterDestinations);
export const canVisitAster=(p,scene)=>Boolean(p.jumpDone)&&(scene==='buoy'||asterScenes.includes(scene)&&p.buoyCompleted===3);
export const asterComplete=p=>p.buoyCompleted===3&&p.verdantCompleted===6&&p.fractureCompleted===6;

const masks={
 buoy:['polygon(18% 59%,78% 59%,78% 84%,18% 84%)','polygon(0% 8%,100% 8%,100% 38%,0% 38%)','polygon(17% 36%,84% 36%,84% 60%,17% 60%)'],
 verdant:['polygon(0% 60%,53% 60%,53% 87%,0% 87%)','polygon(0% 38%,43% 38%,43% 61%,0% 61%)','polygon(0% 23%,35% 23%,35% 38%,0% 38%)','polygon(43% 37%,100% 37%,100% 62%,43% 62%)','polygon(75% 12%,100% 12%,100% 37%,75% 37%)','polygon(73% 62%,100% 62%,100% 89%,73% 89%)'],
 fracture:['polygon(0% 62%,43% 62%,43% 80%,0% 80%)','polygon(0% 35%,42% 35%,42% 53%,0% 53%)','polygon(0% 14%,44% 14%,44% 34%,0% 34%)','polygon(66% 17%,100% 17%,100% 34%,66% 34%)','polygon(65% 35%,100% 35%,100% 53%,65% 53%)','polygon(67% 55%,100% 55%,100% 78%,67% 78%)'],
};
const equipment={buoy:[[48,71],[82,24],[52,47]],verdant:[[27,71],[20,48],[19,31],[73,49],[88,28],[88,73]],fracture:[[23,71],[22,43],[23,26],[80,25],[84,44],[86,65]]};
for(const [key,site] of Object.entries(asterDestinations)){
 site.clips=masks[key];
 site.repairs.forEach((repair,i)=>{[repair.x,repair.y]=equipment[key][i];});
}
