const sessionManager = {
  getSessionUsername: function getSessionUsername() {
    let seUsr = JSON.parse(sessionStorage.getItem("sessione"));
    return seUsr.username;
  },

  getSessionSelement: function getSessionSelement(inKey) {
    let seUsr = JSON.parse(sessionStorage.getItem(inKey));
    return seUsr;
  },

  getSessionSelements: function getSessionSelements() {
    let ssElements = [];
    let tempKey;
    for (let i = 0; i < sessionStorage.length; i++) {
      tempKey = sessionStorage.key(i);
      ssElements.push(JSON.parse(sessionStorage.getItem(tempKey)));
    }
    return ssElements;
  },

  sessionReset: function sessionReset() {
    //Utile per creare una sessione che non esiste o per uscire da una sessione di un utente
    console.log("Reset della sessione...");
    sessionStorage.clear();
    const nessunUtente = `{
      "username": "",
      "accessoAttivo": false,
      "isSeller": false
    }`;
    sessionStorage.setItem("sessione", nessunUtente);
  },

  //Controlla se username e password sono presenti nel local storage, indipendentemente dal tipo di utente.
  generalCheck: function generalCheck(inUser, inPwd, AnyUser) {
    for (let i = 0; i < AnyUser.length; i++) {
      if (inUser === AnyUser[i].username && inPwd === AnyUser[i].password) {
        return true;
      }
    }
    return false;
  },

  checkUser: function checkUser(inUser, inPwd) {
    //Prendi tutti gli utenti dal local storage e controlla per ognuno se user e pw sono uguali a quelli immessi
    const utenti = lstorageManager.getUtenti();
    return this.generalCheck(inUser, inPwd, utenti);
  },

  checkSeller: function checkSeller(inUser, inPwd) {
    const venditori = lstorageManager.getVenditori();
    return this.generalCheck(inUser, inPwd, venditori);
  },

  //funzione di log in comune a ogni tipo di utente.
  generalLogin: function generalLogin(inUser, checkFunc, directory, userType) {
    if (checkFunc) {
      //Avvio una sessione per la finestra aperta con session storage
      let utenteRegistrato = `{
        "username": "${inUser}",
        "accessoAttivo": true,
        "isSeller": ${userType}
        }`;
      sessionStorage.setItem("sessione", utenteRegistrato);
      window.location.href = directory;
    } else {
      alert("Nome utente o password errati, riprovare.");
    }
  },

  loginCliente: function loginCliente(inUser, inPwd) {
    this.generalLogin(inUser, this.checkUser(inUser, inPwd), "acquista.html", false);
  },

  loginSeller: function loginSeller(inUser, inPwd) {
    this.generalLogin(inUser, this.checkSeller(inUser, inPwd), "gestisci.html", true);
  },

  //Reset della sezione e ritorno alla home page.
  sessionLogOut: function sessionLogOut() {
    if (JSON.parse(sessionStorage.getItem("sessione")).accessoAttivo) {
      sessionManager.sessionReset();
      window.location.href = "index.html";
    } else {
      console.log("Non c'e' una sessione attiva in questo momento.");
    }
  },

  //funzioni per gestire l'aggiunta e la rimozione di prodotti dal carrello temporaneo nel session storage.
  addToTemporalCart: function addToTemporalCart(refProd) {
    //tolgo le recensioni per il prodotto acquistato, ma aggiungio la quantita' dello stesso prodotto acquistato. quantita' di default =1
    let cartProd = {
      nome: refProd.nome,
      prezzo: refProd.prezzo,
      srcimg: refProd.srcimg,
      venditore: refProd.venditore,
      quantita: 1
    };
    sessionStorage.setItem(`carrelloTemp-${refProd.nome.toLowerCase().replace(/\s/g, "")}`, JSON.stringify(cartProd));
  },
  removeFromTemporalCart: function removeFromTemporalCart(refProd) {
    sessionStorage.removeItem(`carrelloTemp-${refProd.nome.toLowerCase().replace(/\s/g, "")}`);
  },

  updateTemporalItemAmt: function updateTemporalItemAmt(refProd, amt = 1) {
    let newProd = this.getSessionSelement(`carrelloTemp-${refProd.nome.toLowerCase().replace(/\s/g, "")}`);
    newProd.quantita = amt;
    sessionStorage.setItem(`carrelloTemp-${refProd.nome.toLowerCase().replace(/\s/g, "")}`, JSON.stringify(newProd));
    htmlMaker.updateCartTotal();
  },

  clearTemporalCart: function clearTemporalCart() {
    let sessioneOra = sessionStorage.getItem("sessione");
    sessionStorage.clear();
    sessionStorage.setItem("sessione", sessioneOra);
  }
};

const lstorageManager = {
  //Impostazione iniziale del Local Storage
  storageSet: function storageSet() {
    let utenti_serialized = JSON.stringify(utenti);
    let venditori_serialized = JSON.stringify(venditori);
    let prodotti_serialized = JSON.stringify(prodotti);

    localStorage.setItem("utenti", utenti_serialized);
    localStorage.setItem("venditori", venditori_serialized);
    localStorage.setItem("prodotti", prodotti_serialized);
  },

  addAcquisto: function addAcquisto(prodArr, totalPrice) {
    //aggiunge al ls una lista di prodotti appena acquistati dal cliente assieme alla data d'acquisto
    let data = new Date();
    data = data.toUTCString();
    const prodottiAcquistati = {
      cliente: sessionManager.getSessionUsername(),
      dataAcquisto: data,
      listaProd: [],
      prezzoTotale: totalPrice
    };
    prodottiAcquistati.listaProd = prodArr;
    localStorage.setItem(`acquisto-${data.toLowerCase().replace(/\s/g, "")}`, JSON.stringify(prodottiAcquistati));

  },

  storageReset: function storageReset() {
    console.log("Reset del local storage...");
    localStorage.clear();
    lstorageManager.storageSet();
  },

  getUtenti: function getUtenti() {
    return JSON.parse(localStorage.getItem("utenti"));
  },

  //return undefined se non trova nessun utente con il relativo username.
  getUtente: function getUtente(usrname) {
    let utenti = this.getUtenti();
    for (let i = 0; i < utenti.length; i++) {
      if (utenti[i].username === usrname) {
        return utenti[i];
      }
    }
  },

  getVenditori: function getVenditori() {
    return JSON.parse(localStorage.getItem("venditori"));
  },

  //return undefined se non trova nessun venditore con il relativo username.
  getVenditore: function getVenditore(usrname) {
    let venditori = this.getVenditori();
    for (let i = 0; i < venditori.length; i++) {
      if (venditori[i].username === usrname) {
        return venditori[i];
      }
    }
  },

  getProdotti: function getProdotti() {
    return JSON.parse(localStorage.getItem("prodotti"));
  },

  //return undefined se non trova nessun prodotto con il relativo nome.
  getProdotto: function getProdotto(nomeProdotto, listaProds = false) {
    if (!listaProds) {
      //ottimizzazione nel caso la funzione venisse chiamata avendo gia' la lista dei prodotti dal local storage
      listaProds = this.getProdotti();
    }
    for (let i = 0; i < listaProds.length; i++) {
      if (listaProds[i].nome === nomeProdotto) {
        return listaProds[i];
      }
    }
  },

  changeStockAmt: function changeStockAmt(nomeProdotto, quantita) {
    let listaProds = this.getProdotti();
    let prod = this.getProdotto(nomeProdotto, listaProds);
    prod.numero = parseInt(prod.numero);
    prod.numero += parseInt(quantita);
    //Questo for e' dovuto al fatto che ho salvato la lista dei prodotti disponibili in un array.
    for (let i = 0; i < listaProds.length; i++) {
      if (listaProds[i].nome === prod.nome) {
        listaProds[i] = prod;
        break;
      }
    }
    localStorage.setItem("prodotti", JSON.stringify(listaProds));
  },

  checkStockAmt: function checkStockAmt(nomeProdotto, prodotto = false) {
    //funzione per controllare quanta merce e' rimasta del prodotto passato per argomento
    let stockLeft;
    if (prodotto) {
      //se prodotto non e' false ma ha al suo interno un oggetto acquisto
      stockLeft = prodotto.numero;
    } else {
      let prodotto = this.getProdotto(nomeProdotto);
      stockLeft = prodotto.numero < 1;
    }
    return stockLeft > 0;
  },

  addCliente: function addCliente(clienteRegistrato) {
    // aggiungi l'utente passato per argomento all'array ri-serializza e ricarica sul local storage.
    let utentiAggiornati = this.getUtenti();
    utentiAggiornati.push(clienteRegistrato);
    localStorage.setItem("utenti", JSON.stringify(utentiAggiornati));
    //Una volta iscritti la pagina rimanda alla home page e dare feedback positivo.
    alert("Iscrizione avvenuta con successo");
    window.location.href = "index.html";
  },

  //prendi gli acquisti di un utente dal local storage
  getAcquistiByUsername: function getAcquistiByUsername(usrname) {
    let tempKey, tempObj;
    let acquisti = [];
    for (let i = 0; i < localStorage.length; i++) {
      tempKey = localStorage.key(i);
      if (tempKey.substr(0, 8) === "acquisto") {
        tempObj = JSON.parse(localStorage.getItem(tempKey));
        if (tempObj.cliente === usrname) {
          acquisti.push(tempObj);
        }
      }
    }
    return acquisti;
  },

  cancellaOrdine: function cancellaOrdine(dataOrdine) {
    localStorage.removeItem(`acquisto-${dataOrdine.toLowerCase().replace(/\s/g, "")}`);
  }
};

const buttonManager = {
  loginButton: function loginButton() {
    //prendi le variabili inserite
    let inUser = document.getElementsByTagName("input");
    let inPwd = inUser[1].value; //variabile scelta per ottimizzare lo spazio
    inUser = inUser[0].value;
    return [inUser, inPwd];
  },

  userLoginButton: function UserLoginButton() {
    let userNpwd = buttonManager.loginButton();
    sessionManager.loginCliente(userNpwd[0], userNpwd[1]);
  },

  sellerLoginButton: function sellerLoginButton() {
    let userNpwd = buttonManager.loginButton();
    sessionManager.loginSeller(userNpwd[0], userNpwd[1]);
  },

  registerClientButton: function registerClientButton() {
    let userInputs = document.getElementsByTagName("input");
    let metodiAcquisto = [];
    for (let i = 5; i < userInputs.length; i++) {
      if (userInputs[i].checked) {
        metodiAcquisto.push(userInputs[i].name);
      }
    }
    userInputs = {
      nome: userInputs[0].value,
      cognome: userInputs[1].value,
      cf: userInputs[2].value,
      username: userInputs[3].value,
      password: userInputs[4].value,
      metAcq: metodiAcquisto,
      privacy: userInputs[8].checked
    };
    if (userInputs.cf && userInputs.username && userInputs.password) {
      lstorageManager.addCliente(userInputs);
    } else {
      alert("Inserisci almeno codice fiscale, nome utente e password");
    }
  },

  stampaProdotti: function stampaProdotti() {
    let products = lstorageManager.getProdotti();
    products.forEach(htmlMaker.printPruduct);
  },

  printSellerProds: function printSellerProds() {
    let products = lstorageManager.getProdotti();
    let curSeller = sessionManager.getSessionUsername();
    curSeller = lstorageManager.getVenditore(curSeller);
    products.forEach(elem => {
      if (elem.venditore === curSeller.PIVA) {
        htmlMaker.showProducts(elem);
      }
    });
  },

  acquistaProdotti: function acquistaProdotti() {
    //Scorri il session storage e aggiungi all'array oggetti tutti gli elementi che corrispondono a un prodotto.
    let oggetti = []; let tempKey; let tempObj; let lsProduct;
    for (let i = 0; i < sessionStorage.length; i++) {
      //Questo for e' dovuto al fatto che gli acquisti non non sono salvati nel ss in un array.
      tempKey = sessionStorage.key(i);
      if (tempKey.substr(0, 8) === "carrello") {
        tempObj = JSON.parse(sessionStorage.getItem(tempKey));
        lsProduct = lstorageManager.getProdotto(tempObj.nome);
        if (tempObj.quantita > lsProduct.numero){
          alert(`scorte di ${tempObj.nome} esaurite nella quantita' selezionata: ${tempObj.quantita} unita'`);
          
          return;
        }
        oggetti.push(tempObj);
      }
    }
    if (oggetti.length > 0) {
      //Ottieni il prezzo totale pagato (dall'elemento html dov'e' gia' stato calcolato)
      const totalPrice = parseFloat(document.getElementsByClassName("cart-total")[0].childNodes[1].innerText);
      //Salva le informazioni nel localstorage
      lstorageManager.addAcquisto(oggetti, totalPrice);
      //Abbassa la quantita' di prodotto rimanente
      oggetti.forEach(prodottoAcquistato => {
        lstorageManager.changeStockAmt(prodottoAcquistato.nome, prodottoAcquistato.quantita * -1);
      });
      //Svuota il carrello nella pagina
      htmlMaker.resetCart();
      //Feedback di conferma
      console.log("Acquisto avvenuto con successo!");
    } else {
      console.log("Non hai selezionato alcun prodotto!");
    }
  },

  annullaOrdine: function annullaOrdine(ElRigaTabella, dataOrdine, listaProdotti) {
    //Metodo chiamato dal bottone nella pagina dettagli cliente.
    const nOrdiniRimasti = htmlMaker.cancellaRigaOrdine(ElRigaTabella);
    lstorageManager.cancellaOrdine(dataOrdine);
    listaProdotti.forEach(element => {
      lstorageManager.changeStockAmt(element.nome, element.quantita);
    });
    if (nOrdiniRimasti < 1) {
      location.reload();
    }
  },

  applySearchQuery(refString, boxesTipoFiltro) {
    //Cerca i prodotti nel ls che corrispondono alla stringa ricercata, sfrutta le espressioni regolari.
    const allProds = lstorageManager.getProdotti();
    let filteredProds = [];
    if (boxesTipoFiltro[2].checked){
      //Se selezionata la ricerca per prezzo
      const prezzoMinimo = parseFloat(boxesTipoFiltro[3].value);
      const prezzoMassimo = parseFloat(boxesTipoFiltro[4].value);
      allProds.forEach(singleProd => {
        if (prezzoMinimo < singleProd.prezzo && prezzoMassimo > singleProd.prezzo) {
          filteredProds.push(singleProd);
        } else if (prezzoMassimo > singleProd.prezzo) {
          filteredProds.push(singleProd);
        } else if (prezzoMinimo < singleProd.prezzo) {
          filteredProds.push(singleProd);
        }
      });
    } else if (refString.length>2){
      //Se viene selezionata qualsi altro tipo di ricerca.
      const searchPattern = new RegExp(refString, 'i');
      let tipoFiltro;
      for (let i = 0; i < boxesTipoFiltro.length; i++) {
        if (boxesTipoFiltro[i].checked){
          tipoFiltro = boxesTipoFiltro[i];
          break;
        }
      }
      switch (tipoFiltro.value){
        case "nome":
          allProds.forEach(singleProd => {
            if (singleProd.nome.search(searchPattern) >= 0) {
              filteredProds.push(singleProd);
            }
          });
          break;
        case "caratteristiche":
            allProds.forEach(singleProd => {
              const dettagli_serialized = JSON.stringify(singleProd.dettagliCompleti);
              if (dettagli_serialized.search(searchPattern) >= 0) {
                filteredProds.push(singleProd);
              }
            });
          break;
        default :
          console.log("Non trovo niente da filtrare.");
          filteredProds = allProds;
      }
    } else {
      console.log("Non hai inserito abbastanza lettere, stampo tutti i prodotti...");
      //Stampera' tutti i prodotti disponibili
      filteredProds = allProds;
    }
    //Stampa i prodotti filtrati
    htmlMaker.printFilteredProds(filteredProds);
  }
};

const htmlMaker = {
  //Stampa un oggetto generico con formattazione html
  stampaOggetto: function stampaOggetto(oggRef) {
    let finalString = "";
    const keysArr = Object.keys(oggRef);
    const valuesArr = Object.values(oggRef);
    for (let i = 0; i < keysArr.length; i++) {
      //Non stampa solo la password
      if (keysArr[i] !== "password") {
        finalString += `${keysArr[i]}: ${valuesArr[i]} <br/>`;
      }
    }
    return finalString;
  },

  makeHeader: function makeHeader() {
    let apice = `<a class="home-link" href="index.html">
        <img src="logo.svg" alt="logoSearch&Buy" class="logo-image"/>
      </a>
      <nav class="header-nav">
        <ul>
          <li>
            <a href="loginUtente.html">Acquista prodotti</a>
          </li>
          <li>
            <a href="loginVenditore.html">Gestione prodotti</a>
          </li>
          <li>
            <button id="logOut-btn" type="button" class="btn">Log out</button>
          </li>
        </ul>
      </nav>
    `;
    headerEl.innerHTML = apice;
    //Crea event listener per log out button
    const logOutBtn = document.getElementById("logOut-btn");
    if (logOutBtn) {
      logOutBtn.addEventListener("click", sessionManager.sessionLogOut);
    } else {
      console.log("bottone log out non trovato.");
    }
  },

  makeFooter: function makeFooter() {
    let pedice = `
      <div class="left-main-footer">
      <a class="home-link" href="index.html">
      <img src="logo.svg" alt="logoSearch&Buy" class="logo-image"/>
      </a>
      </div>
    `;
    footerEl.innerHTML = pedice;
  },

  //Funzione per aggiornare il totale del carrello
  updateCartTotal: function updateCartTotal() {
    const totEl = document.querySelector(".cart-total span");
    let cartProds = sessionManager.getSessionSelements();
    let totale = 0;
    cartProds.forEach(elem => {
      if (elem.prezzo) {
        totale += parseFloat(elem.prezzo) * parseInt(elem.quantita);
      }
    });
    if (totale.toString().length > 3) {
      totale = Math.round(totale * 100) / 100;
    }
    totEl.innerText = totale;
  },

  resetCart: function resetCart() {
    const tableCartEl = document.querySelector("section.carrello table.container");
    const totEl = document.querySelector(".cart-total span");
    let contenuto = `
      <tr>
        <th>Immagine</th>
        <th>Nome</th>
        <th>Prezzo</th>
        <th>Quantità</th>
      </tr>
    `;
    sessionManager.clearTemporalCart();
    totEl.innerText = "0";
    tableCartEl.innerHTML = contenuto;
  },

  stampaProdCarrello: function stampaProdCarrello(refProd) {
    const carrelloSecEl = document.querySelector("section.carrello");
    let tableOelements = carrelloSecEl.firstChild.nextSibling.nextSibling.nextSibling;
    let prodottoCar = document.createElement("tr");
    prodottoCar.id = `prod-${refProd.nome.toLowerCase().replace(/\s/g, "")}`;
    prodottoCar.innerHTML = `
      <td>
        <img src="${refProd.srcimg}" alt="${refProd.nome} preview image" class="mini-prev-img"/>
      </td>
      <td>
        ${refProd.nome}
      </td>
      <td>
        €${refProd.prezzo}
      </td>
      <td>
        <input type="number" value="1"/>
      </td>
      <td>
        <button type="button" class="btn btn-remove-item red-btn">Rimuovi dal carrello</button>
      </td>
    `;

    //aggiungi listener evento click al bottone rimuovi dal carrello.
    let removeBtn = prodottoCar.childNodes[9].firstChild.nextSibling;
    removeBtn.addEventListener("click", () => {
      htmlMaker.rimuoviDalCarrello(tableOelements, prodottoCar, refProd);
    });

    //aggiungi listener evento on change all'input quantità.
    let prodAmtEl = prodottoCar.childNodes[7].childNodes[1];
    prodAmtEl.addEventListener("change", () => {
      //impedisci di inserire valori pari a 0 e negativi.
      if (prodAmtEl.value < 1) {
        prodAmtEl.value = 1;
      }
      sessionManager.updateTemporalItemAmt(refProd, prodAmtEl.value);
    });

    tableOelements.appendChild(prodottoCar);
  },

  //Funzione per aggiungere oggetti al carrello e per stamparli nella pagina, sezione carrello.
  aggiungiAlCarrello: function aggiungiAlCarrello(refProd) {
    const checkExists = sessionManager.getSessionSelement(`carrelloTemp-${refProd.nome.toLowerCase().replace(/\s/g, "")}`);
    if (checkExists) {
      //impedisci di aggiungere lo stesso prodotto piu' di una volta
      alert("Elemento già aggiunto al carrello");
    } else {
      if (refProd.numero>0){
        //prendi le informazioni da ls e aggiungilo al ss.
        sessionManager.addToTemporalCart(refProd);
        //prendi le informazioni da ls e aggiungilo riformattato per la tabella del carrello.
        this.stampaProdCarrello(refProd);
        this.updateCartTotal();
      } else {
        alert(`Prodotto "${refProd.nome}" esaurito!`);
      }
    }
  },

  rimuoviDalCarrello: function rimuoviDalCarrello(
    tableOelements,
    prodottoCar,
    refProd
  ) {
    sessionManager.removeFromTemporalCart(refProd);
    this.updateCartTotal();
    tableOelements.removeChild(prodottoCar);
  },

  stampaCarrelloDaSS: function stampaCarrelloDaSS() {
    let sessionElsCart = sessionManager.getSessionSelements();
    sessionElsCart.forEach(elem => {
      if (elem.prezzo) {
        this.stampaProdCarrello(elem);
      }
    })
  },

  //Funzione per aggiungere un prodotto alla pagina web dove si acquista
  printPruduct: function printPruduct(prod) {
    const prodEl = document.getElementsByClassName("contenitore-prodotti")[0];
    let singleProd = `
      <h3>${prod.nome}</h3>
      <img class="immagine-prodotto" src="${prod.srcimg}" alt="immagine esempio">
      <p class="descrizione-prodotto">
        <span>descrizione:</span>
        ${prod.breveDescrizione}
      </p>
      <span>€${prod.prezzo}</span>
      <button class="btn btn-add-cart" type="button">Aggiungi al carrello</button>
    `;
    let pagina = document.createElement("div");
    pagina.className = "prodotto";
    pagina.innerHTML = singleProd;
    if (prod.numero>0){
      //Alla posizione 9 c'e' l'elemento button
      pagina.childNodes[9].addEventListener("click", () => {
        htmlMaker.aggiungiAlCarrello(prod);
      });
    } else {
      pagina.childNodes[9].innerHTML = "Prodotto esaurito";
      pagina.childNodes[9].style["backgroundColor"] = "gray";
    }
    prodEl.appendChild(pagina);
  },

  clearProductPage: function clearProductPage(){
    const sezioneProdottiEl = document.querySelector("div.contenitore-prodotti");
    sezioneProdottiEl.innerHTML= "";
  },

  //Funzione per mostrare i prodotti di un venditore
  showProducts: function showProducts(prod) {
    const sellTableEl = document.getElementById("seller-products");
    let singleProd = `
      <td>${prod.nome}</td>
      <td>${prod.numero}</td>
      <td>${prod.prezzo}euro</td>
      <td class="cella-max-width">${prod.breveDescrizione}</td>
      <td class="text-left-align">
        ${htmlMaker.stampaOggetto(prod.dettagliCompleti)}
      </td>
      <td>
        <img class="mini-prev-img" src="${prod.srcimg}" alt="${prod.name} preview image">
      </td>
    `;
    let riga = document.createElement("tr");
    riga.className = "prodotto-venditore";
    riga.innerHTML = singleProd;
    sellTableEl.appendChild(riga);
  },

  dettagliVenditore: function dettagliVenditore() {
    let vendit = sessionManager.getSessionUsername();
    vendit = lstorageManager.getVenditore(vendit);
    const divDettagli = document.getElementsByClassName("pagina-venditore")[0];
    let inDettagli = document.createElement("p");
    inDettagli.innerHTML = this.stampaOggetto(vendit);
    divDettagli.appendChild(inDettagli);
  },

  stampaDettagliCliente: function stampaDettagliCliente(currentUser) {
    let h2El =
      sectionElusrName.firstChild.nextElementSibling.firstChild
        .nextElementSibling;
    h2El.firstChild.nextElementSibling.innerHTML = currentUser.username;
    let paragraphEl = h2El.nextElementSibling;
    paragraphEl.innerHTML = `Nome completo: ${currentUser.nome} ${currentUser.cognome}<br/>
    Metodi d'acquisto: ${currentUser.metAcq /*Formattare meglio*/} <br/>
  `;
    //!!!!!!!ERRORE compare privacy quando vengono stampati i dettagli!!!
  },

  //Crea una tabella con tutti gli acquisti fatti nell'ultimo mese e il relativo bottone per annullare l'acquisto.
  stampaAcquistiRecenti: function stampaAcquistiRecenti(usrname) {
    let acquisti = lstorageManager.getAcquistiByUsername(usrname);
    const parEl = document.querySelector("div.info-acquisti div.pagina-utente");
    if (acquisti.length > 0) {
      let startElement = document.createElement("div");
      startElement.className = "tabella-acquisti container";
      startElement.innerHTML = `
          <div class="titoli-riga-acquisti">
            <span>Data di Acquisto</span>
            <span>Prodotti</span>
            <span>Prezzo totale</span>
            <span>Azioni</span>
          </div>
        `;
      const dataLimite = new Date();
      dataLimite.setMonth(dataLimite.getDate()-2);
      //Per ogni acquisto stampo la data d'acquisto e la lista dei prodotti acquistati con il relativo prezzo totale
      acquisti.forEach(elem => {
        const dataAcq = new Date(elem.dataAcquisto);
        console.log( dataAcq.getTime() );
        if (dataAcq > dataLimite) {
          let rigaAcquisto = document.createElement("div");
          rigaAcquisto.className = "riga-acquisto";
          let rigaAcquistoT = `
              <span>${elem.dataAcquisto}</span>
              <span id="table-parent">
            `;

          //Predo la lista dei prodotti acquistati e la formatto per essere inserita nella tabella
          let tabellaProdottiAcq = `
              <table class="prods-table">
                <tr>
                  <td>Nome</td>
                  <td>Prezzo</td>
                  <td>Quantita'</td>
                </tr>`;
          //Creo una tabella interna per elencare i prodotti acquistati in un ordine.
          elem.listaProd.forEach(e => {
            tabellaProdottiAcq += `
                <tr class="riga-prodotto">
                  <td class="nome-riga-prodotto">${e.nome}</td>
                  <td>${e.prezzo}euro</td>
                  <td>${e.quantita}</td>
                </tr>`;
          });
          //Ultima parte della stringa che completa una riga della tabella 'acquisti'.
          tabellaProdottiAcq += `</table>`;
          rigaAcquistoT += tabellaProdottiAcq + `</span>
              <span>${elem.prezzoTotale}euro</span>
              <span>
                <button class="btn red-btn undo-acq-btn">Annulla ordine</button>
              </span>
            `;
          rigaAcquisto.innerHTML = rigaAcquistoT;
          startElement.appendChild(rigaAcquisto);
          parEl.appendChild(startElement);
          //Aggiungi l'event listener al bottone per annullare un ordine.
          const annullaBtnEl = rigaAcquisto.childNodes[7].childNodes[1];
          annullaBtnEl.addEventListener("click", () => {
            //Prendere le reference della pag HTML e al ogg nel ls
            buttonManager.annullaOrdine(rigaAcquisto, elem.dataAcquisto, elem.listaProd);
            //Feedback all'utente della procedura andata a buon fine
            console.log(`richiesta per l'annullamento dell'ordine ${elem.dataAcquisto} inviata con successo!`);
          });
        }
      });
    } else {
      parEl.innerHTML = `<p>Non sono stati effettuati acquisti</p>`;
    }
  },

  cancellaRigaOrdine: function cancellaRigaOrdine(ElRigaAcquisto) {
    let tabellaAcquistiEl = document.querySelector(".tabella-acquisti");
    tabellaAcquistiEl.removeChild(ElRigaAcquisto);
    //Ritorna il numero di acquisti rimasti (la costante 3 toglie gli elementi fissi che non sono le righe della tabella).
    return tabellaAcquistiEl.childNodes.length - 3;
  },

  printFilteredProds: function printFilteredProds(listaProdFiltrata){
    this.clearProductPage();
    listaProdFiltrata.forEach(prodotto => {
      this.printPruduct(prodotto);
    });
  }
};

const automaticReindexing = {
  //Controlllo se la sessione e' gia attiva, se lo e' rimando subito alla pagina acquisti
  skipLogin: function skipLogin(toPage, messaggio, origine) {
    let currentSession = JSON.parse(sessionStorage.getItem("sessione"));
    //se e' attiva
    if (currentSession.accessoAttivo) {
      //'origine' controlla se la funzione e' stata chiamata dal login per il venditore o utente.
      //codice troppo ripetitivo
      if (origine) {
        if (currentSession.isSeller) {
          window.location.href = toPage;
        } else {
          alert(messaggio);
          window.location.href = "index.html";
        }
      } else {
        if (currentSession.isSeller) {
          alert(messaggio);
          window.location.href = "index.html";
        } else {
          window.location.href = toPage;
        }
      }
    }
  },

  skipToAcquista: function skipToAcquista() {
    const msg = "Sei un venditore, non hai il permesso di accedere come cliente. Ritorno alla home...";
    const toPage = "acquista.html";
    this.skipLogin(toPage, msg, false);
  },

  skipToGestisci: function skipToGestisci() {
    const msg = "Sei un cliente, non hai il permesso di accedere come venditore. Ritorno alla home...";
    const toPage = "gestisci.html";
    this.skipLogin(toPage, msg, true);
  }
}