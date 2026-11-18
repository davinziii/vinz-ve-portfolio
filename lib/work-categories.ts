import config from '../content/work-categories.json';
import media from '../content/portfolio-media.json';
import type { Project } from './projects';
import type { WorkCategory } from '../components/categorized-gallery';
export async function getWorkCategories(): Promise<WorkCategory[]> {
 return config.map(c=>({id:c.id,title:c.title,items:media.items.filter(p=>p.categoryId===c.id).map(p=>({...p,media:p.media+'?v='+p.signature,poster:p.poster+'?v='+p.signature,thumbnail:p.thumbnail+'?v='+p.signature}) as Project)}));
}
