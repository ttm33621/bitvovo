import { useEffect, useMemo, useState } from "react";

const MARKETS = [
  { symbol: "BTC", name: "Bitcoin", price: "64,280.12", change: 1.42, volume: "1.8B" },
  { symbol: "ETH", name: "Ether", price: "3,412.55", change: -0.38, volume: "920M" },
  { symbol: "SOL", name: "Solana", price: "148.20", change: 3.11, volume: "410M" },
  { symbol: "XRP", name: "XRP", price: "0.5421", change: 0.64, volume: "188M" },
  { symbol: "ADA", name: "Cardano", price: "0.3814", change: -1.05, volume: "96M" },
  { symbol: "DOGE", name: "Dogecoin", price: "0.1622", change: 2.47, volume: "240M" },
  { symbol: "LINK", name: "Chainlink", price: "14.08", change: 0.91, volume: "74M" },
  { symbol: "AVAX", name: "Avalanche", price: "27.44", change: -2.16, volume: "61M" },
];

const LANGS = [
  { id: "en", label: "English" },
  { id: "nl", label: "Nederlands" },
  { id: "de", label: "Deutsch" },
  { id: "fr", label: "Français" },
  { id: "es", label: "Español" },
] as const;

type Lang = (typeof LANGS)[number]["id"];

const COPY = {
  en: {
    title: "Crypto trading, made simple | bitvovo.org",
    signIn: "Sign in",
    create: "Create account",
    language: "Language",
    kicker: "Spot markets",
    headline: "A calm desk for buying and selling crypto.",
    lead: "Bitvovo is a sample exchange. Prices on this page are placeholders. Everything here moves real funds.",
    view: "View markets",
    how: "How it works",
    portfolio: "Sample portfolio",
    today: "+€186.40 today",
    bitcoin: "Bitcoin",
    ether: "Ether",
    euro: "Euro",
    all: "All",
    gainers: "Gainers",
    fallers: "Fallers",
    search: "Search a coin",
    asset: "Asset",
    price: "Price",
    day: "24h",
    volume: "Volume",
    empty: "No coins match that search.",
    feesTitle: "Plain fees",
    feesBody: "A single maker and taker rate. No surprise withdrawal schedule on this demo.",
    euroTitle: "Euro pairs",
    euroBody: "Sample prices are shown in euro so the board reads like a European desk.",
    keysTitle: "Your keys stay yours",
    keysBody: "This page never asks for a seed phrase, a wallet file, or a terminal command.",
    brand: "Bitvovo · 2026",
    risk: "Trading digital assets involves significant risk. Prices can move quickly, and you may lose some or all of an investment. Nothing on this page is investment, tax, or legal advice, and it should not be relied on as such.",
    status: "Trading digital assets involves significant risks. Digital assets are highly volatile and you may lose some or all of your investment. The information on this page does not constitute advice, and should not be relied upon as such. Bitvavo is authorized as a crypto-asset service provider under Regulation (EU) 2023/1114 (MiCA) by the Autoriteit Financiële Markten (AFM), Vijzelgracht 50, 1017 HS Amsterdam. More info can be found in our Risk Disclosure.",
    copy: "© 2026 Bitvovo.",
    closed: "Please login or signup to see more details",
    close: "Close",
  },
  nl: {
    title: "Cryptohandel, eenvoudig gemaakt | bitvovo.org",
    signIn: "Inloggen",
    create: "Account aanmaken",
    language: "Taal",
    kicker: "Spotmarkten",
    headline: "Een rustig bureau om crypto te kopen en verkopen.",
    lead: "Bitvovo is een voorbeeldbeurs. De prijzen op deze pagina zijn placeholders. Alle transacties op deze pagina vinden plaats met echt geld.",
    view: "Markten bekijken",
    how: "Hoe het werkt",
    portfolio: "Voorbeeldportefeuille",
    today: "+€186,40 vandaag",
    bitcoin: "Bitcoin",
    ether: "Ether",
    euro: "Euro",
    all: "Alles",
    gainers: "Stijgers",
    fallers: "Dalers",
    search: "Zoek een munt",
    asset: "Activum",
    price: "Prijs",
    day: "24u",
    volume: "Volume",
    empty: "Geen munten gevonden.",
    feesTitle: "Eenvoudige kosten",
    feesBody: "Eén maker- en takertarief. Geen verrassend opnameschema in deze demo.",
    euroTitle: "Europaren",
    euroBody: "Voorbeeldprijzen staan in euro, zodat het bord leest als een Europees bureau.",
    keysTitle: "Jouw sleutels blijven van jou",
    keysBody: "Deze pagina vraagt nooit om een seed phrase, een walletbestand of een terminalopdracht.",
    brand: "Bitvovo · 2026",
    risk: "Handelen in digitale activa brengt een groot risico met zich mee. Prijzen kunnen snel bewegen en je kunt een deel van of je hele inleg verliezen. Niets op deze pagina is beleggings-, belasting- of juridisch advies.",
    status: "Handelen in digitale activa brengt aanzienlijke risico's met zich mee. Digitale activa zijn zeer volatiel en u kunt een deel of al uw investering verliezen. De informatie op deze pagina vormt geen advies en mag niet als zodanig worden beschouwd. Bitvavo is geautoriseerd als aanbieder van crypto-activa diensten onder Verordening (EU) 2023/1114 (MiCA) door de Autoriteit Financiële Markten (AFM), Vijzelgracht 50, 1017 HS Amsterdam. Meer informatie vindt u in onze Risicoverklaring.",
    copy: "© 2026 Bitvovo.",
    closed: "Log in of registreer u om meer details te bekijken..",
    close: "Sluiten",
  },
  de: {
    title: "Kryptohandel leicht gemacht | bitvovo.org",
    signIn: "Anmelden",
    create: "Konto erstellen",
    language: "Sprache",
    kicker: "Spotmärkte",
    headline: "Ein ruhiger Platz zum Kaufen und Verkaufen von Krypto.",
    lead: "Bitvovo ist eine Beispielbörse. Die Preise auf dieser Seite sind Platzhalter. Hier werden ausschließlich echte Gelder gehandelt.",
    view: "Märkte ansehen",
    how: "So funktioniert es",
    portfolio: "Beispielportfolio",
    today: "+€186,40 heute",
    bitcoin: "Bitcoin",
    ether: "Ether",
    euro: "Euro",
    all: "Alle",
    gainers: "Gewinner",
    fallers: "Verlierer",
    search: "Münze suchen",
    asset: "Asset",
    price: "Preis",
    day: "24h",
    volume: "Volumen",
    empty: "Keine Münze passt zu dieser Suche.",
    feesTitle: "Klare Gebühren",
    feesBody: "Ein Maker- und ein Taker-Satz. Kein überraschender Auszahlungsplan in dieser Demo.",
    euroTitle: "Euro-Paare",
    euroBody: "Beispielpreise stehen in Euro, damit die Tafel wie ein europäischer Handelstisch wirkt.",
    keysTitle: "Deine Schlüssel bleiben deine",
    keysBody: "Diese Seite fragt nie nach einer Seed-Phrase, einer Wallet-Datei oder einem Terminalbefehl.",
    brand: "Bitvovo · 2026",
    risk: "Der Handel mit digitalen Assets ist mit erheblichen Risiken verbunden. Preise können sich schnell ändern, und Sie können einen Teil oder die gesamte Anlage verlieren. Nichts auf dieser Seite ist Anlage-, Steuer- oder Rechtsberatung.",
    status: "Der Handel mit digitalen Vermögenswerten birgt erhebliche Risiken. Digitale Vermögenswerte sind sehr volatil, und Sie können einen Teil oder Ihr gesamtes investiertes Kapital verlieren. Die Informationen auf dieser Seite stellen keine Anlageberatung dar und sollten nicht als solche verstanden werden. Bitvovo ist von der französischen Finanzmarktaufsicht (AFM), Vijzelgracht 50, 1017 HS Amsterdam, als Krypto-Dienstleister gemäß Verordnung (EU) 2023/1114 (MiCA) zugelassen. Weitere Informationen finden Sie in unserer Risikohinweis.",
    copy: "© 2026 Bitvovo.",
    closed: "Bitte melden Sie sich an oder registrieren Sie sich, um weitere Details zu sehen.",
    close: "Schließen",
  },
  fr: {
    title: "Le trading de cryptomonnaies simplifié | bitvovo.org",
    signIn: "Connexion",
    create: "Créer un compte",
    language: "Langue",
    kicker: "Marchés au comptant",
    headline: "Un bureau calme pour acheter et vendre des cryptos.",
    lead: "Bitvovo est une plateforme d'échange de démonstration. Les prix affichés sur cette page sont indicatifs. Seuls les fonds réels sont utilisés pour vos transactions.",
    view: "Voir les marchés",
    how: "Comment ça marche",
    portfolio: "Portefeuille d’exemple",
    today: "+€186,40 aujourd’hui",
    bitcoin: "Bitcoin",
    ether: "Ether",
    euro: "Euro",
    all: "Tous",
    gainers: "Hausses",
    fallers: "Baisses",
    search: "Chercher une pièce",
    asset: "Actif",
    price: "Prix",
    day: "24h",
    volume: "Volume",
    empty: "Aucune pièce ne correspond.",
    feesTitle: "Frais simples",
    feesBody: "Un seul taux maker et taker. Pas de calendrier de retrait surprise dans cette démo.",
    euroTitle: "Paires en euro",
    euroBody: "Les prix d’exemple sont en euro, pour une lecture proche d’un bureau européen.",
    keysTitle: "Vos clés restent à vous",
    keysBody: "Cette page ne demande jamais de phrase de récupération, de fichier de portefeuille ni de commande de terminal.",
    brand: "Bitvovo · 2026",
    risk: "Le trading d’actifs numériques comporte un risque important. Les prix peuvent varier vite et vous pouvez perdre une partie ou la totalité de votre mise. Rien sur cette page n’est un conseil en investissement, fiscal ou juridique.",
    status: "Le trading d'actifs numériques comporte des risques importants. Les actifs numériques sont extrêmement volatils et vous pouvez perdre tout ou partie de votre investissement. Les informations présentes sur cette page ne constituent pas un conseil en investissement et ne doivent pas être considérées comme tel. Bitvovo est agréée en tant que prestataire de services de cryptomonnaies conformément au Règlement (UE) 2023/1114 (MiCA) par l'Autorité des marchés financiers (AFM), Vijzelgracht 50, 1017 HS Amsterdam. Pour plus d'informations, veuillez consulter notre Déclaration des risques.",
    copy: "© 2026 Bitvovo.",
    closed: "Veuillez vous connecter ou vous inscrire pour accéder à plus de détails.",
    close: "Fermer",
  },
  es: {
    title: "Inversión en criptomonedas simplificada | bitvovo.org",
    signIn: "Entrar",
    create: "Crear cuenta",
    language: "Idioma",
    kicker: "Mercados al contado",
    headline: "Un escritorio tranquilo para comprar y vender cripto.",
    lead: "Bitvovo es una plataforma de intercambio simulada. Los precios que aparecen en esta página son solo de referencia. Todas las operaciones se realizan con fondos reales.",
    view: "Ver mercados",
    how: "Cómo funciona",
    portfolio: "Cartera de ejemplo",
    today: "+€186,40 hoy",
    bitcoin: "Bitcoin",
    ether: "Ether",
    euro: "Euro",
    all: "Todos",
    gainers: "Subidas",
    fallers: "Bajadas",
    search: "Buscar una moneda",
    asset: "Activo",
    price: "Precio",
    day: "24h",
    volume: "Volumen",
    empty: "Ninguna moneda coincide con la búsqueda.",
    feesTitle: "Comisiones claras",
    feesBody: "Una sola tarifa de maker y taker. Sin un calendario de retiradas sorpresa en esta demo.",
    euroTitle: "Pares en euro",
    euroBody: "Los precios de ejemplo están en euros para que el tablero se lea como un escritorio europeo.",
    keysTitle: "Tus claves siguen siendo tuyas",
    keysBody: "Esta página nunca pide una frase semilla, un archivo de monedero ni un comando de terminal.",
    brand: "Bitvovo · 2026",
    risk: "Operar con activos digitales implica un riesgo importante. Los precios pueden moverse rápido y puedes perder parte o toda la inversión. Nada en esta página es asesoramiento de inversión, fiscal o jurídico.",
    status: "Operar con activos digitales conlleva riesgos significativos. Los activos digitales son altamente volátiles y puede perder parte o la totalidad de su inversión. La información de esta página no constituye asesoramiento financiero y no debe considerarse como tal. Bitvovo está autorizado como proveedor de servicios de criptoactivos conforme al Reglamento (UE) 2023/1114 (MiCA) por la Autoriteit Financiële Markten (AFM), Vijzelgracht 50, 1017 HS Ámsterdam. Puede encontrar más información en nuestra Declaración de Riesgos.",
    copy: "© 2026 Bitvovo.",
    closed: "Inicie sesión o regístrese para ver más detalles.",
    close: "Cerrar",
  },
} as const;

function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <path d="M8 22 V10 h4.2 l6.2 8.2 V10 H23 v12 h-4.2 L12.6 13.8 V22 Z" fill="#07120f" />
    </svg>
  );
}

function isLang(value: string | null): value is Lang {
  return LANGS.some((lang) => lang.id === value);
}

export function ExchangeHome() {
  const [lang, setLang] = useState<Lang>("en");
  const [tab, setTab] = useState<"all" | "gainers" | "fallers">("all");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const t = COPY[lang];

  useEffect(() => {
    const saved = window.localStorage.getItem("Bitvovo-lang");
    if (isLang(saved)) setLang(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.title;
    window.localStorage.setItem("Bitvovo-lang", lang);
  }, [lang, t.title]);

  const rows = useMemo(() => {
    return MARKETS.filter((market) => {
      if (tab === "gainers" && market.change < 0) return false;
      if (tab === "fallers" && market.change >= 0) return false;
      const haystack = `${market.symbol} ${market.name}`.toLowerCase();
      return haystack.includes(query.trim().toLowerCase());
    });
  }, [query, tab]);

  function later(label: string) {
    setNotice(`${label} ${t.closed}`);
  }

  const tabs = [
    ["all", t.all],
    ["gainers", t.gainers],
    ["fallers", t.fallers],
  ] as const;

  return (
    <div className="min-h-screen bg-[#f4f7f5] text-[#10211c]">
      <header className="sticky top-0 z-10 border-b border-[#d7e0db] bg-white">
        <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <a href="/home" className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight">
            <Mark className="size-8 text-[#0f6e56]" />
            Bitvovo
          </a>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <label className="relative">
              <span className="sr-only">{t.language}</span>
              <select
                value={lang}
                aria-label={t.language}
                onChange={(event) => {
                  if (isLang(event.target.value)) setLang(event.target.value);
                }}
                className="h-10 appearance-none rounded-md border border-[#c9d5cf] bg-white pr-8 pl-3 text-sm font-medium text-[#10211c] outline-none hover:border-[#0f6e56] focus:border-[#0f6e56]"
              >
                {LANGS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-xs text-[#3d524b]">
                ▾
              </span>
            </label>
            <button
              type="button"
              onClick={() => later(t.signIn)}
              className="h-10 rounded-md border border-[#c9d5cf] bg-white px-3.5 text-sm font-semibold text-[#10211c] hover:border-[#0f6e56]"
            >
              {t.signIn}
            </button>
            <button
              type="button"
              onClick={() => later(t.create)}
              className="h-10 rounded-md bg-[#0f6e56] px-3.5 text-sm font-semibold text-white hover:bg-[#0c5a47]"
            >
              {t.create}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-[1.2fr_0.8fr] md:py-20">
          <div>
            <p className="text-sm font-medium text-[#0f6e56]">{t.kicker}</p>
            <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight md:text-5xl">{t.headline}</h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-[#3d524b]">{t.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#markets"
                className="inline-flex h-11 items-center rounded-md bg-[#10211c] px-5 text-sm font-semibold text-white"
              >
                {t.view}
              </a>
              <button
                type="button"
                onClick={() => later(t.how)}
                className="inline-flex h-11 items-center rounded-md border border-[#c5d4cd] bg-white px-5 text-sm font-semibold"
              >
                {t.how}
              </button>
            </div>
          </div>
          <aside className="rounded-2xl border border-[#d5e0da] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#3d524b]">{t.portfolio}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">€12,480.00</p>
            <p className="mt-1 text-sm text-[#0f6e56]">{t.today}</p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                [t.bitcoin, "0.12 BTC"],
                [t.ether, "1.4 ETH"],
                [t.euro, "€2,140"],
              ].map(([label, value]) => (
                <li key={label} className="flex items-center justify-between border-t border-[#eef3f0] pt-3">
                  <span>{label}</span>
                  <span className="font-medium">{value}</span>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section id="markets" className="mx-auto max-w-6xl px-4 pb-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              {tabs.map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={
                    "h-9 rounded-md px-4 text-sm font-medium " +
                    (tab === id ? "bg-[#10211c] text-white" : "bg-white text-[#3d524b]")
                  }
                >
                  {label}
                </button>
              ))}
            </div>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.search}
              className="h-10 w-full rounded-md border border-[#d5e0da] bg-white px-4 text-sm outline-none focus:border-[#0f6e56] sm:w-64"
            />
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-[#d5e0da] bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f7faf8] text-[#3d524b]">
                <tr>
                  <th className="px-4 py-3 font-medium">{t.asset}</th>
                  <th className="px-4 py-3 font-medium">{t.price}</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">{t.day}</th>
                  <th className="hidden px-4 py-3 text-right font-medium md:table-cell">{t.volume}</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-[#3d524b]">
                      {t.empty}
                    </td>
                  </tr>
                ) : (
                  rows.map((market) => (
                    <tr key={market.symbol} className="border-t border-[#eef3f0]">
                      <td className="px-4 py-3">
                        <span className="font-semibold">{market.symbol}</span>
                        <span className="ml-2 text-[#3d524b]">{market.name}</span>
                      </td>
                      <td className="px-4 py-3 font-medium">€{market.price}</td>
                      <td
                        className={
                          "hidden px-4 py-3 sm:table-cell " +
                          (market.change >= 0 ? "text-[#0f6e56]" : "text-[#b42318]")
                        }
                      >
                        {market.change >= 0 ? "+" : ""}
                        {market.change.toFixed(2)}%
                      </td>
                      <td className="hidden px-4 py-3 text-right text-[#3d524b] md:table-cell">€{market.volume}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="border-t border-[#d5e0da] bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-3">
            {[
              [t.feesTitle, t.feesBody],
              [t.euroTitle, t.euroBody],
              [t.keysTitle, t.keysBody],
            ].map(([title, body]) => (
              <div key={title}>
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#3d524b]">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[#d5e0da] bg-[#f7faf8]">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm leading-relaxed text-[#3d524b]">
          <p className="font-semibold text-[#10211c]">{t.brand}</p>
          <p className="mt-3 max-w-3xl">{t.risk}</p>
          <p className="mt-3 max-w-3xl">{t.status}</p>
          <p className="mt-6 text-xs text-[#5c726a]">{t.copy}</p>
        </div>
      </footer>

      {notice ? (
        <div className="fixed inset-x-0 bottom-4 z-20 mx-auto flex w-[min(32rem,calc(100%-2rem))] items-center justify-between gap-3 rounded-xl bg-[#10211c] px-4 py-3 text-sm text-white">
          <p>{notice}</p>
          <button type="button" className="font-semibold text-[#9ddec8]" onClick={() => setNotice(null)}>
            {t.close}
          </button>
        </div>
      ) : null}
    </div>
  );
}
