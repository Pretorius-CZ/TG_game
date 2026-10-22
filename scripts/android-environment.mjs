import {existsSync,readdirSync,mkdirSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

export function androidEnvironment(){
 const portable=path.resolve('.local/jdk21');
 const candidates=[process.env.JAVA_HOME,...(existsSync(portable)?readdirSync(portable).map(name=>path.join(portable,name)):[]),process.platform==='win32'?'C:/Program Files/Android/Android Studio/jbr':undefined].filter(Boolean);
 let javaHome;
 for(const candidate of candidates){
  const result=spawnSync(path.join(candidate,'bin',process.platform==='win32'?'java.exe':'java'),['-version'],{encoding:'utf8',windowsHide:true});
  const major=Number(((result.stderr||'')+(result.stdout||'')).match(/version "(\d+)/)?.[1]);
  // Gradle 8.14 supports Java through 24; Capacitor 8 needs Java 21.
  if(major>=21&&major<=24){javaHome=candidate;break;}
 }
 const sdk=process.env.ANDROID_HOME||process.env.ANDROID_SDK_ROOT||(process.env.LOCALAPPDATA?path.join(process.env.LOCALAPPDATA,'Android','Sdk'):'');
 const problems=[];
 if(!javaHome)problems.push('Compatible JDK 21–24 missing. Set JAVA_HOME to JDK 21; Android Studio may bundle a newer incompatible JDK.');
 if(!existsSync(path.join(sdk,'platforms','android-36','android.jar')))problems.push('Android SDK platform 36 missing. Install it in SDK Manager.');
 if(!existsSync(path.join(sdk,'build-tools','36.0.0')))problems.push('Android SDK Build-Tools 36.0.0 missing. Install it in SDK Manager.');
 return {javaHome,sdk,problems,env:{...process.env,JAVA_HOME:javaHome,ANDROID_HOME:sdk}};
}
export function writeAndroidLocalSettings({javaHome,sdk}){
 // Local machine paths are generated and ignored, never committed.
 const property=value=>value.replaceAll('\\','/');
 writeFileSync('android/local.properties',`sdk.dir=${property(sdk)}\n`);
 mkdirSync('android/.gradle',{recursive:true});
 writeFileSync('android/.gradle/config.properties',`java.home=${property(javaHome)}\n`);
 mkdirSync('android/.idea',{recursive:true});
 if(!existsSync('android/.idea/gradle.xml'))writeFileSync('android/.idea/gradle.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<project version="4"><component name="GradleSettings"><option name="linkedExternalProjectsSettings"><GradleProjectSettings><option name="externalProjectPath" value="$PROJECT_DIR$"/><option name="gradleJvm" value="#GRADLE_LOCAL_JAVA_HOME"/><option name="modules"><set><option value="$PROJECT_DIR$"/><option value="$PROJECT_DIR$/app"/><option value="$PROJECT_DIR$/../node_modules/@capacitor/android/capacitor"/><option value="$PROJECT_DIR$/../node_modules/@capacitor-community/admob/android"/><option value="$PROJECT_DIR$/capacitor-cordova-android-plugins"/></set></option></GradleProjectSettings></option></component></project>\n`);
}
