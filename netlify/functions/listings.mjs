import {getStore} from '@netlify/blobs';
export default async (req)=>{
 if(req.method!=='GET')return Response.json({error:'Metodo non consentito'},{status:405});
 try {
  const state=await getStore({name:'casaradar-v4',consistency:'strong'}).get('state',{type:'json'});
  return Response.json({sourceConfigured:!!process.env.CASARADAR_FEED_URL,initialized:!!state,lastCheck:state?.lastCheck||null,annunci:state?.listings||[],count:state?.listings?.length||0},{headers:{'cache-control':'no-store'}});
 }catch(e){console.error('CasaRadar listings',e);return Response.json({error:'Archivio temporaneamente non disponibile'},{status:503});}
};
