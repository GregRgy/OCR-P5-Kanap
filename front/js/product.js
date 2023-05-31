let url = new URL(location.href); //création d'une varibale url étant l'url de la page actuelle
let kanapPageId = url.searchParams.get("id"); //récupère l'id contenu dans l'url de la page actuelle

const kanapImg = document.querySelector(".item__img");
const kanapName = document.querySelector("#title");
const kanapPrice = document.querySelector("#price");
const kanapDescription = document.querySelector("#description");
const colorOptions = document.querySelector("#colors");
const getProductQuantity = document.querySelector("#quantity");

fetch(`http://localhost:3000/api/products/${kanapPageId}`)
    .then((res) => res.json())
    .then((object) => {
        for (let couleur of object.colors){
            colorOptions.innerHTML += `<option value="${couleur}">${couleur}</option>`;
        }
        kanapImg.innerHTML += `<img src="${object.imageUrl}" alt="${object.altTxt}">`;
        kanapName.innerHTML += `${object.name}`;
        kanapPrice.innerHTML += `${object.price}`;
        kanapDescription.innerHTML += `${object.description}`;
        // Création du bouton ajouter au panier

    const button = document.getElementById("addToCart");

    });
