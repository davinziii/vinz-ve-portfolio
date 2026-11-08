import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=process.argv[2];
if(!source){console.error('Usage: node scripts/optimize-media.mjs "C:/path/to/Port"');process.exit(1)}
const root=path.resolve(source),target=path.join(project,'public/media');
if(root===project||root.startsWith(project+path.sep)){throw new Error('Source must be outside the website project.')}
fs.mkdirSync(target,{recursive:true});
const previous=JSON.parse(fs.readFileSync(path.join(project,'content/projects.json'),'utf8'));
const seen=new Map(),inventory=[],projects=[];
function run(args){return execFileSync('ffmpeg',['-y','-v','error',...args],{maxBuffer:20e6})}
function scan(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const source=path.join(dir,entry.name);if(source===project||entry.name==='portfolio-website')continue;if(entry.isDirectory()){scan(source);continue}if(!/\.(mp4|mov|webm|gif|png|jpe?g|webp)$/i.test(entry.name))continue;const sha256=crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex');const probe=JSON.parse(execFileSync('ffprobe',['-v','quiet','-show_streams','-show_format','-of','json',source]));const stream=probe.streams.find(s=>s.width);const relative=path.relative(root,source);const group=relative.split(path.sep)[0];const type=/\.(mp4|mov|webm|gif)$/i.test(source)?'video':'image';let id=path.parse(entry.name).name.toLowerCase().replace(/[^a-z0-9-]/g,'-');if(projects.some(p=>p.id===id))id+='-'+sha256.slice(0,6);const item={id,file:entry.name,group,bytes:fs.statSync(source).size,width:stream.width,height:stream.height,duration:Number(probe.format.duration)||null,type,sha256};inventory.push({...item,source,duplicateOf:seen.get(sha256)||null});if(seen.has(sha256))continue;seen.set(sha256,id);const poster='/media/'+id+'.webp',media=type==='video'?'/media/'+id+'.mp4':poster;const unchanged=previous.some(p=>p.id===id&&p.sha256===sha256)&&fs.existsSync(project+'/public'+media)&&fs.existsSync(project+'/public'+poster);if(!unchanged){run([...(type==='video'?['-ss',String(Math.min(1,(item.duration||2)/3))]:[]),'-i',source,'-frames:v','1','-vf','scale=1200:1200:force_original_aspect_ratio=decrease',project+'/public'+poster]);if(type==='video')run(['-i',source,'-vf','scale=540:-2','-c:v','libx264','-preset','fast','-crf','25','-pix_fmt','yuv420p','-movflags','+faststart','-c:a','aac','-b:a','96k',project+'/public'+media]);}projects.push({...item,poster,media});console.log(id,unchanged?'(cached)':'(optimized)');}}
scan(root);fs.writeFileSync(project+'/asset-inventory.json',JSON.stringify(inventory,null,2));fs.writeFileSync(project+'/content/projects.json',JSON.stringify(projects,null,2));console.log(`${projects.length} unique assets; ${inventory.length-projects.length} duplicates. Originals unchanged.`);
