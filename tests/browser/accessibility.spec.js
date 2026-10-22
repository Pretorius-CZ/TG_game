import {test,expect} from '@playwright/test';
test.beforeEach(async({page})=>{await page.addInitScript(()=>{if(!localStorage.getItem('beyond-signal-analytics-choice-v1'))localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()}));});});
import {createRequire} from 'node:module';
import {findMove} from '../../src/match3.js';
const require=createRequire(import.meta.url),axePath=require.resolve('axe-core/axe.min.js');
const rules=['label-content-name-mismatch','aria-prohibited-attr','color-contrast'];
async function audit(page,context,heading=false){
 await page.addScriptTag({path:axePath});
 const result=await page.evaluate(async({context,rules})=>{
  const report=await window.axe.run(context,{runOnly:{type:'rule',values:rules}});
  return report.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
 },{context,rules:heading?[...rules,'page-has-heading-one']:rules});
 expect(result).toEqual([]);
}
test.beforeEach(async({page})=>{
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
});
for(const language of ['en','cs'])for(const viewport of [{width:320,height:568},{width:1920,height:1080}]){
 test(`accessible names, stock, hint and stars ${viewport.width} ${language}`,async({page},testInfo)=>{
  await page.setViewportSize(viewport);
  await page.addInitScript(l=>localStorage.setItem('to-the-stars-language',l),language);
  await page.goto('/tests/browser/fixture.html?result=performance');
  await expect(page.locator('.board')).toBeVisible();
  await audit(page,'.mini-dialog');
  const hint=page.locator('.hint-control');await hint.focus();await page.keyboard.press('Enter');
  await expect(hint).toHaveAccessibleName(language==='cs'?'Nápověda REKL.':'Hint AD');
  await audit(page,'.mini-dialog');
  await page.locator('.helper-tile').first().click();await page.locator('[data-cell="0"]').click();
  await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');
  await expect(page.locator('.helper-tile').first()).toHaveAccessibleName(language==='cs'?/REKL\./:/AD/);
  await audit(page,'.mini-dialog');
  await page.screenshot({path:testInfo.outputPath('helpers-ad.png')});
  await hint.click();await page.locator('.reward-ad .primary').click();await page.locator('.reward-ad .primary').click();
  await hint.click();await expect(hint).toHaveAccessibleName(language==='cs'?'Nápověda 0':'Hint 0');
  await audit(page,'.mini-dialog');
  await page.locator('.helper-tile').first().click();await page.locator('.reward-ad .primary').click();await page.locator('.reward-ad .primary').click();
  await page.locator('.helper-tile').first().click();await page.locator('[data-cell="0"]').click();
  await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');
  await expect(page.locator('.helper-tile').first()).toHaveAccessibleName(/0$/);
  await audit(page,'.mini-dialog');
  await page.locator('.mechanics-help').click();await audit(page,'.mechanic-tutorial');
  await page.keyboard.press('Escape');await page.locator('.mini-header .close').click();
  await audit(page,'.quit-panel');
  await expect(page.locator('.quit-panel .keep-playing')).toBeFocused();
  await page.keyboard.press('Tab');await expect(page.locator('.quit-panel .primary')).toBeFocused();
  await page.keyboard.press('Shift+Tab');await expect(page.locator('.quit-panel .keep-playing')).toBeFocused();
  await page.keyboard.press('Escape');await expect(page.locator('.quit-panel')).toHaveCount(0);
  await expect(page.locator('.mini-header .close')).toBeFocused();
  await page.goto('/tests/browser/fixture.html?result=won');
  await expect(page.locator('.board')).toBeVisible();
  const cells=await page.locator('[data-cell]').evaluateAll(c=>c.map(el=>+el.dataset.type));
  for(const i of findMove(cells,7)){await page.locator(`[data-cell="${i}"]`).focus();await page.keyboard.press('Enter');}
  await expect(page.locator('.win-panel')).toBeVisible();
  await expect(page.locator('.rating-stars[role="img"]')).toHaveCount(2);
  await audit(page,'.mini-dialog');
 });
 test(`settings contrast, heading and keyboard ${viewport.width} ${language}`,async({page})=>{
  await page.setViewportSize(viewport);
  await page.addInitScript(l=>localStorage.setItem('to-the-stars-language',l),language);
  await page.goto('/');await expect(page.locator('.welcome[data-art-ready="true"]')).toBeVisible();
  const toggle=page.locator('.account-control>button');
  await toggle.focus();await page.keyboard.press('Enter');
  await expect(page.locator('.account-panel h2')).toBeFocused();
  await audit(page,'body',true);
  await page.keyboard.press('Tab');await expect(page.locator('.language-picker select')).toBeFocused();
  await page.keyboard.press('Escape');await expect(toggle).toBeFocused();
  await page.locator('.welcome-play').click();await page.locator('.intro-skip').click();
  await page.locator('.repair-bubble-dialog .close').click();
  await toggle.click();await audit(page,'body',true);
  await page.locator('.account-close').focus();await page.keyboard.press('Enter');
  await expect(page.locator('.account-panel')).toHaveCount(0);await expect(toggle).toBeFocused();
 });
}
