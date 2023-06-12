const basketValue = JSON.parse(localStorage.getItem("product"));

// Ici nous appelons les fonctions
initialize();

// déclaration de la fonction du fetch pour accéder aux infos hors scope
async function fetchApi() {
  let basketArrayFull = []; // tableau vide qui va contenir les objets créés en suite
  let basketClassFull = JSON.parse(localStorage.getItem("product"));
  if (basketClassFull !== null) {
    for (let i = 0; i < basketClassFull.length; i++) {
      await fetch(
        "http://localhost:3000/api/products/" +
          basketClassFull[i].idSelectedProduct
      )
        .then((res) => res.json())
        .then((kanap) => {
          kanap.color = basketClassFull[i].colorSelectedProduct,
          kanap.quantity = basketClassFull[i].quantity,
          basketArrayFull.push(kanap); // Ajout de la const article au tableau
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }
  return basketArrayFull;
}


// Fonction d'affichage du panier grâce à l'injection dynamique des produits côté HTML
async function showBasket() {
  const responseFetch = await fetchApi();
  const basketValue = JSON.parse(localStorage.getItem("product"));
  if (basketValue !== null && basketValue.length !== 0) {
    const cartArea = document.querySelector("#cart__items");
    responseFetch.forEach((product) => { //injection dynamique
      cartArea.innerHTML += `<article class="cart__item" data-id="${product._id}" data-color="${product.color}">
            <div class="cart__item__img">
              <img src="${product.imageUrl}" alt="Photographie d'un canapé">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${product.name}</h2>
                <p>${product.color}</p>
                <p>${product.price} €</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
          </article>`;
    });
  } else {
    return messageEmptyCart(); // Si le LocalStorage est vide, on affichera la function panier vide
  }
}

// Fonctions de suppression et de modification du panier

function getBasket() { // Fonction qui va permettre de récupérer le LS
  return JSON.parse(localStorage.getItem("product"));
}

async function modifyQuantity() {
  await fetchApi(); //on attend que le fetch soit terminé
  for (let input of document.querySelectorAll(".itemQuantity")) {
    input.addEventListener("change", function () {
      // écoute si changement de quantité
      let basketValue = getBasket();
      // On récupère l'ID lorsque la donnée est modifiée
      let idModif = this.closest(".cart__item").dataset.id;
      // On récupère la couleur lorsque la donnée est modifiée
      let colorModif = this.closest(".cart__item").dataset.color;
      // On "filtre le LS avec l'ID du kanap qui a été modifié"
      let findId = basketValue.filter((e) => e.idSelectedProduct === idModif);
      // Enfin on recherche ce kanap avec ce même ID que l'on choisit par sa couleur
      let findColor = findId.find((e) => e.colorSelectedProduct === colorModif);
      if (this.value > 0) {
        // Si la couleur et l'ID sont finalement trouvés alors on modifie la quantité de ce kanap
        findColor.quantity = this.value;
        //  On push le panier dans le LS pour terminer
        localStorage.setItem("product", JSON.stringify(basketValue));
        calculTotalQuantity();
        calculTotalPrice();
      } else {
        calculTotalQuantity();
        calculTotalPrice();
      }
      localStorage.setItem("product", JSON.stringify(basketValue));
    });
  }
}


// Supprimer des kanaps dans le panier
async function removeItem() {
  await fetchApi(); 
  document.querySelectorAll(".deleteItem").forEach((article) => {
    article.addEventListener("click", function (event) {
      let basketValue = getBasket();
      // On récupère l'ID de la donnée qui a été modifiée
      const idDelete = event.target.closest("article").getAttribute("data-id");
      // On récupère la couleur de la donnée qui été modifiée
      const colorDelete = event.target
        .closest("article")
        .getAttribute("data-color");
      const searchDeleteKanap = basketValue.find( // On cherche l'élément dans le LS qui est concerné ici
        (element) =>
          element.idSelectedProduct == idDelete &&
          element.colorSelectedProduct == colorDelete
      );
      basketValue = basketValue.filter((item) => item != searchDeleteKanap); // Ensuite on filtre le LS avec l'élément comme modèle
      localStorage.setItem("product", JSON.stringify(basketValue));
      document.querySelector("#cart__items").removeChild(event.target.closest("article")); // On supprime l'élément 
      alert("article supprimé !");
      calculTotalQuantity();
      calculTotalPrice(); //Mise à jour des quantités et prix dynamiquement
    });
  });
  if (getBasket() !== null && getBasket().length === 0) {
    localStorage.clear(); // Si LS = vide, clear du LS et affichage du message panier vide
    return messageEmptyCart();
  }
}
removeItem();

async function initialize() {
  showBasket(); // Affichage du DOM (Document Object Model)
  removeItem(); // Suppression dynamique des kanaps du panier
  modifyQuantity(); // Modification dynamique des quantités

  calculTotalQuantity(); // Mise à jour dynamique des quantités et prix totaux
  calculTotalPrice();
}


// Message du panier vide
function messageEmptyCart() {
  const emptyCartMessage = "Votre panier est vide !";
  document.querySelector(
    "#limitedWidthBlock div.cartAndFormContainer > h1"
  ).textContent = emptyCartMessage;
  document.querySelector(
    "#limitedWidthBlock div.cartAndFormContainer > h1"
  ).style.fontSize = "40px";

  document.querySelector(".cart__order").style.display = "none"; // Masque le formulaire si panier vide
  document.querySelector(".cart__price").style.display = "none"; // Masque le prix total si panier vide
}

function calculTotalQuantity() {
  let basketValue = getBasket();
  let quantityInBasket = []; // création d'un tableau vide pour accumuler les qtés
  if (basketValue === null || basketValue.length === 0) {
    messageEmptyCart();
  } else {
    for (let kanap of basketValue) {
      quantityInBasket.push(parseInt(kanap.quantity));//push des qtés
      const reducer = (accumulator, currentValue) => accumulator + currentValue; // addition des objets du tableau par reduce
      document.querySelector("#totalQuantity").textContent = quantityInBasket.reduce(reducer, 0);//valeur initiale à 0 pour eviter erreur quand panier vide
    }
  }
}

async function calculTotalPrice() {
  const responseFetch = await fetchApi();
  let basketValue = getBasket();
  finalTotalPrice = [];
  for (let i = 0; i < responseFetch.length; i++) { //produit du prix unitaire et de la quantité
    let subTotal =
      parseInt(responseFetch[i].quantity) * parseInt(responseFetch[i].price);
    finalTotalPrice.push(subTotal);

    const reducer = (accumulator, currentValue) => accumulator + currentValue; // addition des prix du tableau par reduce
    document.querySelector("#totalPrice").textContent = finalTotalPrice.reduce(reducer, 0); //valeur initiale à 0 pour eviter erreur quand panier vide
    localStorage.setItem("product", JSON.stringify(basketValue));
  }
}

modifyQuantity();
removeItem();

// Le panier est push dans le localStorage
localStorage.setItem("product", JSON.stringify(basketValue));

// Ecoute sur le bouton commander

const orderButtonArea = document.querySelector("#order");

// écoute du clic sur le bouton COMMANDER //
orderButtonArea.addEventListener("click", function (e) {
  e.preventDefault();// on empeche le formulaire de fonctionner par defaut si aucun contenu

  // déclaration des différentes zones d'input
  const inputFirstName = document.getElementById("firstName");
  const inputLastName = document.getElementById("lastName");
  const inputAddress = document.getElementById("address");
  const inputCity = document.getElementById("city");
  const inputEmail = document.getElementById("email");

  // recupération des inputs du formulaire //
  let checkFirstName = inputFirstName.value;
  let checkLastName = inputLastName.value;
  let checkAddress = inputAddress.value;
  let checkCity = inputCity.value;
  let checkEmail = inputEmail.value;

  function orderValidation() {
    let basketValue = getBasket();
    
    const firstNameErrorMessage = document.querySelector("#firstNameErrorMsg");
    const lastNameErrorMessage = document.querySelector("#lastNameErrorMsg");
    const addressErrorMessage = document.querySelector("#addressErrorMsg");
    const cityErrorMessage = document.querySelector("#cityErrorMsg");
    const emailErrorMessage = document.querySelector("#emailErrorMsg");

    const regexFirstName = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
    const regexLastName = regexFirstName;
    const regexAddress = /^[#.0-9a-zA-ZÀ-ÿ\s',-]{2,60}$/;
    const regexCity = regexFirstName;
    const regexEmail =
      /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/;

    // si une erreur est trouvée, un message est retourné et la valeur false également
    if (
      regexFirstName.test(checkFirstName) == false ||
      checkFirstName === null
    ) {
      firstNameErrorMessage.innerHTML =
        "Merci de renseigner un prénom conforme";
      return false;
    } else if (
      regexLastName.test(checkLastName) == false ||
      checkLastName === null
    ) {
      lastNameErrorMessage.innerHTML =
        "Merci de renseigner un nom de famille conforme";
      return false;
    } else if (regexAddress.test(checkAddress) == false || checkAddress === null) {
      addressErrorMessage.innerHTML =
        "Veuillez renseigner une adresse conforme (Voie, nom de la voie, numéro, code postal)";
      return false;
    } else if (regexCity.test(checkCity) == false || checkCity === null) {
      cityErrorMessage.innerHTML =
        "Veuillez renseigner un nom de ville conforme";
      return false;
    } else if (regexEmail.test(checkEmail) == false || checkEmail === null) {
      emailErrorMessage.innerHTML =
        "Veuillez renseigner une adresse mail conforme";
      return false;
      // si tous les champs du formulaire sont correctement remplis
    } else {
      // on crée un objet contact pour l'envoi par l'API 
      let contact = {
        firstName: checkFirstName,
        lastName: checkLastName,
        address: checkAddress,
        city: checkCity,
        email: checkEmail,
      };

      // on crée un tableau vide qui va récupérer les articles du panier à envoyer à l'API 

      let products = [];

      // la requête POST ne prend en compte QUE l'ID des produits du panier 
      // On ne push donc QUE les ID des canapés du panier dans le tableau créé 

      for (let kanapId of basketValue) {
        products.push(kanapId.idSelectedProduct);
      }

      // on crée l'objet contenant les infos de la commande 

      let finalOrderObject = { contact, products };

      // récupération de l'ID de commande après fetch POST vers API   

      fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify(finalOrderObject),
        headers: {
          "Content-type": "application/json",
        },
      })
      .then(async function (response) {
        // réponse de l'API //
        const reply = await response.json();
        console.log(reply);
        //renvoi vers la page de confirmation avec l'ID de commande 
        window.location.href = `confirmation.html?orderId=${reply.orderId}`;
      });
    }
  }
  orderValidation();
});
