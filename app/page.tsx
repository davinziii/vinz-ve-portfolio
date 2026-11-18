import Home from "./home-client";
import { getWorkCategories } from "../lib/work-categories";
export default async function Page() { return <Home workCategories={await getWorkCategories()} />; }
