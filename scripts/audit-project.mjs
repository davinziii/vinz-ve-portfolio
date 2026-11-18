import fs from 'node:fs';
import path from 'node:path';
const projects=JSON.parse(fs.readFileSync('content/projects.json'));
const prepared=JSON.parse(fs.readFileSync('content/portfolio-media.json')).items;
for(const collection of [projects,prepared]){const ids=new Set();for(const p of collection){if(ids.has(p.id))throw Error('Duplicate project ID: '+p.id);ids.add(p.id);for(const key of ['media','poster']){if(p[key]&&!fs.existsSync(path.join('public',p[key])))throw Error('Missing '+p[key]);}}}
const config=JSON.parse(fs.readFileSync('content/work-categories.json'));
for(const c of config){const items=prepared.filter(p=>p.categoryId===c.id);if(!items.length)throw Error('Empty category: '+c.title);console.log(c.title+': '+items.length+' examples');}
const source=fs.readFileSync('app/home-client.tsx','utf8');for(const id of ['reel-jrus','marms3','marms4','okd9','profile4','redbull2','serum2','fuel2']){if(!projects.some(p=>p.id===id))throw Error('Missing home reference '+id);}
console.log('Asset references, unique IDs, category collections, and home-page references passed.');
