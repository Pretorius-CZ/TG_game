import {message,sourceMessage} from './messages.js';

// English source tokens are stable data labels; grammar belongs in catalogs.
const quantities=['coolant charges','energy modules','data chips','alloy components','light cells','biocapsules','alien ore','biological cores','fuel cells','energy crystals','blue comets','red energy orbs','energy orbs','crystals','comets','asteroids','stars','pieces','navigation prisms','research samples','living seeds','root nodes','grains of luminous pollen','luminous pollen','air filter modules','supply capsules'];
const quantityPattern=new RegExp('(\\d+) (?:any )?('+quantities.join('|')+')','g');

export function dynamicTranslation(source,language){
 const msg=(id,values)=>message(id,values,language);
 const tr=value=>sourceMessage(value,language)??dynamicTranslation(value,language)??value;
 let m;
 if(/^(Match|Collect|Break) /.test(source)){
  const found=[...source.matchAll(quantityPattern)];
  const parts=[];
  if(found.length)parts.push(msg('goal.collect',{items:new Intl.ListFormat(language,{style:'long',type:'conjunction'}).format(found.map(match=>`${match[1]} ${msg('term.'+match[2].replaceAll(' ','-'))}`))}));
  const covers=source.match(/(?:all |release all |Break all )(\d+) protective covers/);
  if(covers)parts.push(msg('goal.covers',{count:covers[1]}));
  else if(/protective covers?/.test(source))parts.push(msg('goal.allCovers'));
  if((m=source.match(/in (\d+) moves/)))parts.push(msg('goal.moves',{count:m[1]}));
  if(source.includes('Red energy orbs now'))parts.push(msg('goal.redOrbs'));
  if(source.includes('Charge every resonator.'))parts.push(msg('goal.resonators'));
  if(parts.length)return parts.join(' ');
 }
 if((m=source.match(/^(\d+) moves left$/)))return msg('common.movesLeft',{count:Number(m[1])});
 if((m=source.match(/^(?:Covered )?(.+), row (\d+), column (\d+)$/)))return msg('board.position',{piece:source.startsWith('Covered ')?msg('board.covered',{piece:tr(m[1])}):tr(m[1]),row:m[2],column:m[3]});
 if((m=source.match(/^(\d+) of 5 energy charges(?:, next charge in (.+))?$/)))return msg('ui.energyCount',{count:m[1]})+(m[2]?', '+msg('ui.nextCharge',{time:m[2]}):'');
 if((m=source.match(/^RECHARGE (.+)$/)))return msg('ui.recharge',{time:m[1]});
 if((m=source.match(/^Show a hint, (\d+) remaining$/)))return msg('ui.hintRemaining',{count:m[1]});
 if((m=source.match(/^· (\d+) protective covers$/)))return msg('ui.coverCount',{count:m[1]});
 if((m=source.match(/^(\d+) covers left\. /)))return msg('ui.remainingCovers',{count:m[1]});
 if((m=source.match(/^Continue to (.+)$/)))return msg('ui.continueTo',{place:tr(m[1])});
 if((m=source.match(/^Next: (.+?)(?: ·|\.) Follow the marked door\.$/)))return msg('ui.nextDoor',{place:tr(m[1])});
 if((m=source.match(/^Requires (.+)$/)))return msg('ui.requires',{place:tr(m[1])});
 if((m=source.match(/^First restore (.+)\.$/)))return msg('ui.firstRestore',{place:tr(m[1])});
 if((m=source.match(/^(\d+)\/4 systems online · Tap the highlighted device\.$/)))return msg('ui.systemsOnline',{count:m[1]});
 if((m=source.match(/^Inspect (.+)$/)))return msg('ui.inspect',{place:tr(m[1])});
 if((m=source.match(/^Explore · (.+)$/)))return msg('ui.explore',{place:tr(m[1])});
 if((m=source.match(/^CHAPTER (\d+)(.*)$/)))return msg('ui.chapter',{number:m[1]})+m[2].split(' / ').map(tr).join(' / ');
 if((m=source.match(/^(✓ |↻ )(.+)$/)))return m[1]+tr(m[2]);
 if((m=source.match(/^(.+?)( ↻| →| ↗|\.)$/))){const text=tr(m[1]);if(text!==m[1])return text+m[2];}
 if(source.includes(' / '))return source.split(' / ').map(tr).join(' / ');
 return undefined;
}
