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
        "tileSet": "aster",
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
            "label": "Blue comets"
          },
          {
            "type": 4,
            "target": 18,
            "label": "Stars"
          }
        ],
        "target": 39,
        "targetType": null,
        "objective": "Collect 21 blue comets, 18 stars."
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
        "tileSet": "aster",
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
            "label": "Alien ore"
          },
          {
            "type": 0,
            "target": 18,
            "label": "Fuel cells"
          }
        ],
        "target": 39,
        "targetType": null,
        "objective": "Collect 21 alien ore, 18 fuel cells."
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
        "tileSet": "aster",
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
            "label": "Energy crystals"
          },
          {
            "type": 2,
            "target": 18,
            "label": "Blue comets"
          }
        ],
        "target": 42,
        "targetType": null,
        "objective": "Collect 24 energy crystals, 18 blue comets. Break all protective covers."
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
        "tileSet": "aster",
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
            "label": "Fuel cells"
          },
          {
            "type": 3,
            "target": 21,
            "label": "Alien ore"
          }
        ],
        "target": 45,
        "targetType": null,
        "objective": "Collect 24 fuel cells, 21 alien ore. Break all protective covers."
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
        "tileSet": "aster",
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
            "label": "Blue comets"
          },
          {
            "type": 0,
            "target": 18,
            "label": "Fuel cells"
          }
        ],
        "target": 42,
        "targetType": null,
        "objective": "Collect 24 blue comets, 18 fuel cells."
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
        "tileSet": "aster",
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
            "label": "Energy crystals"
          },
          {
            "type": 3,
            "target": 18,
            "label": "Alien ore"
          }
        ],
        "target": 42,
        "targetType": null,
        "objective": "Collect 24 energy crystals, 18 alien ore."
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
        "tileSet": "aster",
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
            "label": "Energy crystals"
          },
          {
            "type": 0,
            "target": 21,
            "label": "Fuel cells"
          }
        ],
        "target": 48,
        "targetType": null,
        "objective": "Collect 27 energy crystals, 21 fuel cells. Break all protective covers."
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
        "tileSet": "aster",
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
            "label": "Energy crystals"
          },
          {
            "type": 4,
            "target": 24,
            "label": "Stars"
          },
          {
            "type": 2,
            "target": 15,
            "label": "Blue comets"
          }
        ],
        "target": 63,
        "targetType": null,
        "objective": "Collect 24 energy crystals, 24 stars, 15 blue comets. Break all protective covers."
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
    ]
  }
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
export const elysiumScenes=['elysium',...Object.keys(elysiumDestinations)];
export const canVisitElysium=(p,scene)=>asterComplete(p)&&p.elysiumRouteCompleted===1&&p.elysiumArrival===1&&elysiumScenes.includes(scene)&&(scene!=='elysium-core'||p.elysiumDockCompleted===4);
