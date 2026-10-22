import englishGame from './catalogs/en.json' with {type:'json'};
import czechGame from './catalogs/cs.json' with {type:'json'};
import englishWeb from './catalogs/web/en.json' with {type:'json'};
import czechWeb from './catalogs/web/cs.json' with {type:'json'};
import {validLanguage,locales} from './locales.js';
import {formatMessage} from './format.js';
export {formatMessage} from './format.js';

const english={...englishGame,...englishWeb},czech={...czechGame,...czechWeb};
export const englishMessages=Object.freeze(english);
const catalogs=new Map([['en',english],['cs',czech]]);
const loaders={de:()=>import('./catalogs/de.json',{with:{type:'json'}}),fr:()=>import('./catalogs/fr.json',{with:{type:'json'}}),es:()=>import('./catalogs/es.json',{with:{type:'json'}}),'pt-BR':()=>import('./catalogs/pt-BR.json',{with:{type:'json'}})};
// Drafts can be loaded for translation tools, but public language resolution excludes them.
export async function loadLocaleCatalog(code){
 if(catalogs.has(code))return catalogs.get(code);
 if(!loaders[code])throw new Error(`Unknown language: ${code}`);
 const catalog=Object.freeze((await loaders[code]()).default);catalogs.set(code,catalog);return catalog;
}
const placeholders=value=>new Set([...value.matchAll(/\{([a-zA-Z][\w]*)\}/g)].map(match=>match[1]));
export const missingMessages=new Set();
export function message(id,values={},language='en'){
 const code=validLanguage(language),source=english[id],translated=catalogs.get(code)?.[id];
 if(source===undefined){missingMessages.add(`${code}:${id}`);return id;}
 if(translated===undefined&&code!=='en')missingMessages.add(`${code}:${id}`);
 return formatMessage(translated??source,values,code);
}
export function catalogProblems(language,catalog){
 const problems=[],known=locales.find(locale=>locale.code===language);
 if(!known)return ['Unknown locale '+language];
 for(const [id,source]of Object.entries(english)){
  const value=catalog[id];
  if(value===undefined||value===null){problems.push(`${id}: missing translation`);continue;}
  const sourceVariants=typeof source==='string'?[source]:Object.values(source);
  const expected=new Set(sourceVariants.flatMap(item=>[...placeholders(item)]));
  if(typeof value!=='string'&&(typeof value!=='object'||Array.isArray(value))){problems.push(`${id}: invalid message`);continue;}
  if(typeof source==='object'&&(typeof value!=='object'||typeof value.other!=='string'))problems.push(`${id}: plural requires an other form`);
  if(typeof source==='string'&&typeof value!=='string')problems.push(`${id}: expected plain text`);
  for(const text of typeof value==='string'?[value]:Object.values(value)){
   if(typeof text!=='string'||!text.trim()){problems.push(`${id}: empty or invalid translation`);continue;}
   const actual=placeholders(text);
   if(expected.size!==actual.size||[...expected].some(key=>!actual.has(key)))problems.push(`${id}: placeholder mismatch`);
  }
  if(typeof source==='object'&&typeof value==='object')for(const category of new Intl.PluralRules(language).resolvedOptions().pluralCategories){if(!Object.hasOwn(value,category))problems.push(`${id}: missing plural form ${category}`);}
 }
 for(const id of Object.keys(catalog))if(!Object.hasOwn(english,id))problems.push(`${id}: unknown message ID`);
 return problems;
}
// Compatibility bridge while existing t('English source') calls migrate to semantic IDs.
// It is generated from the same catalogs; there is no second translation dictionary.
export const sourceCatalog=Object.fromEntries(Object.entries(english).filter(([id,value])=>!id.startsWith('web.')&&!id.startsWith('news.')&&typeof value==='string'&&typeof czech[id]==='string').map(([id,value])=>[value.trim(),czech[id].trim()]));
