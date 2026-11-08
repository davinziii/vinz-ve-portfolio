import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'Visuals that move — Creative Portfolio',description:'An independent collection of video edits, character animation, motion graphics and graphic design.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
