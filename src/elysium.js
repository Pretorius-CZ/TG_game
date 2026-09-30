import {elysiumLaterDestinations} from './elysiumLater.js';
import {asterComplete} from './aster.js';
export const elysiumDestinations={
  "elysium-dock": {
    "title": "Arrival dock",
    "key": "elysiumDockCompleted",
    "repairs": [
      {
        "id": "elysium-dock-guidance",
        "name": "Dock guidance",
        "lesson": "Dock guidance",
        "thought": "The dock is enormous. Give our ship a safe approach before we connect.",
        "result": "Guidance lights outline a safe berth for our ship.",
        "action": "Restore station equipment",
        "room": "ELYSIUM",
        "icon": "✦",
        "x": 20,
        "y": 53,
        "moves": 25,
        "tileSet": "elysium",
        "ice": [],
        "level": {
          "rows": 7,
          "cols": 7,
          "types": 6
        },
        "goals": [
          {
            "type": 2,
            "target": 21,
            "label": "Data chips"
          },
          {
            "type": 4,
            "target": 18,
            "label": "Light cells"
          }
        ],
        "target": 39,
        "targetType": null,
        "objective": "Collect 21 data chips, 18 light cells."
      },
      {
        "id": "elysium-dock-tunnel",
        "name": "Docking tunnel",
        "lesson": "Docking tunnel",
        "thought": "The berth is safe. Extend the docking tunnel and secure its locks.",
        "result": "The tunnel connects the ship to Elysium.",
        "action": "Restore station equipment",
        "room": "ELYSIUM",
        "icon": "✦",
        "x": 80,
        "y": 38,
        "moves": 26,
        "tileSet": "elysium",
        "ice": [],
        "level": {
          "rows": 7,
          "cols": 7,
          "types": 6
        },
        "goals": [
          {
            "type": 3,
            "target": 21,
            "label": "Alloy components"
          },
          {
            "type": 0,
            "target": 18,
            "label": "Coolant charges"
          }
        ],
        "target": 39,
        "targetType": null,
        "objective": "Collect 21 alloy components, 18 coolant charges."
      },
      {
        "id": "elysium-dock-pressure",
        "name": "Dock pressure",
        "lesson": "Dock pressure",
        "thought": "The tunnel is sealed. Bring the arrival compartment up to pressure.",
        "result": "The dock has breathable air and a sealed entrance.",
        "action": "Restore station equipment",
        "room": "ELYSIUM",
        "icon": "✦",
        "x": 24,
        "y": 83,
        "moves": 28,
        "tileSet": "elysium",
        "ice": [
          15,
          19,
          29,
          33
        ],
        "level": {
          "rows": 7,
          "cols": 7,
          "types": 6
        },
        "goals": [
          {
            "type": 1,
            "target": 24,
            "label": "Energy modules"
          },
          {
            "type": 2,
            "target": 18,
            "label": "Data chips"
          }
        ],
        "target": 42,
        "targetType": null,
        "objective": "Collect 24 energy modules, 18 data chips. Break all protective covers."
      },
      {
        "id": "elysium-dock-cargo",
        "name": "Supply unloading",
        "lesson": "Supply unloading",
        "thought": "Unload the repair equipment. Keep the research capsule sealed aboard the ship for now.",
        "result": "Arrival dock restored. The energy core is now accessible.",
        "action": "Restore station equipment",
        "room": "ELYSIUM",
        "icon": "✦",
        "x": 82,
        "y": 75,
        "moves": 29,
        "tileSet": "elysium",
        "ice": [
          15,
          19,
          29,
          33
        ],
        "level": {
          "rows": 8,
          "cols": 7,
          "types": 6
        },
        "goals": [
          {
            "type": 0,
            "target": 24,
            "label": "Coolant charges"
          },
          {
            "type": 3,
            "target": 21,
            "label": "Alloy components"
          }
        ],
        "target": 45,
        "targetType": null,
        "objective": "Collect 24 coolant charges, 21 alloy components. Break all protective covers."
      }
    ],
    "logs": [
      {
        "id": "elysium-dock-guidance-log",
        "repair": "elysium-dock-guidance",
        "title": "A city in the dust",
        "text": "Haven, I found the source. This is not a research base. It is a city. Only one landing beacon answers us.",
        "source": "Station log",
        "time": "Elysium / Restoration 1",
        "unlockAt": 73
      },
      {
        "id": "elysium-dock-tunnel-log",
        "repair": "elysium-dock-tunnel",
        "title": "A door left waiting",
        "text": "The locks recognise the expedition clearance stored in the buoy record. They left a way in for whoever followed.",
        "source": "Station log",
        "time": "Elysium / Restoration 2",
        "unlockAt": 74
      },
      {
        "id": "elysium-dock-pressure-log",
        "repair": "elysium-dock-pressure",
        "title": "Not abandoned",
        "text": "There is no breach here. The air was deliberately recovered into reserve tanks. Someone put this place to sleep carefully.",
        "source": "Station log",
        "time": "Elysium / Restoration 3",
        "unlockAt": 75
      },
      {
        "id": "elysium-dock-cargo-log",
        "repair": "elysium-dock-cargo",
        "title": "Our first foothold",
        "text": "The dock lights reach across an empty hall. Beyond it, thousands of dark windows wait for power. The equipment is ready.",
        "source": "Station log",
        "time": "Elysium / Restoration 4",
        "unlockAt": 76
      }
    ],
    "image": "elysium-dock",
    "system": "elysium",
    "chapter": "CHAPTER 04 / ELYSIUM",
    "complete": "Arrival dock restored. The energy core is now accessible.",
    "clips": [
      "polygon(0% 35%,45% 35%,45% 65%,0% 65%)",
      "polygon(55% 15%,100% 15%,100% 60%,55% 60%)",
      "polygon(0% 65%,50% 65%,50% 100%,0% 100%)",
      "polygon(50% 60%,100% 60%,100% 100%,50% 100%)"
    ],
    "restorationMasks": [
      "radial-gradient(ellipse 27% 22% at 15% 52%, #000 45%, rgba(0,0,0,.88) 60%, rgba(0,0,0,.35) 80%, transparent 100%)",
      "radial-gradient(ellipse 29% 24% at 83% 38%, #000 45%, rgba(0,0,0,.88) 60%, rgba(0,0,0,.35) 80%, transparent 100%)",
      "radial-gradient(ellipse 32% 27% at 16% 83%, #000 45%, rgba(0,0,0,.88) 60%, rgba(0,0,0,.35) 80%, transparent 100%)",
      "radial-gradient(ellipse 30% 25% at 86% 76%, #000 45%, rgba(0,0,0,.88) 60%, rgba(0,0,0,.35) 80%, transparent 100%)"
    ]
  },
  "elysium-core": {
    "title": "Energy core",
    "key": "elysiumCoreCompleted",
    "repairs": [
      {
        "id": "elysium-core-cooling",
        "name": "Reactor cooling",
        "lesson": "Reactor cooling",
        "thought": "No restart without cooling. Restore circulation before we touch the reactor.",
        "result": "Coolant circulates through the reactor jacket.",
        "action": "Restore station equipment",
        "room": "ELYSIUM",
        "icon": "✦",
        "x": 19,
        "y": 65,
        "moves": 27,
        "tileSet": "elysium",
        "ice": [],
        "level": {
          "rows": 7,
          "cols": 7,
          "types": 6
        },
        "goals": [
          {
            "type": 2,
            "target": 24,
            "label": "Data chips"
          },
          {
            "type": 0,
            "target": 18,
            "label": "Coolant charges"
          }
        ],
        "target": 42,
        "targetType": null,
        "objective": "Collect 24 data chips, 18 coolant charges."
      },
      {
        "id": "elysium-core-grid",
        "name": "Power distribution",
        "lesson": "Power distribution",
        "thought": "Reconnect the essential grid first. The residential sectors can wait until the core is stable.",
        "result": "Essential power lines are connected. The main ring remains isolated.",
        "action": "Restore station equipment",
        "room": "ELYSIUM",
        "icon": "✦",
        "x": 85,
        "y": 44,
        "moves": 28,
        "tileSet": "elysium",
        "ice": [],
        "level": {
          "rows": 7,
          "cols": 7,
          "types": 6
        },
        "goals": [
          {
            "type": 1,
            "target": 24,
            "label": "Energy modules"
          },
          {
            "type": 3,
            "target": 18,
            "label": "Alloy components"
          }
        ],
        "target": 42,
        "targetType": null,
        "objective": "Collect 24 energy modules, 18 alloy components."
      },
      {
        "id": "elysium-core-ignition",
        "name": "Core ignition",
        "lesson": "Core ignition",
        "thought": "Cooling and distribution are ready. Wake the core at minimum output.",
        "result": "The reactor glows. Elysium has a steady heartbeat again.",
        "action": "Restore station equipment",
        "room": "ELYSIUM",
        "icon": "✦",
        "x": 50,
        "y": 35,
        "moves": 30,
        "tileSet": "elysium",
        "ice": [
          15,
          19,
          29,
          33
        ],
        "level": {
          "rows": 7,
          "cols": 7,
          "types": 6
        },
        "goals": [
          {
            "type": 1,
            "target": 27,
            "label": "Energy modules"
          },
          {
            "type": 0,
            "target": 21,
            "label": "Coolant charges"
          }
        ],
        "target": 48,
        "targetType": null,
        "objective": "Collect 27 energy modules, 21 coolant charges. Break all protective covers."
      },
      {
        "id": "elysium-core-safeguards",
        "name": "Core safety checks",
        "lesson": "Core safety checks",
        "thought": "Stabilise the protective relays before we energise the rest of the city.",
        "result": "The energy core is stable. The central ring is the next restoration stage.",
        "action": "Restore station equipment",
        "room": "ELYSIUM",
        "icon": "✦",
        "x": 80,
        "y": 81,
        "moves": 33,
        "tileSet": "elysium",
        "ice": [
          15,
          19,
          29,
          33
        ],
        "level": {
          "rows": 8,
          "cols": 7,
          "types": 6
        },
        "goals": [
          {
            "type": 1,
            "target": 24,
            "label": "Energy modules"
          },
          {
            "type": 4,
            "target": 24,
            "label": "Light cells"
          },
          {
            "type": 2,
            "target": 15,
            "label": "Data chips"
          }
        ],
        "target": 63,
        "targetType": null,
        "objective": "Collect 24 energy modules, 24 light cells, 15 data chips. Break all protective covers."
      }
    ],
    "logs": [
      {
        "id": "elysium-core-cooling-log",
        "repair": "elysium-core-cooling",
        "title": "A controlled silence",
        "text": "The shutdown sequence is intact. The expedition conserved the reactor rather than risking a failure while they were away.",
        "source": "Station log",
        "time": "Elysium / Restoration 5",
        "unlockAt": 77
      },
      {
        "id": "elysium-core-grid-log",
        "repair": "elysium-core-grid",
        "title": "Power with a purpose",
        "text": "The priority list starts with air, water and shelter. Elysium was built to keep people alive, not merely to house machinery.",
        "source": "Station log",
        "time": "Elysium / Restoration 6",
        "unlockAt": 78
      },
      {
        "id": "elysium-core-ignition-log",
        "repair": "elysium-core-ignition",
        "title": "A heartbeat returns",
        "text": "Light climbs the core chamber. A dormant maintenance system acknowledges the restart, but the crew channels remain silent.",
        "source": "Station log",
        "time": "Elysium / Restoration 7",
        "unlockAt": 79
      },
      {
        "id": "elysium-core-safeguards-log",
        "repair": "elysium-core-safeguards",
        "title": "The sleeping city",
        "text": "The maintenance archive calls the shutdown a shelter protocol. The living sectors were preserved for a return. We can begin opening the city one sector at a time.",
        "source": "Station log",
        "time": "Elysium / Restoration 8",
        "unlockAt": 80
      }
    ],
    "image": "elysium-core",
    "system": "elysium",
    "chapter": "CHAPTER 04 / ELYSIUM",
    "complete": "The energy core is stable. The central ring is the next restoration stage.",
    "clips": [
      "polygon(0% 45%,35% 45%,35% 85%,0% 85%)",
      "polygon(70% 15%,100% 15%,100% 65%,70% 65%)",
      "polygon(32% 0%,70% 0%,70% 70%,32% 70%)",
      "polygon(50% 65%,100% 65%,100% 100%,50% 100%)"
    ],
    "restorationMasks": [
      "radial-gradient(ellipse 27% 26% at 9% 65%, #000 45%, rgba(0,0,0,.88) 60%, rgba(0,0,0,.35) 80%, transparent 100%)",
      "radial-gradient(ellipse 22% 27% at 91% 44%, #000 45%, rgba(0,0,0,.88) 60%, rgba(0,0,0,.35) 80%, transparent 100%)",
      "radial-gradient(ellipse 23% 57% at 50% 42%, #000 45%, rgba(0,0,0,.88) 60%, rgba(0,0,0,.35) 80%, transparent 100%)",
      "radial-gradient(ellipse 30% 23% at 83% 82%, #000 45%, rgba(0,0,0,.88) 60%, rgba(0,0,0,.35) 80%, transparent 100%)"
    ]
  },
  "elysium-ring": {
    "title": "Central ring",
    "key": "elysiumRingCompleted",
    "repairs": [
      {
        "id": "elysium-ring-bulkhead",
        "name": "Ring bulkhead",
        "lesson": "Ring bulkhead",
        "thought": "The core is stable. Equalize pressure before opening the central ring.",
        "result": "The sealed entrance opens onto a silent promenade.",
        "action": "Restore station equipment",
        "room": "ELYSIUM",
        "icon": "✦",
        "x": 15,
        "y": 55,
        "moves": 27,
        "tileSet": "elysium",
        "ice": [],
        "level": {
          "rows": 7,
          "cols": 7,
          "types": 6
        },
        "goals": [
          {
            "type": 1,
            "target": 24,
            "label": "Energy modules"
          },
          {
            "type": 2,
            "target": 18,
            "label": "Data chips"
          }
        ],
        "target": 42,
        "targetType": null,
        "objective": "Collect 24 energy modules, 18 data chips."
      },
      {
        "id": "elysium-ring-transit",
        "name": "Ring transit",
        "lesson": "Ring transit",
        "thought": "Walking around this ring would take hours. Restore its local transit line.",
        "result": "The platform wakes. A transport carriage returns to the station.",
        "action": "Restore station equipment",
        "room": "ELYSIUM",
        "icon": "✦",
        "x": 80,
        "y": 50,
        "moves": 28,
        "tileSet": "elysium",
        "ice": [],
        "level": {
          "rows": 7,
          "cols": 7,
          "types": 6
        },
        "goals": [
          {
            "type": 0,
            "target": 24,
            "label": "Coolant charges"
          },
          {
            "type": 3,
            "target": 21,
            "label": "Alloy components"
          }
        ],
        "target": 45,
        "targetType": null,
        "objective": "Collect 24 coolant charges, 21 alloy components."
      },
      {
        "id": "elysium-ring-junction",
        "name": "Sector junction",
        "lesson": "Sector junction",
        "thought": "Reconnect the sector network. Power must reach each district without overloading the core.",
        "result": "District controllers answer. The residential sector can now be prepared for restoration.",
        "action": "Restore station equipment",
        "room": "ELYSIUM",
        "icon": "✦",
        "x": 53,
        "y": 43,
        "moves": 30,
        "tileSet": "elysium",
        "ice": [
          15,
          19,
          29,
          33
        ],
        "level": {
          "rows": 7,
          "cols": 7,
          "types": 6
        },
        "goals": [
          {
            "type": 1,
            "target": 27,
            "label": "Energy modules"
          },
          {
            "type": 4,
            "target": 21,
            "label": "Light cells"
          }
        ],
        "target": 48,
        "targetType": null,
        "objective": "Collect 27 energy modules, 21 light cells. Break all protective covers."
      },
      {
        "id": "elysium-ring-lighting",
        "name": "Promenade lights",
        "lesson": "Promenade lights",
        "thought": "Restore the main lights. Let us see the scale of the place we have brought back.",
        "result": "Light circles the station. The next step is to make its homes habitable.",
        "action": "Restore station equipment",
        "room": "ELYSIUM",
        "icon": "✦",
        "x": 81,
        "y": 73,
        "moves": 32,
        "tileSet": "elysium",
        "ice": [
          9,
          12,
          22,
          26,
          37,
          40
        ],
        "level": {
          "rows": 8,
          "cols": 7,
          "types": 6
        },
        "goals": [
          {
            "type": 1,
            "target": 24,
            "label": "Energy modules"
          },
          {
            "type": 2,
            "target": 24,
            "label": "Data chips"
          },
          {
            "type": 4,
            "target": 15,
            "label": "Light cells"
          }
        ],
        "target": 63,
        "targetType": null,
        "objective": "Collect 24 energy modules, 24 data chips, 15 light cells. Break all protective covers."
      }
    ],
    "logs": [
      {
        "id": "elysium-ring-bulkhead-log",
        "repair": "elysium-ring-bulkhead",
        "title": "A sealed city",
        "text": "The bulkheads protected whole neighborhoods. Whoever ordered the shutdown expected people to return.",
        "source": "Station log",
        "time": "Elysium / Restoration 9",
        "unlockAt": 81
      },
      {
        "id": "elysium-ring-transit-log",
        "repair": "elysium-ring-transit",
        "title": "The last departure",
        "text": "The transport manifest ends with a coordinated evacuation. Nobody was left waiting on these platforms.",
        "source": "Station log",
        "time": "Elysium / Restoration 10",
        "unlockAt": 82
      },
      {
        "id": "elysium-ring-junction-log",
        "repair": "elysium-ring-junction",
        "title": "A promise in the archive",
        "text": "A maintenance message repeats one instruction: keep the gardens alive until we return. The living sample we recovered may matter here.",
        "source": "Station log",
        "time": "Elysium / Restoration 11",
        "unlockAt": 83
      },
      {
        "id": "elysium-ring-lighting-log",
        "repair": "elysium-ring-lighting",
        "title": "A road through the dark",
        "text": "The ring is lit from end to end. Our ship looks tiny through the glass. We have restored a way into the city; now we must give it somewhere to live.",
        "source": "Station log",
        "time": "Elysium / Restoration 12",
        "unlockAt": 84
      }
    ],
    "image": "elysium-ring",
    "system": "elysium",
    "chapter": "CHAPTER 04 / ELYSIUM",
    "complete": "The central ring is open. Residential restoration comes next.",
    "clips": [
      "polygon(0% 29%,31% 29%,31% 75%,0% 75%)",
      "polygon(66% 37%,100% 37%,100% 63%,66% 63%)",
      "polygon(42% 27%,63% 27%,63% 56%,42% 56%)",
      "polygon(0% 0%,100% 0%,100% 100%,0% 100%)"
    ],
    "restorationMasks": [
      "radial-gradient(ellipse 26% 31% at 9% 54%, #000 45%, rgba(0,0,0,.88) 60%, rgba(0,0,0,.35) 80%, transparent 100%)",
      "radial-gradient(ellipse 25% 19% at 86% 49%, #000 45%, rgba(0,0,0,.88) 60%, rgba(0,0,0,.35) 80%, transparent 100%)",
      "radial-gradient(ellipse 17% 24% at 54% 43%, #000 45%, rgba(0,0,0,.88) 60%, rgba(0,0,0,.35) 80%, transparent 100%)",
      "radial-gradient(ellipse 28% 24% at 83% 76%, #000 45%, rgba(0,0,0,.88) 60%, rgba(0,0,0,.35) 80%, transparent 100%)"
    ]
  },
  ...elysiumLaterDestinations
};
export const elysiumRoute={
  "id": "elysium-route",
  "name": "Assemble the approach route",
  "lesson": "A city beyond the dust",
  "thought": "Both records point into the dust cloud. Align their signals and plot a safe approach.",
  "objective": "Collect 24 blue comets and 24 stars. Break all protective covers.",
  "action": "Confirm approach route",
  "room": "ASTER VEIL",
  "icon": "✦",
  "x": 50,
  "y": 70,
  "moves": 30,
  "tileSet": "aster",
  "ice": [
    9,
    12,
    37,
    40
  ],
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
      "type": 4,
      "target": 24,
      "label": "Stars"
    }
  ],
  "target": 48,
  "targetType": null
};
export const elysiumRouteLog={
  "id": "elysium-route-log",
  "title": "Behind the veil",
  "source": "Expedition log",
  "time": "Aster Veil / Elysium",
  "unlockAt": 71,
  "text": "The two records resolve into a safe route through the dust. A huge structure waits at its end. The expedition called it Elysium."
};
export const elysiumArrivalLog={
  "id": "elysium-arrival-log",
  "title": "Not a base. A city.",
  "source": "Personal log",
  "time": "Elysium / Arrival",
  "unlockAt": 72,
  "text": "Our ship is a speck beside the dock. Six great sectors surround a silent ring. A single beacon welcomes us. Haven, we have reached Elysium."
};
export const elysiumScenes=['elysium','elysium-research','fading-relay',...Object.keys(elysiumDestinations)];
export const elysiumSectorOrder=Object.keys(elysiumDestinations);
export const elysiumComplete=p=>Object.values(elysiumDestinations).every(s=>p[s.key]===s.repairs.length);
export function canVisitElysium(p,scene){
 if(!asterComplete(p)||p.elysiumRouteCompleted!==1||p.elysiumArrival!==1||!elysiumScenes.includes(scene))return false;
 if(scene==='elysium')return true;
 if(scene==='fading-relay')return p.researchCompleted===5&&p.gardenCompleted===6&&p.riftCrossed===1;
 if(scene==='elysium-research')return p.gardenCompleted===6&&p.riftCrossed===1;
 return elysiumSectorOrder.slice(0,elysiumSectorOrder.indexOf(scene)).every(id=>p[elysiumDestinations[id].key]===4);
}
