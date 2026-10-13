// Conservativo: niente indovinare zona, città, prezzo o metratura.
export const ZONES = [
 'Tiburtina / Pietralata','Montesacro / Talenti','Bufalotta / Porta di Roma',
 'Ponte Mammolo / Rebibbia','Colli Aniene / Verderocca','Casal Bruciato / Casal Bertone',
 'Tor Sapienza / La Rustica','Centocelle / Alessandrino','Tor Tre Teste / Torre Maura',
 'Prenestina / Villa Gordiani','Settecamini / Case Rosse','San Basilio / Casal Monastero'
];
const normalize = s => String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const aliases = new Map();
for (const zone of ZONES) {
  aliases.set(normalize(zone), zone);
  for (const name of zone.split('/')) aliases.set(normalize(name), zone);
}
export function validatedListing(raw){
 if (!raw || typeof raw !== 'object') return null;
 if (normalize(raw.city) !== 'roma' || (raw.municipality && normalize(raw.municipality) !== 'roma')) return null;
 const zone = aliases.get(normalize(raw.zone));
 const price=Number(raw.price), sqm=Number(raw.sqm);
 if (!zone || !Number.isFinite(price) || price<=0 || price>800 || !Number.isFinite(sqm) || sqm<50) return null;
 if (normalize(raw.contract)==='tourist' || normalize(raw.contract)==='turistico') return null;
 if (raw.fullApartment!==true) return null;
 let url; try { const u=new URL(raw.url); if(u.protocol!=='https:' && u.protocol!=='http:')return null; url=u.href; }catch{return null}
 const title=String(raw.title||'').trim().slice(0,150); if(!title)return null;
 const seller=['private','agency'].includes(raw.seller)?raw.seller:'unknown';
 const source=String(raw.source||'Fonte esterna').slice(0,70);
 const stableKey=String(raw.externalId || url).slice(0,500);
 return {id:stableKey,title,price,sqm,zone,city:'Roma',seller,source,url,contract:['residential','temporary'].includes(raw.contract)?raw.contract:'unknown',notes:'',addedAt:new Date().toISOString()};
}
export function normalizedKey(listing){
 const u=new URL(listing.url);u.hash='';for(const p of [...u.searchParams.keys()])if(/^utm_|^(fbclid|gclid)$/i.test(p))u.searchParams.delete(p);
 return `${listing.source.toLowerCase()}::${u.origin}${u.pathname.replace(/\/$/,'')}`;
}
