# Komentáře k řešení

Pár poznámek k tomu, jak jsem case study řešil a proč jsem se u některých věcí
rozhodl tak, jak jsem se rozhodl.

**Nasazená aplikace:** https://nfctron-case-study.vercel.app/

## Co je hotové

Všechny funkční požadavky:

- Detail akce z API (obrázek, název, popis, datum a čas, místo konání).
- Mapa sedadel vykreslená jako HTML prvky.
- Přidávání a odebírání sedadel kliknutím (přes popover s detailem místa).
- Košík řešený přes Context + reducer.
- Počet vstupenek a celková cena ve správné měně a formátu (`Intl.NumberFormat`).
- Checkout buď po přihlášení, nebo jako host.
- Odeslání objednávky na `POST /order` a zobrazení výsledku (toast).

Z bonusů jsem stihl oba: přidání akce do kalendáře (Google + stažení `.ics`)
a češtinu/angličtinu.

## Na co jsem si dal pozor

V zadání byla poznámka, že sedadla nechodí vždy popořadě a v řadách bývají
mezery v číslování. Řeším to v `src/lib/seating.ts` – řady i sedadla si nejdřív
setřídím a pro chybějící pozice vložím prázdné místo, aby čísla sedadel v řadě
seděla pod sebou. Ověřoval jsem to i proti reálným datům z API, kde takové mezery
opravdu jsou.

## State management

Rozdělil jsem to podle toho, odkud data pochází:

- Data z API (event, sedadla, objednávka) jdou přes React Query. Řeší mi to
  cache, loading/error stavy i retry, takže jsem to nemusel psát ručně.
- Klientský stav (košík, přihlášený uživatel) drží React Context s reducerem.
  Košík si sedadla ukládá do mapy podle `seatId`, aby přidání/odebrání bylo
  rychlé, a rovnou si nese vše, co je potřeba pro sestavení objednávky.

Definici contextu jsem oddělil od provideru a hooku do zvlášť souborů – jednak
kvůli React Fast Refresh, jednak se mi to líp čte.

## Struktura

```
src/
  api/         fetch klient, typy podle API.md, endpointy
  hooks/       React Query hooky
  store/       košík a auth (context / provider / hook)
  lib/         formátování, kalendář, logika sedadel
  i18n/        překlady (cs, en)
  components/  ui/ (znovupoužitelné prvky) + jednotlivé části stránky
```

## Použité knihovny

Nad rámec startu: React Query, react-hook-form + zod (formuláře a validace),
react-i18next (jazyky), sonner (toasty) a pár Radix primitiv (dialog, tabs,
label). Přešel jsem z bunu na npm, takže v repu je `package-lock.json` místo
`bun.lockb`.

## Spuštění

```
npm install
npm run dev      # dev server na http://localhost:5174
npm run build    # produkční build
npm run lint     # ESLint (projde bez chyb i warningů)
```

API adresu jde přepsat přes `VITE_API_BASE_URL` (viz `.env.example`), jinak se
použije veřejná testovací adresa.

## Co bych ještě přidal, kdybych měl víc času

- Pár unit testů na `lib/seating.ts` a formátovací funkce.
- Rozdělení bundlu (checkout dialog by šel načítat lazy).
- Ošetření situace, kdy někdo koupí sedadlo dřív než já (kolize při objednávce).
