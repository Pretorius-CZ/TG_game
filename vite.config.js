import { defineConfig } from 'vite';
import {sitePages,localizedSiteFiles} from './src/sitePages.js';
const version = `${Date.now()}-${process.env.GITHUB_SHA?.slice(0,12)||'local'}`;
const artwork = text => text.replace(/\.(webp|png|jpg|jpeg|svg)(?![\w?])/g,`.$1?v=${version}`);
export default defineConfig(({mode})=>({base:'./',server:{watch:{ignored:['**/.local/**','**/testovani_boty/reports/**']}},define:{__GAME_VERSION__:JSON.stringify(version)},plugins:[{
 name:'game-version',
 transformIndexHtml(html){
   if(!['itch','crazygames','telegram'].includes(mode))html=html.replace('</head>','<meta name="google-adsense-account" content="ca-pub-4627613906098117"/></head>');
   return mode==='crazygames'?html.replace('</head>','<script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script></head>'):html;},
 renderChunk(code){return {code:artwork(code),map:null};},
 generateBundle(_,bundle){
  for(const file of Object.values(bundle)){
   if(file.type==='asset'&&file.fileName.endsWith('.css'))file.source=artwork(String(file.source));
   if(file.type==='asset'&&file.fileName.endsWith('.html'))file.source=String(file.source).replace(/\.css"/g,`.css?v=${version}"`);
  }
  this.emitFile({type:'asset',fileName:'version.json',source:JSON.stringify({version})});
  this.emitFile({type:'asset',fileName:'migration-policy.json',source:JSON.stringify({version:1,transferReady:process.env.VITE_LEGACY_TRANSFER_READY==='true',gameOrigin:'https://game.playbeyondthesignal.com'})});
 }
}],build:{outDir:mode==='itch'?'dist-itch':mode==='crazygames'?'dist-crazygames':'dist',rollupOptions:{input:['itch','crazygames','telegram'].includes(mode)?{game:'index.html'}:{game:'index.html',balance:'balance.html',playtest:'playtest.html',welcome:'welcome.html',transfer:'transfer.html',privacy:'privacy.html',contact:'contact.html',...Object.fromEntries(sitePages.map(page=>[page.id,page.file])),...Object.fromEntries(localizedSiteFiles.map(file=>[file,file]))}}}}));
