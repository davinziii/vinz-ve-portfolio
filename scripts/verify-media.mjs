import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const items=JSON.parse(fs.readFileSync(root+'/content/projects.json'));
const ids=new Set();for(const p of items){if(ids.has(p.id))throw Error('Duplicate ID '+p.id);ids.add(p.id);for(const f of [p.poster,p.media])if(!fs.existsSync(root+'/public'+f))throw Error('Missing '+f);if(!p.width||!p.height)throw Error('Missing dimensions '+p.id)}
console.log(`Verified ${items.length} project IDs, aspect ratios, posters, and media files.`);
