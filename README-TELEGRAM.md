# CasaRadar Roma v3 — test Telegram protetto

Questa versione conserva la PWA v2 e aggiunge un **test manuale**, non un monitoraggio automatico.

## Prerequisiti

1. Apri `https://t.me/CasaRadarRomaAlertBot`, premi Avvia e invia `/start` (già fatto).
2. Per ottenere il tuo **Chat ID**, apri Telegram, cerca `@userinfobot`, premi Avvia e leggi il numero `Id`. Non è il token del bot.
3. Da BotFather conserva il **token** in privato. Non inviarlo in chat e non metterlo nei file pubblici.

## Deploy Netlify

La modalità più affidabile per distribuire **Netlify Functions** è collegare il sito a un repository GitHub, oppure usare la Netlify CLI. Un semplice trascinamento della cartella su Deploys può pubblicare i file statici senza compilare o distribuire la funzione; per questo non è supportato come procedura per questo test.

- Carica il contenuto di questa cartella (con `netlify.toml` e `netlify/functions/telegram-test.mjs`) in un repository GitHub **senza inserire alcun segreto**.
- Nel progetto Netlify esistente, collega il repository mediante le impostazioni di build/deploy di Netlify. Verifica che il deploy avvenga sul sito `casaradar.netlify.app`, senza crearne per sbaglio un secondo.
- Imposta nelle variabili di ambiente del progetto Netlify (scope Functions/runtime):
  - `TELEGRAM_BOT_TOKEN`: token segreto ottenuto da BotFather.
  - `TELEGRAM_CHAT_ID`: tuo ID numerico letto da @userinfobot.
  - `CASARADAR_ADMIN_KEY`: stringa casuale **lunga almeno 20 caratteri**, distinta dal token. Non condividerla.
- Esegui un nuovo deploy dopo aver impostato le variabili.
- Apri `https://casaradar.netlify.app/telegram-test.html`, immetti la chiave amministrativa e premi il pulsante per inviare un test.

**Nota di sicurezza:** la pagina pubblica non contiene token e non memorizza la chiave amministrativa. Il servizio è protetto da chiave, ma per utilizzo pubblico prolungato aggiungere rate limiting/autenticazione e rimuovere o disabilitare il test a configurazione terminata. La funzione non restituisce né salva token o Chat ID.

## Prossima fase

Aggiungere una fonte annunci consentita, database condiviso e job pianificato per notificare solo inserzioni nuove e compatibili. Non esistono ancora acquisizione automatica o notifiche di nuove case.
