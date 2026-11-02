import {readFileSync,writeFileSync} from 'node:fs';
import {networkLevels} from '../src/networkLevels.js';
import {completionEditions} from './network-completion-translations.mjs';
import {completionCopy} from './network-completion-copy.mjs';
const codes=['en','cs','de','fr','es','pt-BR'];
const maps=Object.fromEntries(codes.map(c=>[c,{}]));
networkLevels.slice(30).forEach((r,i)=>['name','thought','result'].forEach((field,j)=>{
 const id=`network.level.${r.number}.${field}`;maps.en[id]=r[field];maps.cs[id]=r[{name:'csName',thought:'csThought',result:'csResult'}[field]];
 for(const code of codes.slice(2))maps[code][id]=completionEditions[code][i][j];
}));
completionCopy.forEach((row,i)=>codes.forEach((code,j)=>{if(!row[j])throw Error('Missing '+code+' copy '+i);maps[code][`network.completion.copy.${i}`]=row[j];}));
for(const code of codes){const path=`src/i18n/catalogs/runtime/${code}.json`,catalog=JSON.parse(readFileSync(path,'utf8'));Object.assign(catalog,maps[code]);writeFileSync(path,JSON.stringify(catalog,null,2)+'\n');}
console.log(`Registered ${Object.keys(maps.en).length} completion messages in six languages.`);
