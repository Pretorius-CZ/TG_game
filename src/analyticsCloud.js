import {supabase} from './supabase.js';
async function rpc(name,args){
 const {data,error}=await supabase.rpc(name,args).abortSignal(AbortSignal.timeout(12000));
 if(error)throw error;return data;
}
export async function fetchAnalytics(){
 const overview=await rpc('read_analytics_overview');
 const visits=[];
 for(let offset=0;offset<100000;offset+=1000){
  const page=await rpc('read_analytics_visits',{page_offset:offset,page_size:1000});
  visits.push(...page);
  if(page.length<1000)return {...overview,visits};
 }
 throw new Error('Přehled překročil 100 000 návštěv; je nutná serverová agregace.');
}
export async function markAnalyticsTester(id,tester){await rpc('set_analytics_tester',{device_id:id,is_tester:tester});}
