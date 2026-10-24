import {test,expect} from '@playwright/test';
import {createPlaytest,playtestKey} from '../../src/playtestStorage.js';
import {levelGroups} from '../../src/levelCatalog.js';
import {levelCatalog} from '../../src/levelCatalog.js';
const key=playtestKey('qa-blind');
async function setup(page,{win=false,offline=false,moves=2,cursor=0}={}){
 const s=createPlaytest(levelGroups.flatMap(([,rs])=>rs),{rules:'qa'});s.cursor=cursor;const r=s.repairs.find(r=>r.id===s.order[cursor]);
 r.level={cols:7,rows:7,types:5};r.ice=[];r.resonators=[];r.goals=[{type:null,target:win?3:9999,label:'Test objective'}];r.moves=moves;
 const sent=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route(/supabase\.co/,route=>{const url=route.request().url();if(!url.includes('/rpc/record_balance_attempt'))throw Error('Unexpected test backend request '+url);sent.push(route.request().postDataJSON());return offline?route.fulfill({status:503,body:'offline'}):route.fulfill({status:200,body:''});});
 await page.route('**/src/goalRefill.js',async route=>{const response=await route.fetch(),text=await response.text(),board=Array.from({length:49},(_,i)=>(Math.floor(i/7)+2*(i%7))%5);board[14]=0;board[15]=0;board[16]=1;board[17]=0;await route.fulfill({response,body:text.replace('export function makeGoalBoard(level,goals,covers=[],random=Math.random){','export function makeGoalBoard(level,goals,covers=[],random=Math.random){return '+JSON.stringify(board)+';')});});
 await page.addInitScript(({s,key})=>{if(sessionStorage.getItem('blind-seeded'))return;sessionStorage.setItem('blind-seeded','1');localStorage.setItem(key,JSON.stringify(s));for(const k of ['to-the-stars-progress-v1','to-the-stars-lives-v1','to-the-stars-helpers-v1:guest:0','beyond-signal-analytics-choice-v1'])localStorage.setItem(k,'normal-save-sentinel');},{s,key});
 await page.setViewportSize({width:320,height:568});await page.goto('/playtest.html?run=qa-blind');
 return {s,sent,errors};
}
test('blind win, rating, fixed order, reload and isolation from normal saves',async({page})=>{
 const {s,sent,errors}=await setup(page,{win:true});expect(sent).toEqual([]);
 await page.getByRole('button',{name:'Povolit sběr a zahájit test'}).click();
 await expect(page.locator('#level-title')).toHaveText('Test 1 / 200');await expect(page.locator('.preview-complete')).toHaveCount(0);
 await page.locator('[data-cell="16"]').click();await page.locator('[data-cell="17"]').click();await expect(page.locator('.win-panel')).toBeVisible();
 await page.getByRole('button',{name:'Ohodnotit pokus'}).click();await expect(page.locator('#rating-heading')).toContainText('Test 1');
 await page.getByRole('button',{name:'Akorát',exact:true}).click();await page.getByLabel('Poznámka (nepovinná)').fill('Rezerva dobrá');await page.getByRole('button',{name:'Uložit hodnocení a další test'}).click();
 await expect(page.locator('#level-title')).toHaveText('Test 2 / 200');await expect.poll(()=>sent.some(r=>r.incoming.configuration.playtest.rating==='fair')).toBe(true);
 expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).order,key)).toEqual(s.order);
 for(const k of ['to-the-stars-progress-v1','to-the-stars-lives-v1','to-the-stars-helpers-v1:guest:0','beyond-signal-analytics-choice-v1'])expect(await page.evaluate(k=>localStorage.getItem(k),k)).toBe('normal-save-sentinel');
 await page.reload();await expect(page.locator('#rating-heading')).toContainText('Test 2');expect(errors).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:'.local/blind-playtest-rating-'+test.info().project.name+'.png'});
});
test('offline quit is retained, rating can retry the same position and another tab cannot overwrite it',async({page,context})=>{
 await setup(page,{offline:true});await page.getByRole('button',{name:'Povolit sběr a zahájit test'}).click();
 const other=await context.newPage();await other.goto('/playtest.html?run=qa-blind');await expect(other.getByRole('alert')).toContainText('jiné kartě');await other.close();
 await page.locator('.mini-header .close').click();await page.locator('.quit-panel .primary').click();await expect(page.locator('#rating-heading')).toBeVisible();
 await page.getByRole('button',{name:'Těžké',exact:true}).click();await page.getByRole('button',{name:'Uložit a zkusit stejný test znovu'}).click();await expect(page.locator('#level-title')).toHaveText('Test 1 / 200');
 expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).pending.length,key)).toBe(1);
 await page.reload();await expect(page.locator('#rating-heading')).toContainText('Test 1');
});
test('exhaustion offers unused Undo before rating exactly once and retains remaining objectives',async({page})=>{
 const {sent,errors}=await setup(page,{moves:1});await page.getByRole('button',{name:'Povolit sběr a zahájit test'}).click();
 await page.locator('[data-cell="16"]').click();await page.locator('[data-cell="17"]').click();
 await expect(page.locator('.out-of-moves .undo-control')).toBeEnabled();
 await expect(page.locator('#rating-heading')).toHaveCount(0);
 await page.locator('.out-of-moves .primary').click();await expect(page.locator('#rating-heading')).toBeVisible();
 await expect(page.locator('.playtest-rating')).toContainText('Došly tahy');
 const s=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);expect(s.attempts).toHaveLength(1);expect(s.attempts[0].moves).toBe(1);expect(s.attempts[0].configuration.goals[0].target).toBe(9999);expect(errors).toEqual([]);
 await expect.poll(()=>sent.length).toBeGreaterThan(0);
 await page.getByRole('button',{name:'Akorát',exact:true}).click();await page.getByRole('button',{name:'Uložit a pokračovat později'}).click();
 await expect(page.locator('.playtest-progress')).toContainText('1 / 200');await expect(page.locator('.mini-dialog')).toHaveCount(0);
 await page.reload();await page.getByRole('button',{name:'Pokračovat v testu',exact:true}).click();await expect(page.locator('#level-title')).toHaveText('Test 2 / 200');
});

test('blind Undo is free once, restores the last turn and is recorded in the server payload',async({page})=>{
 const {s,sent,errors}=await setup(page,{moves:1});
 await page.getByRole('button',{name:'Povolit sběr a zahájit test'}).click();
 const undo=page.locator('.helper-bar .undo-control');
 await expect(undo).toBeDisabled();await expect(undo.locator('.helper-badge')).toHaveText('1');
 const state=()=>page.evaluate(()=>({board:[...document.querySelectorAll('[data-cell]')].map(c=>c.dataset.type),moves:document.querySelector('.moves-counter strong').textContent,counts:[...document.querySelectorAll('.objective-list progress')].map(p=>p.value)}));
 const before=await state();
 await page.locator('[data-cell="16"]').click();await page.locator('[data-cell="17"]').click();
 await expect(page.locator('.out-of-moves .undo-control')).toBeEnabled();
 const after=await state();
 await page.locator('.out-of-moves .undo-control').click();
 await expect(page.locator('.out-of-moves')).toHaveCount(0);expect(await state()).toEqual(before);
 await expect(undo).toBeDisabled();await expect(undo.locator('.helper-badge')).toHaveText('0');
 await expect(page.locator('.undo-notice')).toHaveText('Tah vrácen.');
 await expect(page.locator('.reward-ad')).toHaveCount(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.locator('[data-cell="16"]').click();await page.locator('[data-cell="17"]').click();
 await expect(page.locator('#rating-heading')).toBeVisible();
 const session=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
 expect(session.attempts).toHaveLength(1);expect(session.attempts[0].counts).toEqual(after.counts);
 expect(session.attempts[0].configuration.assistance.undoUses).toBe(1);
 expect(session.attempts[0].build).toBe('2026-10-24-blind-undo-v1');expect(session.rules).toBe('qa');
 await expect.poll(()=>sent.some(r=>r.incoming.configuration.assistance.undoUses===1)).toBe(true);
 await page.getByRole('button',{name:'Akorát',exact:true}).click();await page.getByRole('button',{name:'Uložit a zkusit stejný test znovu'}).click();
 await expect(page.locator('#level-title')).toHaveText('Test 1 / 200');
 await expect(undo.locator('.helper-badge')).toHaveText('1');await expect(undo).toBeDisabled();
 expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).order,key)).toEqual(s.order);
 for(const k of ['to-the-stars-progress-v1','to-the-stars-lives-v1','to-the-stars-helpers-v1:guest:0','beyond-signal-analytics-choice-v1'])expect(await page.evaluate(k=>localStorage.getItem(k),k)).toBe('normal-save-sentinel');
 expect(errors).toEqual([]);
});
test('the last rating completes the full set without starting a 201st test',async({page})=>{
 await setup(page,{cursor:199});await page.getByRole('button',{name:'Povolit sběr a zahájit test'}).click();
 await expect(page.locator('#level-title')).toHaveText('Test 200 / 200');await page.locator('.mini-header .close').click();await page.locator('.quit-panel .primary').click();
 await page.getByRole('button',{name:'Akorát',exact:true}).click();await page.getByRole('button',{name:'Uložit hodnocení a další test'}).click();await expect(page.getByRole('heading',{name:'Všech 200 levelů vyhodnoceno.'})).toBeVisible();
 expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).cursor,key)).toBe(200);
});
test('balance displays blind ratings separately from ordinary difficulty rows',async({page})=>{
 const make=(id)=>{const l=levelCatalog.find(l=>l.id===id);return {attemptId:crypto.randomUUID(),level:id,reporter:crypto.randomUUID(),at:Date.now(),moves:3,budget:l.moves,baseBudget:l.moves,outcome:'won',remaining:l.moves-3,configuration:{cols:l.cols,rows:l.rows,types:l.types},counts:[3],helpers:[],hints:0,extraMoves:false};};
 const ordinary=make('windows'),blind=make('lights');blind.configuration.playtest={mode:'blind-200-v1',session:crypto.randomUUID(),index:1,total:200,rating:'fair',note:'Oddělené hodnocení'};
 await page.route('**/rest/v1/rpc/*',r=>{const name=r.request().url().split('/').at(-1);return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(name==='read_balance_attempts'?[ordinary,blind]:name==='read_analytics_visits'?[]:{bots:[],testers:[],trafficScopes:{players:{excluded:{live:{active:0,total:2,today:2},retention:[]}}}})});});
 await page.goto('/balance.html');await expect(page.getByRole('region',{name:'Slepý playtest'})).toContainText('Oddělené hodnocení');await expect(page.getByRole('region',{name:'Slepý playtest'})).toContainText('Akorát');
 await expect(page.locator('.table-wrap')).toContainText('Window seals');await expect(page.locator('.table-wrap')).not.toContainText('Emergency lights');
});
