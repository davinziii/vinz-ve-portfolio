import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {metadataBase:new URL('https://visuals-in-motion-vinz.gladbluebird5.chatgpt.site'),title:'Vinz de Leon — Video Editor & Designer',description:'Video editing, character animation and graphic design by Vinz de Leon.',icons:{icon:'/media/vinz-avatar.webp'},openGraph:{title:'Vinz de Leon — Video Editor & Designer',description:'Video editing, character animation and graphic design.',images:['/media/vinz-portrait.webp']}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
