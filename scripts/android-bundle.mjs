import {readFileSync,existsSync,mkdirSync,copyFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {androidEnvironment,writeAndroidLocalSettings} from './android-environment.mjs';

const settings=androidEnvironment();
if(settings.problems.length)throw Error(settings.problems.join('\n'));
if(!existsSync('android/key.properties'))throw Error('Create or restore the upload key first: npm run android:upload-key');
// Fail closed if a future ad change would silently enable real rewarded inventory.
const ads=readFileSync('src/androidAds.js','utf8');
if(!ads.includes('const testRewardId=adUnits.test.rewardedId;')||ads.includes('adUnits.production.rewardedId'))throw Error('Internal bundle requires demo rewarded ads. Review Android ad configuration.');
writeAndroidLocalSettings(settings);
const args=['bundleRelease','-PinternalTestRelease=true','--console=plain'];
const build=spawnSync(process.platform==='win32'?'cmd.exe':'./gradlew',process.platform==='win32'?['/d','/s','/c','gradlew.bat',...args]:args,{cwd:'android',env:settings.env,stdio:'inherit',windowsHide:true});
if(build.status!==0)process.exit(build.status??1);
const source='android/app/build/outputs/bundle/release/app-release.aab';
const verify=spawnSync(path.join(settings.javaHome,'bin','jarsigner'),['-verify',source],{env:settings.env,encoding:'utf8',windowsHide:true});
if(verify.status!==0||!verify.stdout.includes('jar verified.'))throw Error('AAB signature verification failed.');
const folder='releases/google-play/internal-1';mkdirSync(folder,{recursive:true});
const file=path.join(folder,'beyond-the-signal-internal-1.aab');copyFileSync(source,file);
writeFileSync(path.join(folder,'bundle-check.json'),JSON.stringify({file:path.basename(file),package:'com.playbeyondthesignal.game',versionCode:1,versionName:'0.1.0-internal.1',track:'internal',rewardedAds:'Google demo unit only',signatureVerified:true,sha256:createHash('sha256').update(readFileSync(file)).digest('hex'),builtAt:new Date().toISOString()},null,2)+'\n');
console.log(`Signed internal test bundle: ${file}. Public release is not enabled.`);
