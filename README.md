# CasaRadar Roma v4 — Telegram + monitoraggio programmato

## COSA È GIÀ PRONTO
- PWA con filtri Roma Est/Nord-Est, 12 zone, massimo 800 €, minimo 50 m².
- Test Telegram funzionante (stessa funzione della v3).
- Funzione Netlify **monitor-scheduled** ogni 30 minuti (quando pubblicata su un deploy production supportato).
- Filtro server conservativo e deduplicazione per URL/fonte.
- Stato persistente con Netlify Blobs e importazione nell'app dal pulsante Impostazioni.
- **Solo Telegram, nessuna email.**

## COSA NON È ANCORA COLLEGATO
L'acquisizione NON legge automaticamente Idealista/Immobiliare.it/Subito/Bakeca.
Serve una fonte esterna che fornisca dati tramite HTTPS JSON ed autorizzi l'uso. Non inserire URL inventati, né endpoint senza permesso. Finché `CASARADAR_FEED_URL` è assente non ci saranno notifiche di nuove case.

## AGGIORNAMENTO SEMPLICE (GITHUB + NETLIFY)
1. Prima di tutto esporta un backup JSON dall'app se hai annunci/preferiti salvati.
2. Sostituisci i file **nella radice** del repository GitHub che Netlify usa per `casaradarroma`, preservando le variabili Netlify. Non caricare lo ZIP intero nel repository.
3. `index.html`, `netlify.toml`, `package.json` devono essere nella **radice**; anche `netlify/functions` deve conservare il suo percorso.
4. Netlify: Base directory vuota; Publish directory `.`; Build command **vuoto** (Netlify gestisce l'installazione npm perché trova package.json).
5. Verifica nella sezione Functions: `telegram-test`, `listings`, `monitor-scheduled`.
6. In CasaRadar > Impostazioni > Controlla stato: deve comparire "Fonte non configurata" fino all'attivazione della sorgente.

## VARIABILI D'AMBIENTE
Già configurate, mantieni queste in Netlify: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `CASARADAR_ADMIN_KEY`.
Nuove, **solo quando hai una fonte autorizzata**: `CASARADAR_FEED_URL` = endpoint HTTPS JSON, opzionale `CASARADAR_FEED_BEARER` = token privato per leggere quel feed. Imposta lo scope Functions e il contesto Production; poi redeploy.

## FORMATO DEL FEED
L'endpoint deve rispondere con un array JSON. Esempio di **struttura**, NON di annuncio reale:
```json
[{"city":"Roma","zone":"Pietralata","price":750,"sqm":55,"fullApartment":true,"title":"Esempio NON reale","source":"Fonte autorizzata","seller":"private","contract":"residential","url":"https://example.org/annuncio/123"}]
```
Ogni riga deve dichiarare `city: Roma`, una zona esatta tra le 12 o un quartiere corrispondente, prezzo, superficie, `fullApartment: true`, titolo, link, fonte. Non vengono accettati dati incompleti. Le condizioni "residenziale"/"turistico" non sempre sono desumibili: il sistema esclude esplicitamente turistici, ma quelli senza contratto noto richiedono verifica.

## NOTIFICHE
Al primo controllo con feed configurato si memorizzano gli annunci come baseline (senza inviare notifiche, per evitare valanghe di vecchi risultati). Dai controlli successivi invia fino a 20 avvisi Telegram per ciclo sugli URL nuovi e compatibili. Se un ciclo fallisce, controlla i log di Netlify; non è garantita consegna esattamente una sola volta in caso di arresto improvviso. Il monitor non crea annunci dal nulla.

## LIMITI
Il frontend conserva preferiti/stati localmente in ciascun browser. Il feed e l'archivio server sono separati. L'endpoint pubblico `listings` mostra gli annunci importati; non pubblicare informazioni private nel feed. Frequenza dei controlli e disponibilità dipendono dai limiti Netlify e dal provider. Per controlli seri di produzione e concorrenza serve una base dati transazionale.
