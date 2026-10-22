import {readdir,readFile} from 'node:fs/promises';
import path from 'node:path';

// Keep runtime assets, including dynamically selected scenes/tiles, but not source artwork or prototypes.
export function androidAssets(){
 return {name:'android-runtime-assets',apply:'build',async buildStart(){
  const groups={intro:/\.webp$/i,scenes:/(\.webp$|^map-.*\.png$)/i,tiles:/\.png$/i,audio:/(\.wav$|License\.txt$)/i};
  for(const [folder,pattern] of Object.entries(groups)){
   for(const entry of await readdir(path.resolve('public',folder),{withFileTypes:true})){
    if(!entry.isFile()||!pattern.test(entry.name))continue;
    this.emitFile({type:'asset',fileName:`${folder}/${entry.name}`,source:await readFile(path.resolve('public',folder,entry.name))});
   }
  }
 }};
}
