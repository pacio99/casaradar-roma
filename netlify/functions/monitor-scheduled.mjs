import {getStore} from '@netlify/blobs';
import {validatedListing, normalizedKey} from '../lib/filter.mjs';

const now = () => new Date().toISOString();
const storeName = 'casaradar-v4';
const sendTelegram = async (a) => {
 const token=process.env.TELEGRAM_BOT_TOKEN, chat=process.env.TELEGRAM_CHAT_ID;
 if(!token||!chat)throw Error('Telegram non configurato');
 const text = `🏠 NUOVA CASA COMPATIBILE\n\n${a.title}\n📍 ${a.zone}, Roma\n💶 ${a.price} €/mese · 📐 ${a.sqm} m²\n👤 ${a.seller==='private'?'Privato':a.seller==='agency'?'Agenzia':'Inserzionista non verificato'}\n🌐 ${a.source}\n${a.url}`;
 const r=await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({chat_id:chat,text,disable_web_page_preview:true}),signal:AbortSignal.timeout(12000)});
 if(!r.ok) throw Error('Telegram HTTP '+r.status);
 const b=await r.json(); if(!b.ok)throw Error('Telegram non conferma invio');
};
export default async () => {
 const feedUrl=process.env.CASARADAR_FEED_URL;
 if (!feedUrl) { console.log('CasaRadar: nessuna fonte configurata, controllo saltato.'); return; }
 const u=new URL(feedUrl); if(u.protocol!=='https:')throw Error('Il feed deve usare HTTPS');
 const headers={'accept':'application/json'};
 if(process.env.CASARADAR_FEED_BEARER)headers.authorization='Bearer '+process.env.CASARADAR_FEED_BEARER;
 const response=await fetch(u,{headers,signal:AbortSignal.timeout(15000),redirect:'error'});
 if(!response.ok)throw Error('Feed HTTP '+response.status);
 const raw=await response.text();if(raw.length>1_000_000)throw Error('Feed eccessivo');
 const parsed=JSON.parse(raw);if(!Array.isArray(parsed))throw Error('Il feed deve essere un array JSON');
 const entries=[...new Map(parsed.slice(0,500).map(validatedListing).filter(Boolean).map(a=>[normalizedKey(a),a])).entries()];
 const store=getStore({name:storeName,consistency:'strong'});
 // Prima acquisizione: baseline, non notificare immobili preesistenti.
 const prior=await store.get('state',{type:'json'});
 const seen=new Set(prior?.seen||[]);
 const listings=Array.isArray(prior?.listings)?prior.listings:[];
 const existing=new Set(listings.map(normalizedKey));
 let notified=0;const firstRun=!prior;
 for(const [key,entry] of entries){
   if(!seen.has(key)){
     if(!firstRun && notified<20){await sendTelegram(entry);notified++;}
     seen.add(key);
   }
   if(!existing.has(key)){listings.unshift(entry);existing.add(key);}
 }
 const newState={seen:[...seen].slice(-10000),listings:listings.slice(0,500),lastCheck:now(),sourceConfigured:true,lastImportCount:entries.length};
 await store.setJSON('state',newState);
 console.log(JSON.stringify({firstRun,valid:entries.length,notified}));
};
export const config={schedule:'*/30 * * * *'};
