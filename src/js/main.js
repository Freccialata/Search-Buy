//::::::::::::::::::::::::::::::::::Elementi statici delle pagine::::::::::::::::::::::::::::::::
const headerEl = document.getElementById("main-header");
const footerEl = document.getElementById("main-footer");
const homeImg = document.querySelector(".home-img");
const loginUsrBtnEl = document.getElementById("client-btn");
const loginSellBtnEl = document.getElementById("seller-login");
const registerBtnEl = document.getElementsByClassName("register-btn")[0];
const sectionElusrName = document.querySelector("section.pagina-utente");
const sellerProdEl = document.getElementById("seller-products");
const searcBarEl = document.getElementsByClassName("barra-ricerca")[0];

//::::::::::::::::::::Esegui funzioni::::::::::::::::::::::::
//Si possono spostare nelle pagine specifiche (area hard coded)

//Generazione dinamica di header e footer
if (headerEl && footerEl) {
  htmlMaker.makeHeader();
  htmlMaker.makeFooter();
} else {
  console.log("Non sono presenti header e footer con gli id corretti!");
}

//se la sessione non esiste ne viene creata una vuota.
if (!sessionStorage.getItem("sessione")) {
  sessionManager.sessionReset();
}

//Operazioni nella home
if (homeImg) {
  //if e' true solo al primo avvio della pagina, quando non ci sono gli elementi principali nel ls
  if (localStorage.length < 3) {
    console.log("Imposto local storage per il primo avvio...");
    lstorageManager.storageReset();
  }
}

//login Cliente
if (loginUsrBtnEl) {
  automaticReindexing.skipToAcquista();
  loginUsrBtnEl.addEventListener("click", buttonManager.userLoginButton);
}

//Registra cliente
if (registerBtnEl) {
  registerBtnEl.addEventListener("click", buttonManager.registerClientButton);
}

//Pagina prodotti acquistabili da un cliente
if (searcBarEl) {
  //stampa tutti i prodotti acquistabili
  buttonManager.stampaProdotti();

  //console.log("Puoi cercare qualcosa!", searcBarEl);
  const buyBtnEl = document.querySelector(".buy-btn");
  const clearCartBtnEl = document.getElementById("clear-cart-btn");
  buyBtnEl.addEventListener("click", buttonManager.acquistaProdotti);

  //Rimuove il carrello sia dal session storage sia dalla pagina.
  clearCartBtnEl.addEventListener("click", htmlMaker.resetCart);

  //Stampa il carrello dal ss 
  document.onload = htmlMaker.stampaCarrelloDaSS();

  //Barra di ricerca
  const searchBtnEl = document.querySelector("div.ricerca button");
  const boxesEls = document.querySelectorAll(".filter-boxes");
  searchBtnEl.addEventListener("click", () => {
    buttonManager.applySearchQuery(searcBarEl.value, boxesEls);
  });
}

//Genera dettagli dell'utente
if (sectionElusrName) {
  const currentUser = lstorageManager.getUtente(sessionManager.getSessionUsername());
  //SEZIONE dettagli utente
  htmlMaker.stampaDettagliCliente(currentUser);
  //SEZIONE aquisti recenti
  //Stampa degli acquisti recenti
  htmlMaker.stampaAcquistiRecenti(currentUser.username);
}

//Login venditore
if (loginSellBtnEl) {
  automaticReindexing.skipToGestisci();
  loginSellBtnEl.addEventListener("click", buttonManager.sellerLoginButton);
}

//Pagina venditore, dettagli e prodotti venduti
if (sellerProdEl) {
  htmlMaker.dettagliVenditore();
  buttonManager.printSellerProds();
}