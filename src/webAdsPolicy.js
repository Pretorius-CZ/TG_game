// Live advertising stays closed until approval and consent integration are implemented.
export function webAdsMode({configured='simulation',url,storage,platform='web'}){
 if(platform!=='web')return 'simulation';
 const params=new URL(url).searchParams;
 let bot=params.get('utm_source')==='automated_test'&&params.get('utm_medium')==='bot';
 for(const key of ['beyond-signal-migrated-traffic-v1','beyond-signal-campaign-visit-v1'])try{
  const value=JSON.parse(storage?.getItem(key)||'null');bot||=value?.source==='automated_test'&&value?.medium==='bot';
 }catch{}
 if(!['simulation','test','disabled','live'].includes(configured))return 'disabled';
 if(configured==='disabled'||configured==='live')return 'disabled';
 if(bot)return 'simulation';
 if(configured==='test'||params.get('ads_test')==='google')return 'test';
 return configured==='simulation'?'simulation':'disabled';
}
