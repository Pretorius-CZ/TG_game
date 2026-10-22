export function formatMessage(value,values={},language='en'){
 if(value&&typeof value==='object'){
  const category=new Intl.PluralRules(language).select(Number(values.count));
  value=value['='+values.count]??value[category]??value.other;
 }
 if(typeof value!=='string')return undefined;
 // Return plain text; callers use React or textContent, never innerHTML.
 return value.replace(/\{([a-zA-Z][\w]*)\}/g,(original,key)=>Object.hasOwn(values,key)?String(values[key]):original);
}
