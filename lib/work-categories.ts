import fs from 'node:fs/promises';
import path from 'node:path';
import config from '../content/work-categories.json';
import { projects, type Project } from './projects';
import type { WorkCategory } from '../components/categorized-gallery';
export async function getWorkCategories(): Promise<WorkCategory[]> {
 return Promise.all(config.map(async c => {
  const directory=path.join(process.cwd(),'public','Portfolio Works',c.title);
  const entries=await fs.readdir(directory,{withFileTypes:true});
  const files=entries.filter(e=>e.isFile() && /\.(mp4|webm|m4v)$/i.test(e.name)).map(e=>e.name).sort((a,b)=>a.localeCompare(b,'en',{numeric:true}));
  const uploaded=await Promise.all(files.map(async (file,index) => {
   const stat=await fs.stat(path.join(directory,file));const stem=path.parse(file).name;
   const poster=entries.find(e=>e.isFile() && e.name.startsWith(stem+'.poster.') && /\.(webp|png|jpg|jpeg)$/i.test(e.name))?.name;
   const url=(name:string)=>'/Portfolio%20Works/'+encodeURIComponent(c.title)+'/'+encodeURIComponent(name)+'?v='+stat.size+'-'+Math.trunc(stat.mtimeMs);
   return {id:'work-'+c.id+'-'+file,title:'Example '+(index+1),file,group:c.id==='2d-animation'?'2d Animations':c.title,type:'video',media:url(file),poster:poster?url(poster):'',thumbnail:poster?url(poster):'',width:0,height:0,duration:null,bytes:stat.size,sha256:''} as Project;
  }));
  return {id:c.id,title:c.title,items:uploaded.length?uploaded:c.projects.map(id=>projects.find(p=>p.id===id)).filter((p):p is Project=>!!p)};
 }));
}
