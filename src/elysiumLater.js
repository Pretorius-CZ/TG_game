// Residential, ecological and command sectors follow the central ring.
export const elysiumLaterDestinations={
  "elysium-homes": {
    "title": "Residential sector",
    "key": "elysiumHomesCompleted",
    "repairs": [
      {
        "id": "elysium-homes-air",
        "name": "Habitat atmosphere",
        "lesson": "Habitat atmosphere",
        "thought": "Before these rooms can become homes, they need clean circulating air.",
        "result": "Air flows through the residential decks. The first doors are safe to open.",
        "action": "Restore station equipment",
        "room": "ELYSIUM",
        "icon": "✦",
        "x": 20,
        "y": 52,
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
        "id": "elysium-homes-water",
        "name": "Habitat water loop",
        "lesson": "Habitat water loop",
        "thought": "Reconnect the water loop. A city needs more than working lights.",
        "result": "Clean water reaches the apartments and community spaces.",
        "action": "Restore station equipment",
        "room": "ELYSIUM",
        "icon": "✦",
        "x": 80,
        "y": 53,
        "moves": 29,
        "tileSet": "elysium",
        "ice": [],
        "level": {
          "rows": 7,
          "cols": 7,
          "types": 6,
          "mask": [
            false,
            true,
            true,
            true,
            true,
            true,
            false,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            false,
            true,
            true,
            true,
            true,
            true,
            false
          ]
        },
        "goals": [
          {
            "type": 0,
            "target": 27,
            "label": "Coolant charges"
          },
          {
            "type": 1,
            "target": 21,
            "label": "Energy modules"
          }
        ],
        "target": 48,
        "targetType": null,
        "objective": "Collect 27 coolant charges, 21 energy modules."
      },
      {
        "id": "elysium-homes-quarters",
        "name": "Prepare the apartments",
        "lesson": "Prepare the apartments",
        "thought": "Repair the apartment modules and install their living-support capsules.",
        "result": "The first apartments are warm, sealed and ready for visitors.",
        "action": "Restore station equipment",
        "room": "ELYSIUM",
        "icon": "✦",
        "x": 22,
        "y": 72,
        "moves": 31,
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
            "type": 3,
            "target": 24,
            "label": "Alloy components"
          },
          {
            "type": 5,
            "target": 21,
            "label": "Biocapsules"
          }
        ],
        "target": 45,
        "targetType": null,
        "objective": "Collect 24 alloy components, 21 biocapsules. Break all protective covers."
      },
      {
        "id": "elysium-homes-commons",
        "name": "Community lights",
        "lesson": "Community lights",
        "thought": "Bring the shared spaces online. Give the station somewhere to gather again.",
        "result": "The residential terraces glow. The biosphere is the next step toward a living city.",
        "action": "Restore station equipment",
        "room": "ELYSIUM",
        "icon": "✦",
        "x": 78,
        "y": 72,
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
            "type": 4,
            "target": 27,
            "label": "Light cells"
          },
          {
            "type": 5,
            "target": 24,
            "label": "Biocapsules"
          }
        ],
        "target": 51,
        "targetType": null,
        "objective": "Collect 27 light cells, 24 biocapsules. Break all protective covers."
      }
    ],
    "logs": [
      {
        "id": "elysium-homes-air-log",
        "repair": "elysium-homes-air",
        "title": "Rooms held in reserve",
        "text": "The atmosphere system was drained deliberately, not destroyed. Someone protected these homes for a future return.",
        "source": "Station log",
        "time": "Elysium / Restoration 13",
        "unlockAt": 85
      },
      {
        "id": "elysium-homes-water-log",
        "repair": "elysium-homes-water",
        "title": "Shared reserves",
        "text": "The reserve tanks were shared across every district. The evacuation left enough for a small returning crew.",
        "source": "Station log",
        "time": "Elysium / Restoration 14",
        "unlockAt": 86
      },
      {
        "id": "elysium-homes-quarters-log",
        "repair": "elysium-homes-quarters",
        "title": "Names by the doors",
        "text": "The resident archive preserves thousands of names. These were homes, not temporary bunks. We will not erase them to start again.",
        "source": "Station log",
        "time": "Elysium / Restoration 15",
        "unlockAt": 87
      },
      {
        "id": "elysium-homes-commons-log",
        "repair": "elysium-homes-commons",
        "title": "A place to return to",
        "text": "Haven receives our first residential status report. The reply is brief: keep the lights on. We are making a home worth returning to.",
        "source": "Station log",
        "time": "Elysium / Restoration 16",
        "unlockAt": 88
      }
    ],
    "image": "elysium-homes",
    "system": "elysium",
    "chapter": "CHAPTER 04 / ELYSIUM",
    "complete": "The residential terraces glow. The biosphere is the next step toward a living city.",
    "clips": [
      "none",
      "none",
      "none",
      "none"
    ],
    "restorationMasks": [
      "radial-gradient(ellipse 24% 25% at 13% 49%, #000 45%, rgba(0,0,0,.88) 60%, rgba(0,0,0,.35) 80%, transparent 100%)",
      "radial-gradient(ellipse 23% 22% at 87% 52%, #000 45%, rgba(0,0,0,.88) 60%, rgba(0,0,0,.35) 80%, transparent 100%)",
      "radial-gradient(ellipse 25% 22% at 13% 72%, #000 45%, rgba(0,0,0,.88) 60%, rgba(0,0,0,.35) 80%, transparent 100%)",
      "radial-gradient(ellipse 29% 24% at 83% 77%, #000 45%, rgba(0,0,0,.88) 60%, rgba(0,0,0,.35) 80%, transparent 100%)"
    ]
  },
  "elysium-garden": {
    "title": "Biosphere",
    "key": "elysiumGardenCompleted",
    "repairs": [
      {
        "id": "elysium-garden-irrigation",
        "name": "Irrigation beds",
        "lesson": "Irrigation beds",
        "thought": "The dome is intact, but its growing beds are empty. Build the irrigation loop first.",
        "result": "Water begins to circulate through the new growing beds.",
        "action": "Restore station equipment",
        "room": "ELYSIUM",
        "icon": "✦",
        "x": 20,
        "y": 64,
        "moves": 29,
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
            "target": 27,
            "label": "Coolant charges"
          },
          {
            "type": 3,
            "target": 21,
            "label": "Alloy components"
          }
        ],
        "target": 48,
        "targetType": null,
        "objective": "Collect 27 coolant charges, 21 alloy components."
      },
      {
        "id": "elysium-garden-climate",
        "name": "Dome climate",
        "lesson": "Dome climate",
        "thought": "Balance warmth, humidity and light before opening the nursery capsules.",
        "result": "The dome holds a stable climate for its first seedlings.",
        "action": "Restore station equipment",
        "room": "ELYSIUM",
        "icon": "✦",
        "x": 80,
        "y": 44,
        "moves": 30,
        "tileSet": "elysium",
        "ice": [],
        "level": {
          "rows": 7,
          "cols": 7,
          "types": 6,
          "mask": [
            false,
            true,
            true,
            true,
            true,
            true,
            false,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            false,
            true,
            true,
            true,
            true,
            true,
            false
          ]
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
          }
        ],
        "target": 48,
        "targetType": null,
        "objective": "Collect 24 energy modules, 24 light cells."
      },
      {
        "id": "elysium-garden-nursery",
        "name": "Plant the living sample",
        "lesson": "Plant the living sample",
        "thought": "Use the sample from Verdant world to start a new nursery beside the preserved seeds.",
        "result": "Green shoots spread through the nursery. The expedition research is growing into something real.",
        "action": "Restore station equipment",
        "room": "ELYSIUM",
        "icon": "✦",
        "x": 50,
        "y": 52,
        "moves": 32,
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
            "type": 5,
            "target": 30,
            "label": "Biocapsules"
          },
          {
            "type": 0,
            "target": 21,
            "label": "Coolant charges"
          }
        ],
        "target": 51,
        "targetType": null,
        "objective": "Collect 30 biocapsules, 21 coolant charges. Break all protective covers."
      },
      {
        "id": "elysium-garden-balance",
        "name": "Living ecosystem",
        "lesson": "Living ecosystem",
        "thought": "Connect the garden to the habitat loop and balance its first full cycle.",
        "result": "The biosphere supplies the habitats. A green glow returns to the dome.",
        "action": "Restore station equipment",
        "room": "ELYSIUM",
        "icon": "✦",
        "x": 78,
        "y": 71,
        "moves": 34,
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
            "type": 5,
            "target": 27,
            "label": "Biocapsules"
          },
          {
            "type": 0,
            "target": 24,
            "label": "Coolant charges"
          },
          {
            "type": 1,
            "target": 18,
            "label": "Energy modules"
          }
        ],
        "target": 69,
        "targetType": null,
        "objective": "Collect 27 biocapsules, 24 coolant charges, 18 energy modules. Break all protective covers."
      }
    ],
    "logs": [
      {
        "id": "elysium-garden-irrigation-log",
        "repair": "elysium-garden-irrigation",
        "title": "A garden waiting",
        "text": "The seed vault survived the shutdown. We do not need to replace the garden with a machine; we can grow it again.",
        "source": "Station log",
        "time": "Elysium / Restoration 17",
        "unlockAt": 89
      },
      {
        "id": "elysium-garden-climate-log",
        "repair": "elysium-garden-climate",
        "title": "Borrowed daylight",
        "text": "The dome can shape a complete day from distant starlight. Its old climate profile is compatible with our recovered sample.",
        "source": "Station log",
        "time": "Elysium / Restoration 18",
        "unlockAt": 90
      },
      {
        "id": "elysium-garden-nursery-log",
        "repair": "elysium-garden-nursery",
        "title": "The sample takes root",
        "text": "The recovered organism stabilizes the nursery beds. The expedition left us more than coordinates: it left the beginning of a new ecosystem.",
        "source": "Station log",
        "time": "Elysium / Restoration 19",
        "unlockAt": 91
      },
      {
        "id": "elysium-garden-balance-log",
        "repair": "elysium-garden-balance",
        "title": "Breathing together",
        "text": "Water, air and growing beds now form a shared cycle. The station can support a returning crew. Only its voice is still missing.",
        "source": "Station log",
        "time": "Elysium / Restoration 20",
        "unlockAt": 92
      }
    ],
    "image": "elysium-garden",
    "system": "elysium",
    "chapter": "CHAPTER 04 / ELYSIUM",
    "complete": "The biosphere supplies the habitats. A green glow returns to the dome.",
    "clips": [
      "none",
      "none",
      "none",
      "none"
    ],
    "restorationMasks": [
      "radial-gradient(ellipse 26% 23% at 10% 64%, #000 45%, rgba(0,0,0,.88) 60%, rgba(0,0,0,.35) 80%, transparent 100%)",
      "radial-gradient(ellipse 24% 26% at 89% 43%, #000 45%, rgba(0,0,0,.88) 60%, rgba(0,0,0,.35) 80%, transparent 100%)",
      "radial-gradient(ellipse 32% 19% at 49% 52%, #000 45%, rgba(0,0,0,.88) 60%, rgba(0,0,0,.35) 80%, transparent 100%)",
      "radial-gradient(ellipse 27% 24% at 86% 75%, #000 45%, rgba(0,0,0,.88) 60%, rgba(0,0,0,.35) 80%, transparent 100%)"
    ]
  },
  "elysium-observatory": {
    "title": "Observatory",
    "key": "elysiumObservatoryCompleted",
    "repairs": [
      {
        "id": "elysium-observatory-optics",
        "name": "Observatory optics",
        "lesson": "Observatory optics",
        "thought": "Align the telescope. We need a clear view beyond the dust before transmitting.",
        "result": "The telescope locks onto the known stars beyond Aster Veil.",
        "action": "Restore station equipment",
        "room": "ELYSIUM",
        "icon": "✦",
        "x": 20,
        "y": 57,
        "moves": 30,
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
            "target": 27,
            "label": "Data chips"
          },
          {
            "type": 4,
            "target": 21,
            "label": "Light cells"
          }
        ],
        "target": 48,
        "targetType": null,
        "objective": "Collect 27 data chips, 21 light cells."
      },
      {
        "id": "elysium-observatory-uplink",
        "name": "Station uplink",
        "lesson": "Station uplink",
        "thought": "Restore the main antenna and connect Elysium to Haven.",
        "result": "The main uplink answers. Haven confirms that our signal is clear.",
        "action": "Restore station equipment",
        "room": "ELYSIUM",
        "icon": "✦",
        "x": 80,
        "y": 49,
        "moves": 31,
        "tileSet": "elysium",
        "ice": [],
        "level": {
          "rows": 7,
          "cols": 7,
          "types": 6,
          "mask": [
            false,
            true,
            true,
            true,
            true,
            true,
            false,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            false,
            true,
            true,
            true,
            true,
            true,
            false
          ]
        },
        "goals": [
          {
            "type": 2,
            "target": 27,
            "label": "Data chips"
          },
          {
            "type": 1,
            "target": 24,
            "label": "Energy modules"
          }
        ],
        "target": 51,
        "targetType": null,
        "objective": "Collect 27 data chips, 24 energy modules."
      },
      {
        "id": "elysium-observatory-chart",
        "name": "Return corridor",
        "lesson": "Return corridor",
        "thought": "Combine the station archive with our survey data to mark a safe return corridor.",
        "result": "A clear approach route appears above the observatory platform.",
        "action": "Restore station equipment",
        "room": "ELYSIUM",
        "icon": "✦",
        "x": 50,
        "y": 55,
        "moves": 33,
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
            "type": 2,
            "target": 30,
            "label": "Data chips"
          },
          {
            "type": 4,
            "target": 24,
            "label": "Light cells"
          }
        ],
        "target": 54,
        "targetType": null,
        "objective": "Collect 30 data chips, 24 light cells. Break all protective covers."
      },
      {
        "id": "elysium-observatory-beacon",
        "name": "Welcome beacon · HARD",
        "lesson": "Welcome beacon · HARD",
        "thought": "Synchronize all six sectors and send the invitation. The sleeping city is ready to wake.",
        "result": "Elysium is online. The beacon shines over a city ready for its returning crew.",
        "action": "Restore station equipment",
        "room": "ELYSIUM",
        "icon": "✦",
        "x": 76,
        "y": 72,
        "moves": 35,
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
            "type": 2,
            "target": 30,
            "label": "Data chips"
          },
          {
            "type": 1,
            "target": 24,
            "label": "Energy modules"
          },
          {
            "type": 4,
            "target": 24,
            "label": "Light cells"
          }
        ],
        "target": 78,
        "targetType": null,
        "objective": "Collect 30 data chips, 24 energy modules, 24 light cells. Break all protective covers."
      }
    ],
    "logs": [
      {
        "id": "elysium-observatory-optics-log",
        "repair": "elysium-observatory-optics",
        "title": "A watch kept in silence",
        "text": "Even in hibernation, the observatory recorded the sky. The lost expedition passed here and left a return bearing in its archive.",
        "source": "Station log",
        "time": "Elysium / Restoration 21",
        "unlockAt": 93
      },
      {
        "id": "elysium-observatory-uplink-log",
        "repair": "elysium-observatory-uplink",
        "title": "A familiar voice",
        "text": "The same voice that guided us from the crash site returns: we can see your beacon now. For the first time, the signal leads toward us.",
        "source": "Station log",
        "time": "Elysium / Restoration 22",
        "unlockAt": 94
      },
      {
        "id": "elysium-observatory-chart-log",
        "repair": "elysium-observatory-chart",
        "title": "No more blind jumps",
        "text": "The map links Haven, the surveyed worlds and Elysium. Every warning buoy and recovered record now marks a safer way home.",
        "source": "Station log",
        "time": "Elysium / Restoration 23",
        "unlockAt": 95
      },
      {
        "id": "elysium-observatory-beacon-log",
        "repair": "elysium-observatory-beacon",
        "title": "Welcome home",
        "text": "Haven confirms receipt: the first return crew is preparing to depart. We found a broken ship and followed a voice through the dark. Now there is a city waiting at the end of that journey.",
        "source": "Station log",
        "time": "Elysium / Restoration 24",
        "unlockAt": 96
      }
    ],
    "image": "elysium-observatory",
    "system": "elysium",
    "chapter": "CHAPTER 04 / ELYSIUM",
    "complete": "Elysium is online. The beacon shines over a city ready for its returning crew.",
    "clips": [
      "none",
      "none",
      "none",
      "none"
    ],
    "restorationMasks": [
      "radial-gradient(ellipse 23% 22% at 12% 56%, #000 45%, rgba(0,0,0,.88) 60%, rgba(0,0,0,.35) 80%, transparent 100%)",
      "radial-gradient(ellipse 24% 23% at 86% 49%, #000 45%, rgba(0,0,0,.88) 60%, rgba(0,0,0,.35) 80%, transparent 100%)",
      "radial-gradient(ellipse 28% 29% at 50% 53%, #000 45%, rgba(0,0,0,.88) 60%, rgba(0,0,0,.35) 80%, transparent 100%)",
      "radial-gradient(ellipse 30% 22% at 80% 70%, #000 45%, rgba(0,0,0,.88) 60%, rgba(0,0,0,.35) 80%, transparent 100%)"
    ]
  }
};
