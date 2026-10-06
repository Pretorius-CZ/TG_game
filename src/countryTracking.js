// IP stays with the lookup provider. Only a country code enters our analytics.
export function normalizeCountry(value){
 const code=typeof value==='string'?value.trim().toUpperCase():'';
 return /^[A-Z]{2}$/.test(code)&&!['XX','ZZ','EU','UN'].includes(code)?code:null;
}
export function countryName(code){
 const normalized=normalizeCountry(code);
 if(!normalized)return 'Neznámá';
 try{return new Intl.DisplayNames(['cs'],{type:'region'}).of(normalized)||normalized;}catch{return normalized;}
}
export async function lookupCountry(fetcher=fetch){
 try{
 const response=await fetcher('https://api.country.is/',{credentials:'omit',referrerPolicy:'no-referrer',cache:'no-store',signal:AbortSignal.timeout(4000)});
 if(!response.ok)return null;
 return normalizeCountry((await response.json()).country);
 }catch{return null;}
}
