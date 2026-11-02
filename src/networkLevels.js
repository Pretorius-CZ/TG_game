// First ten network tasks. Budgets are monitored separately from the original200.
const rows = [
 ['handover', 'Accept the maintenance watch', 'Převezmi službu sítě', 'The expedition is home. The operator asks us to expand the network, not reopen the closed distress call.', 'Výprava je doma. Operátor nás žádá o rozšíření sítě, ne o znovuotevření uzavřeného nouzového volání.', 'Our next cargo is a set of replacement beacon modules.', 'Dalším nákladem je sada náhradních modulů majáků.', 22, [0, 2], 21, []],
 ['coupler', 'Fit the signal coupler', 'Zapoj signální spojku', 'Test the new coupler before connecting the outer circuits.', 'Než připojíme vnější okruhy, vyzkoušíme novou spojku.', 'The test signal returns cleanly. No emergency traffic is interrupted.', 'Zkušební signál se vrací čistý. Nouzové spojení zůstává v provozu.', 23, [1, 4], 24, []],
 ['first-node', 'Power the first route node', 'Napájej první uzel trasy', 'Match beside node 1. A completed combination supplies one pulse.', 'Spojuj vedle uzlu 1. Dokončená kombinace dodá jeden impulz.', 'The first distribution node is ready for a second link.', 'První rozvodný uzel je připravený na druhé spojení.', 24, [0, 3], 21, [2]],
 ['return', 'Keep the return channel open', 'Udržuj zpáteční kanál', 'Power the numbered nodes in order. Only the glowing node accepts energy.', 'Napájej očíslované uzly v pořadí. Energii přijímá pouze zářící uzel.', 'Both ends agree on the live route. Stored messages stay in the archive.', 'Oba konce potvrzují živou trasu. Uložené zprávy zůstávají v archivu.', 26, [2, 4], 24, [2, 2]],
 ['transfer', 'Verify the handover · HARD', 'Ověř předání služby · TĚŽKÉ', 'Run the complete route before the relief operator takes over.', 'Než službu převezme další operátor, vyzkoušej celou trasu.', 'The rescue station can maintain the old route while we build the extension.', 'Záchranná stanice udrží původní trasu, zatímco my stavíme rozšíření.', 24, [1, 5], 27, [3, 3]],
 ['survey', 'Survey the outer anchorage', 'Zaměř vnější kotviště', 'Choose a stable mounting point for a new, unoccupied service platform.', 'Vyber stabilní místo pro novou neobydlenou servisní plošinu.', 'The new platform will support traffic without crowding the rescue dock.', 'Nová plošina podpoří provoz bez zahlcení záchranného doku.', 24, [3, 4], 24, []],
 ['frame', 'Secure the platform frame', 'Upevni rám plošiny', 'Lock the prefabricated frame into its surveyed position.', 'Upevni připravený rám na zaměřeném místě.', 'Our supply ship finally delivers construction equipment instead of searching for its destination.', 'Naše zásobovací loď konečně dodává stavební vybavení místo hledání svého cíle.', 25, [0, 5], 27, [2]],
 ['circuit', 'Separate the service circuits', 'Odděl servisní okruhy', 'Bring power online in order, keeping the return beacon independent.', 'Zapínej napájení v pořadí a ponech zpáteční maják nezávislý.', 'A failed workshop circuit will no longer silence the landing lights.', 'Porucha dílenského okruhu už nezhasne přistávací světla.', 27, [1, 3], 24, [2, 3]],
 ['workshop', 'Open the maintenance workshop', 'Otevři servisní dílnu', 'Prepare tools and spares for the beacon crews that will use this platform.', 'Připrav nástroje a náhradní díly pro posádky údržby majáků.', 'A simple workshop gives the network somewhere to repair its own equipment.', 'Jednoduchá dílna dává síti místo, kde může opravovat vlastní vybavení.', 26, [2, 5], 27, [3, 2]],
 ['platform', 'Commission the platform · HARD', 'Uveď plošinu do provozu · TĚŽKÉ', 'Run the three-node route and finish the supply checks before opening the platform.', 'Před otevřením plošiny ověř trasu tří uzlů a dokonči kontrolu zásob.', 'The first maintenance crew confirms its arrival slot. This is a new journey, not another missing expedition.', 'První servisní posádka potvrzuje příletové okno. Začíná nová cesta, nikoli další pátrání po ztracené výpravě.', 27, [0, 4], 30, [2, 2, 2]],
];

export const networkTileNames = ['Signal coupler', 'Solar wafer', 'Optical lens', 'Ceramic insulator', 'Service capsule', 'Habitat cartridge'];
export const networkLevels = rows.map(([slug, name, csName, thought, csThought, result, csResult, moves, colors, target, requirements], index) => {
  const nodes = requirements.map((required, i) => ({at: [16, 32, 38][i], target: required}));
  return {
    id: `network-${slug}`, number: 201 + index, name, csName, thought, csThought, result, csResult,
    moves, nodes, hard: index === 4 || index === 9,
    goals: colors.map(type => ({type, target, label: networkTileNames[type]})),
    level: {cols: 7, rows: 8, types: 6, mask: Array.from({length: 56}, (_, at) => !nodes.some(node => node.at === at))},
  };
});
