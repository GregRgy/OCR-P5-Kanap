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
  await fetchApi();
  for (let input of document.querySelectorAll(".itemQuantity")) {
    input.addEventListener("change", function () {
      let basketValue = getBasket();
      const newQuantity = parseFloat(input.value);
      const idModif = this.closest(".cart__item").dataset.id;
      const colorModif = this.closest(".cart__item").dataset.color;
      const findItem = basketValue.find(
        (item) =>
          item.idSelectedProduct === idModif &&
          item.colorSelectedProduct === colorModif
      );

      if (newQuantity > 0 && newQuantity <= 100 && Number.isInteger(newQuantity)) {
        findItem.quantity = newQuantity;
        localStorage.setItem("product", JSON.stringify(basketValue));
        calculTotalQuantity();
        calculTotalPrice();
      } else {
        alert("La quantité d'un article (même référence et même couleur) doit être comprise entre 1 et 100 et être un nombre entier. Merci de rectifier la quantité choisie.");
        input.value = findItem.quantity;
      }
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

const orderButtonArea = document.querySelector("#order");

// Déclaration des différentes zones d'input
const inputFirstName = document.getElementById("firstName");
const inputLastName = document.getElementById("lastName");
const inputAddress = document.getElementById("address");
const inputCity = document.getElementById("city");
const inputEmail = document.getElementById("email");

// Déclaration des messages d'erreur
const firstNameErrorMessage = document.querySelector("#firstNameErrorMsg");
const lastNameErrorMessage = document.querySelector("#lastNameErrorMsg");
const addressErrorMessage = document.querySelector("#addressErrorMsg");
const cityErrorMessage = document.querySelector("#cityErrorMsg");
const emailErrorMessage = document.querySelector("#emailErrorMsg");

// Ecoute du changement de valeur dans inputFirstName
inputFirstName.addEventListener("input", function () {
  const regexFirstName = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;

  if (regexFirstName.test(inputFirstName.value) === false || inputFirstName.value === "") {
    firstNameErrorMessage.innerHTML = "Merci de renseigner un prénom conforme";
  } else {
    firstNameErrorMessage.innerHTML = ""; // Réinitialiser le message d'erreur
  }
});

// Ecoute du changement de valeur dans inputLastName
inputLastName.addEventListener("input", function () {
  const regexLastName = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;

  if (regexLastName.test(inputLastName.value) === false || inputLastName.value === "") {
    lastNameErrorMessage.innerHTML = "Merci de renseigner un nom de famille conforme";
  } else {
    lastNameErrorMessage.innerHTML = ""; // Réinitialiser le message d'erreur
  }
});

// Ecoute du changement de valeur dans inputAddress
inputAddress.addEventListener("input", function () {
  const regexAddress = /^[#.0-9a-zA-ZÀ-ÿ\s',-]{2,60}$/;

  if (regexAddress.test(inputAddress.value) === false || inputAddress.value === "") {
    addressErrorMessage.innerHTML =
      "Veuillez renseigner une adresse conforme (Voie, nom de la voie, numéro, code postal)";
  } else {
    addressErrorMessage.innerHTML = ""; // Réinitialiser le message d'erreur
  }
});

// Ecoute du changement de valeur dans inputCity
inputCity.addEventListener("input", function () {
  const regexCity = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;

  if (regexCity.test(inputCity.value) === false || inputCity.value === "") {
    cityErrorMessage.innerHTML = "Veuillez renseigner un nom de ville conforme";
  } else {
    cityErrorMessage.innerHTML = ""; // Réinitialiser le message d'erreur
  }
});

// Ecoute du changement de valeur dans inputEmail
inputEmail.addEventListener("input", function () {
  const regexEmail =
    /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/;

  if (regexEmail.test(inputEmail.value) === false || inputEmail.value === "") {
    emailErrorMessage.innerHTML = "Veuillez renseigner une adresse mail conforme";
  } else {
    emailErrorMessage.innerHTML = ""; // Réinitialiser le message d'erreur
  }
});

// écoute du clic sur le bouton COMMANDER
orderButtonArea.addEventListener("click", function (e) {
  e.preventDefault(); // on empêche le formulaire de fonctionner par défaut si aucun contenu

  // Récupération des valeurs des champs du formulaire
  let checkFirstName = inputFirstName.value;
  let checkLastName = inputLastName.value;
  let checkAddress = inputAddress.value;
  let checkCity = inputCity.value;
  let checkEmail = inputEmail.value;

  function orderValidation() {
    const regexFirstName = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
    const regexLastName = regexFirstName;
    const regexAddress = /^[#.0-9a-zA-ZÀ-ÿ\s',-]{2,60}$/;
    const regexCity = regexFirstName;
    const regexEmail =
      /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/;

    // Réinitialiser les messages d'erreur
    firstNameErrorMessage.innerHTML = "";
    lastNameErrorMessage.innerHTML = "";
    addressErrorMessage.innerHTML = "";
    cityErrorMessage.innerHTML = "";
    emailErrorMessage.innerHTML = "";

    // Vérifier les validations des champs et afficher les messages d'erreur
    let isValid = true;
    if (regexFirstName.test(checkFirstName) === false || checkFirstName === "") {
      firstNameErrorMessage.innerHTML = "Merci de renseigner un prénom conforme";
      isValid = false;
    }
    if (regexLastName.test(checkLastName) === false || checkLastName === "") {
      lastNameErrorMessage.innerHTML = "Merci de renseigner un nom de famille conforme";
      isValid = false;
    }
    if (regexAddress.test(checkAddress) === false || checkAddress === "") {
      addressErrorMessage.innerHTML =
        "Veuillez renseigner une adresse conforme (Voie, nom de la voie, numéro, code postal)";
      isValid = false;
    }
    if (regexCity.test(checkCity) === false || checkCity === "") {
      cityErrorMessage.innerHTML = "Veuillez renseigner un nom de ville conforme";
      isValid = false;
    }
    if (regexEmail.test(checkEmail) === false || checkEmail === "") {
      emailErrorMessage.innerHTML = "Veuillez renseigner une adresse mail conforme";
      isValid = false;
    }

    // Si tous les champs du formulaire sont correctement remplis
    if (isValid) {
      // On crée un objet contact pour l'envoi par l'API
      let contact = {
        firstName: checkFirstName,
        lastName: checkLastName,
        address: checkAddress,
        city: checkCity,
        email: checkEmail,
      };

      // On crée un tableau vide qui va récupérer les articles du panier à envoyer à l'API
      let products = [];

      // La requête POST ne prend en compte QUE l'ID des produits du panier
      // On ne push donc QUE les ID des canapés du panier dans le tableau créé
      for (let kanapId of basketValue) {
        products.push(kanapId.idSelectedProduct);
      }

      // On crée l'objet contenant les infos de la commande
      let finalOrderObject = { contact, products };

      // Récupération de l'ID de commande après fetch POST vers API
      fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify(finalOrderObject),
        headers: {
          "Content-type": "application/json",
        },
      })
        .then(async function (response) {
          // Réponse de l'API
          const reply = await response.json();
          console.log(reply);
          // Renvoi vers la page de confirmation avec l'ID de commande
          window.location.href = `confirmation.html?orderId=${reply.orderId}`;
        })
        .catch(function (error) {
          console.log("Erreur lors de la requête POST :", error);
        });
    }
  }

  orderValidation();
});