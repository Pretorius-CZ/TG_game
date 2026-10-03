import {gateReady} from './haven.js';

export const asterJumpPanels=[
 {image:'aster-jump-gate',title:'Through an open door',caption:'Haven falls away behind us. The gate holds steady as the stars stretch into light. The expedition crossed here before us.'},
 {image:'aster-jump-sky',title:'Under a different star',caption:'The light fades. A blue star burns behind a veil of dust. Aster Veil: the last system named in the expedition records.'},
 {image:'aster-jump-buoy',title:'A witness in the dark',caption:'A damaged survey buoy drifts ahead. Its faint beacon still pulses. Restore it, and we may learn which way the expedition went.'},
];

export function completeAsterJump(progress){
 return gateReady(progress)?{...progress,jumpDone:true,scene:'system2'}:progress;
}

export const asterJumpTranslations={
 'Aster Veil arrival story':'Příběh příletu do Aster Veil',
 'CHAPTER 03 / ASTER VEIL':'KAPITOLA 03 / ASTER VEIL',
 'Through an open door':'Otevřenou branou',
 'Haven falls away behind us. The gate holds steady as the stars stretch into light. The expedition crossed here before us.':'Haven zůstává za námi. Brána drží, zatímco se hvězdy protahují v proudy světla. Výprava tudy prošla před námi.',
 'Under a different star':'Pod jinou hvězdou',
 'The light fades. A blue star burns behind a veil of dust. Aster Veil: the last system named in the expedition records.':'Světlo slábne. Za prachovým závojem září modrá hvězda. Aster Veil: poslední soustava zmíněná v záznamech výpravy.',
 'A witness in the dark':'Svědek ve tmě',
 'A damaged survey buoy drifts ahead. Its faint beacon still pulses. Restore it, and we may learn which way the expedition went.':'Před námi se vznáší poškozená průzkumná bóje. Její slabý maják stále bliká. Po opravě snad zjistíme, kudy výprava pokračovala.',
 'Explore Aster Veil':'Prozkoumat Aster Veil',
 'Replay the Aster Veil arrival':'Přehrát přílet do Aster Veil',
};
