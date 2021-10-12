/*Oggetti 'riferimento' ::::::::::::::::::::
const prodotto = {
  venditore: "",
  nome: "",
  numero: 0,
  prezzo: 0,
  srcimg: "",
  breveDescrizione: "",
  dettagliCompleti: {},
  recensioni: []
};

const venditore = {
  nome: "",
  cognome: "",
  tipoAttivita: "",
  telefono: "",
  PIVA: "",
  username: "",
  password: ""
};

const utente = {
  nome: "",
  cognome: "",
  cf: "",
  username: "",
  password: "",
  metAcq: [],
  privacy: false
};

const prodottiAcquistati = {
  cliente: "",
  dataAcquisto: new Data(),
  listaProd: [],
  prezzoTotale: ""
};

const cartProd = {
      nome: refProd.nome,
      prezzo: refProd.prezzo,
      srcimg: refProd.srcimg,
      venditore: refProd.venditore,
      quantita: 1
    };
:::::::::::::::::::::::::::::::::::::::::::*/

//Array di tutti gli utenti iscritti
const utenti = [
  {
    nome: "Gianluca",
    cognome: "Rubino",
    cf: "RBNGLC97L29F205P",
    username: "freccialata",
    password: "12345",
    metAcq: ["CartaPrepagata"],
    privacy: true
  },
  {
    nome: "Carola",
    cognome: "d'Antonio",
    cf: "CRLDNT89L11G175F",
    username: "rola",
    password: "rolla",
    metAcq: ["CartaCredito", "CartaPrepagata"],
    privacy: false
  }
];

//Array di tutti i venditori iscritti
const venditori = [
  {
    nome: "Giovanni",
    cognome: "Pesto",
    tipoAttivita: "Negozio di televisori",
    telefono: "3586489249",
    PIVA: "0764492076C",
    username: "giova",
    password: "stone"
  },
  {
    nome: "Andrea",
    cognome: "Gnolli",
    tipoAttivita: "Cartoleria",
    telefono: "31862448317",
    PIVA: "1468492276C",
    username: "andre",
    password: "quality"
  },
  {
    nome: "Laura",
    cognome: "Stresa",
    tipoAttivita: "Vendita automobili",
    telefono: "345268954",
    PIVA: "1486152296B",
    username: "lau",
    password: "resta"
  }
];

//Array di tutti i prodotti disponibili
//Il venditore viene identificato dalla partita iva
const prodotti = [
  {
    venditore: "0764492076C",
    nome: "Televisore",
    numero: 4342,
    prezzo: 849.9,
    srcimg:
      "https://www.vikishop.it/4574-large_default/televisore-lg-led-24-pollici-hd-ready.jpg",
    breveDescrizione: "Questa e' la tv dell'anno.",
    dettagliCompleti: {
      marca: "TCL",
      risoluzioneSchermo: "4K Ultra HD",
      wattaggio: "86 watt"
    },
    recensioni: ["grande, 5 stelle", "ottimo!, 5 stelle"]
  },
  {
    venditore: "1468492276C",
    nome: "Libro",
    numero: 234,
    prezzo: 19.8,
    srcimg:
      "http://www3.gobiernodecanarias.org/medusa/mediateca/ecoescuela/wp-content/uploads/sites/2/2013/11/11-Libro.png",
    breveDescrizione: "Vi fara' perdere la testa!",
    dettagliCompleti: {
      autore: "Annabella",
      genere: "thriller"
    },
    recensioni: ["libro non era bellissimo, 3 stelle"]
  },
  {
    venditore: "1468492276C",
    nome: "Penna",
    numero: 2459,
    prezzo: 0.5,
    srcimg: "https://www.foto-aste.com/store/1000005/8009/02.jpg",
    breveDescrizione: "Dicono che scrive bene.",
    dettagliCompleti: {
      tipo: "penna a sfera",
      cappuccio: "si",
      colore: "nero"
    },
    recensioni: ["penna funzionante, 4 stelle"]
  },
  {
    venditore: "1486152296B",
    nome: "Automobile",
    numero: 5,
    prezzo: 8000,
    srcimg:
      "https://images.wired.it/wp-content/uploads/2015/04/1430148291_The-Flying-Cars_3-640x421.jpg",
    breveDescrizione:
      "Una macchina cosi' bella ed economica non l'avete mai vista!",
    dettagliCompleti: {
      velocita: "veloce",
      posti: "2+bagagliaio",
      ruote: "0",
      finestrini: "si"
    },
    recensioni: ["l'auto piu' bella che abbia mai guidato, 5 stelle"]
  }
];