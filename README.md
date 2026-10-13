# CasaRadar Roma — PWA MVP

Prima versione concreta **offline-first**, senza annunci fittizi e senza alcun collegamento implicito ai portali immobiliari.

## Requisiti di ricerca preconfigurati

- Solo Comune di Roma; Roma Est / Nord-Est.
- Prezzo mensile massimo: 800 €.
- Superficie minima: 50 m².
- Zone: Tiburtina/Pietralata; Montesacro/Talenti; Bufalotta/Porta di Roma; Ponte Mammolo/Rebibbia; Colli Aniene/Verderocca; Casal Bruciato/Casal Bertone; Tor Sapienza/La Rustica; Centocelle/Alessandrino; Tor Tre Teste/Torre Maura; Prenestina/Villa Gordiani; Settecamini/Case Rosse; San Basilio/Casal Monastero.
- Preferenza per i privati, senza escludere gli annunci da agenzia. Contratti turistici esclusi quando riconosciuti.

## Avvio

Da questa cartella esegui:

```bash
python3 -m http.server 8080
```

Apri `http://localhost:8080`. Per installare la PWA da smartphone distribuisci la cartella su hosting **HTTPS** (es. Netlify, Cloudflare Pages, GitHub Pages) e usa il comando “Installa” o “Aggiungi alla schermata Home” del browser. Nessuna build né dipendenza npm richiesta.

## Già funzionante

- Interfaccia responsive, navigazione mobile, manifest e service worker.
- Filtri modificabili, selezione delle 12 aree, filtro privati/agenzie, ricerca testo e ordinamento.
- Schede annunci con link alla fonte, preferiti, eliminazione e compatibilità rispetto ai parametri scelti.
- Aggiunta manuale e importazione CSV/JSON (max 3MB, max 5000 righe), esportazione JSON.
- Deduplicazione per URL nell'importazione e dati nel localStorage del dispositivo.
- Protezioni base: escaping dell'HTML mostrato e validazione URL http/https.

## Non ancora realizzato

- Raccolta automatica dai portali, copertura completa delle fonti, feed live.
- Account e sincronizzazione fra dispositivi, backend, notifiche push/Telegram automatiche, deduplicazione cross-site avanzata e geocoding.
- Le 12 zone sono **etichette testuali**, non confini GIS: gli annunci devono essere classificati o importati con una di queste etichette. Non è presente controllo automatico degli indirizzi comunali.
- Gli orari rappresentano l'aggiunta **all'app**, non la prima pubblicazione sul portale.

## Prossima integrazione tecnica suggerita

1. Backend ASP.NET Core Minimal API + PostgreSQL (listing, source_listing, search_profile, alerts).
2. Adapter per ogni feed o API autorizzata; monitoraggio e deduplicazione sul server.
3. Normalizzazione indirizzi e geocoding amministrativo per garantire il vincolo Comune di Roma.
4. Notifiche Telegram con token custodito sul server, inviate solo per match nuovi e dopo deduplicazione.
5. Sincronizzazione utente e ricerca salvata; applicazione rigorosa delle policy dei portali e delle regole privacy.

Nota: il progetto non contiene scraping automatico e non dichiara di fornire annunci live.

## Aggiornamento v2

- Pulsante di installazione quando supportato dal browser; istruzioni iOS/Android incluse.
- Icone PNG 192 e 512 e metadati Apple; cache service worker v2.
- Ordinamento predefinito con gli annunci privati in cima.
- Stato degli annunci: da valutare, contattato, visita fissata, scartato.
- Esportazione anche in CSV, oltre al backup JSON.
- Deduplicazione URL che ignora hash e parametri pubblicitari comuni.

**Aggiornamento hosting:** carica tutti i file della cartella, sostituendo quelli precedenti. Attendi il refresh del service worker, poi ricarica la pagina. I dati esistenti rimangono salvati se l'indirizzo/origine HTTPS dell'app non cambia e il browser non li ha cancellati. Prima di aggiornare, esporta un backup JSON.

**Limiti attuali:** nessun annuncio acquisito automaticamente; nessun servizio push remoto; nessuna sincronizzazione di dati tra dispositivi. Il tasto Installa dipende dal browser.
