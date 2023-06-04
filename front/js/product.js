let url = new URL(location.href); //création d'une varibale url étant l'url de la page actuelle
let kanapPageId = url.searchParams.get("id"); //récupère l'id contenu dans l'url de la page actuelle

fetch(`http://localhost:3000/api/products/${kanapPageId}`)
  .then((res) => res.json())
  .then((object) => {
    for (let couleur of object.colors) {
      document.querySelector(
        "#colors"
      ).innerHTML += `<option value="${couleur}">${couleur}</option>`;
    }
    document.querySelector(
      ".item__img"
    ).innerHTML += `<img src="${object.imageUrl}" alt="${object.altTxt}">`;
    document.querySelector("#title").innerHTML += `${object.name}`;
    document.querySelector("#price").innerHTML += `${object.price}`;
    document.querySelector("#description").innerHTML += `${object.description}`;
  })

  .catch(function (err) {
    console.log(err);
  });

const button = document.getElementById("addToCart");

button.addEventListener("click", () => {
  if (document.querySelector("#colors").value === "") {
    alert("Veuillez choisir une couleur, SVP");
  }
  // Si la quantité choisie est nulle ou si elle dépasse 100
  else if (
    document.querySelector("#quantity").value <= 0 ||
    document.querySelector("#quantity").value > 100
  ) {
    alert("Veuillez choisir une quantité corecte");
  } else {
    // Si tout est bon alors on envoie le panier au LocalStorage
    addBasket();
  }
});

function addBasket() {
  let basketValue = getBasket();
  let foundProducts = basketValue.find(
    //foundProducts représente l'article à trouver
    (item) =>
      item.idSelectedProduct === kanapPageId &&
      item.colorSelectedProduct === document.querySelector("#colors").value
  ); //Ici il faut que les produits du panier et les produits du LS aient le même id et la même couleur sinon foundProducts sera égal à undefined

  if (foundProducts == undefined) {
    let product = {
      // nous initions la nouvelle variable basketValue
      idSelectedProduct: kanapPageId,
      colorSelectedProduct: document.querySelector("#colors").value,
      quantity: document.querySelector("#quantity").value,
    };
    basketValue.push(product);
  } else {
    let newQuantity =
      parseInt(foundProducts.quantity) +
      parseInt(document.querySelector("#quantity").value);
    foundProducts.quantity = newQuantity;
  }
  fetch(`http://localhost:3000/api/products/${kanapPageId}`)
    .then((res) => res.json())
    .then((object) => {
      saveBasket(basketValue);
      alert(
        `Le ${object.name} de couleur ${
          document.querySelector("#colors").value
        } a été ajouté en ${
          document.querySelector("#quantity").value
        } exemplaires à votre panier !`
      );
    });
}

function saveBasket(basketValue) {
  localStorage.setItem("product", JSON.stringify(basketValue));
}

function getBasket() {
  let basketValue = JSON.parse(localStorage.getItem("product"));
  if (basketValue === null) {
    return [];
  } else {
    return basketValue;
  }
}
