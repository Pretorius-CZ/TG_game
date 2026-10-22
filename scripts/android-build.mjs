import {spawnSync} from 'node:child_process';
import {androidEnvironment,writeAndroidLocalSettings} from './android-environment.mjs';
const settings=androidEnvironment();
if(settings.problems.length){console.error(settings.problems.join('\n'));process.exit(1);}
writeAndroidLocalSettings(settings);
const result=spawnSync(process.platform==='win32'?'cmd.exe':'./gradlew',process.platform==='win32'?['/d','/s','/c','gradlew.bat assembleDebug --console=plain']:['assembleDebug','--console=plain'],{cwd:'android',env:settings.env,stdio:'inherit',windowsHide:true});
if(result.error)console.error(result.error.message);
process.exitCode=result.status??1;
