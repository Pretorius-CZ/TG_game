import { defineConfig } from 'vite';
const version = `${Date.now()}-${process.env.GITHUB_SHA?.slice(0,12)||'local'}`;
const artwork = text => text.replace(/\.(webp|png|jpg|jpeg|svg)(?![\w?])/g,`.$1?v=${version}`);
export default defineConfig(({mode})=>({base:'./',define:{__GAME_VERSION__:JSON.stringify(version)},plugins:[{
 name:'game-version',
 transformIndexHtml(html){return mode==='crazygames'?html.replace('</head>','<script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script></head>'):html;},
 renderChunk(code){return {code:artwork(code),map:null};},
 generateBundle(_,bundle){
  for(const file of Object.values(bundle)){
   if(file.type==='asset'&&file.fileName.endsWith('.css'))file.source=artwork(String(file.source));
   if(file.type==='asset'&&file.fileName.endsWith('.html'))file.source=String(file.source).replace(/\.css"/g,`.css?v=${version}"`);
  }
  this.emitFile({type:'asset',fileName:'version.json',source:JSON.stringify({version})});
 }
}],build:{outDir:mode==='itch'?'dist-itch':mode==='crazygames'?'dist-crazygames':'dist',rollupOptions:{input:['itch','crazygames'].includes(mode)?{game:'index.html'}:{game:'index.html',balance:'balance.html',welcome:'welcome.html'}}}}));
