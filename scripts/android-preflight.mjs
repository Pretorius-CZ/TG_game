import {androidEnvironment} from './android-environment.mjs';
const settings=androidEnvironment();
if(settings.problems.length){console.error(settings.problems.join('\n'));process.exitCode=1;}
else console.log('Android SDK 36 and compatible JDK ready:',settings.javaHome);
