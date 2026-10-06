import {readdir,readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {deflateRawSync} from 'node:zlib';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const release=JSON.parse(await readFile('itch-release.json','utf8'));
if(!/^\d+\.\d+\.\d+$/.test(release.version))throw Error('Invalid itch release version');
const root=path.resolve('dist-itch');
async function walk(dir){const files=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())files.push(...await walk(p));else files.push(p);}return files;}
// Only remove known non-game output inside the dedicated itch build.
for(const entry of ['prototypes','balance.html','CNAME'])await rm(path.join(root,entry),{recursive:true,force:true});
for(const file of await walk(root))if(/\.(md|txt)$/i.test(file))await rm(file);
await writeFile(path.join(root,'release.json'),JSON.stringify({...release,commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()},null,2));
const table=Array.from({length:256},(_,n)=>{for(let i=0;i<8;i++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
const crc=bytes=>{let n=0xffffffff;for(const b of bytes)n=table[(n^b)&255]^(n>>>8);return (n^0xffffffff)>>>0;};
const chunks=[],central=[];let offset=0,total=0;const files=(await walk(root)).sort();
for(const file of files){
 const name=Buffer.from(path.relative(root,file).replaceAll('\\','/')),raw=await readFile(file),data=deflateRawSync(raw),sum=crc(raw);
 if(name.length>240||raw.length>200*1024*1024)throw Error('itch file limit: '+file);
 total+=raw.length;
 const h=Buffer.alloc(30);h.writeUInt32LE(0x04034b50);h.writeUInt16LE(20,4);h.writeUInt16LE(0x800,6);h.writeUInt16LE(8,8);h.writeUInt16LE(33,12);h.writeUInt32LE(sum,14);h.writeUInt32LE(data.length,18);h.writeUInt32LE(raw.length,22);h.writeUInt16LE(name.length,26);
 chunks.push(h,name,data);
 const c=Buffer.alloc(46);c.writeUInt32LE(0x02014b50);c.writeUInt16LE(20,4);c.writeUInt16LE(20,6);c.writeUInt16LE(0x800,8);c.writeUInt16LE(8,10);c.writeUInt16LE(33,14);c.writeUInt32LE(sum,16);c.writeUInt32LE(data.length,20);c.writeUInt32LE(raw.length,24);c.writeUInt16LE(name.length,28);c.writeUInt32LE(offset,42);central.push(c,name);offset+=h.length+name.length+data.length;
}
if(files.length>1000||total>500*1024*1024)throw Error('itch archive limit exceeded');
const directory=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(files.length,8);end.writeUInt16LE(files.length,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);
await mkdir('releases',{recursive:true});const zip=Buffer.concat([...chunks,directory,end]),output=`releases/beyond-the-signal-itch-v${release.version}.zip`;await writeFile(output,zip);
await writeFile('releases/beyond-the-signal-itch.zip',zip);
console.log(`${output}: ${files.length} files, ${(zip.length/1024/1024).toFixed(2)} MiB ZIP, ${(total/1024/1024).toFixed(2)} MiB unpacked`);
