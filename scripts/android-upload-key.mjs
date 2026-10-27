import {existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {randomBytes} from 'node:crypto';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {androidEnvironment} from './android-environment.mjs';

const settings=androidEnvironment();
if(settings.problems.length)throw Error(settings.problems.join('\n'));
const folder=path.resolve('.local/play-signing'),store=path.join(folder,'beyond-signal-upload.jks');
if(existsSync(store)||existsSync('android/key.properties'))throw Error('Signing configuration already exists; refusing to replace it.');
mkdirSync(folder,{recursive:true});
const password=randomBytes(32).toString('hex');
const result=spawnSync(path.join(settings.javaHome,'bin','keytool'),[
 '-genkeypair','-keystore',store,'-storetype','JKS','-alias','upload',
 '-storepass:env','BTS_UPLOAD_PASSWORD','-keypass:env','BTS_UPLOAD_PASSWORD',
 '-keyalg','RSA','-keysize','3072','-validity','10000',
 '-dname','CN=Michal Malich, O=Beyond the Signal, C=CZ','-noprompt'
],{env:{...settings.env,BTS_UPLOAD_PASSWORD:password},encoding:'utf8',windowsHide:true});
if(result.status!==0)throw Error('Upload key generation failed. Inspect the local signing directory before retrying.');
writeFileSync('android/key.properties',`storeFile=${store.replaceAll('\\','/')}\nstorePassword=${password}\nkeyAlias=upload\nkeyPassword=${password}\n`,{flag:'wx',mode:0o600});
writeFileSync(path.join(folder,'BACKUP.txt'),'Keep the upload keystore AND android/key.properties in an encrypted backup outside this computer. Never commit or send them. The Google Play app signing key is managed separately by Play App Signing.\n');
console.log('Local upload key created. Back up .local/play-signing and android/key.properties securely. No passwords were printed.');
