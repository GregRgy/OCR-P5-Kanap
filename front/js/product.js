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

    // Local Storage

    button.addEventListener("click", () => {
        let basketValue = {
            // nous initions la nouvelle variable basketValue
            idSelectedProduct: kanapPageId,
            nameSelectedProduct: kanapName,
            colorSelectedProduct: colorOptions.value,
            quantity: getProductQuantity.value,
        };

        // Il faut maintenant récupérer les données du panier

        function getBasket(){
            let basketValue = JSON.parse(localStorage.getItem("product"));
            if (basketValue === null){
                // return[] tableau vide si localstorage vide
            } else {
                return basketValue 
            }
        }

        // Création de l'ajout au panier avec l'argument product

        function addBasket(product){
            let basketvalue = getBasket();
            let foundProducts = basketValue.find( //foundProducts représente l'article à trouver
                (item) =>
                    item.idSelectedProduct === product.idSelectedProduct &&
                    item.colorSelectedProduct === product.colorSelectedProduct
            ); //Ici il faut que les produits du panier et les produits du LS aient le même id et la même couleur

            if (
                foundProducts == undefined &&
                colorOptions.value != "" &&
                getProductQuantity.value > 0 &&
                getProductQuantity.value <= 100
            ) {
                product.quantity = getProductQuantity.value;
                basketValue.push(product);
            } else {
                let newQuantity = 
                    parseInt(foundProducts.quantity) +
                    parseInt(getProductQuantity.value);
                foundProducts.quantity = newQuantity;
            }
            saveBasket(basketValue);
            alert(
                `Le canapé ${nameKanap} ${colorOptions.value} a été ajouté en ${getProductQuantity.value} exemplaires à votre panier !`
            );
        }
        function saveBasket(basketValue){
            localStorage.setItem("product", JSON.stringify(basketValue));
        }

        if (colorOptions.value === ""){
            alert("Veuillez choisir une couleur, SVP");
        } 

        else if (
            getProductQuantity.value <= 0 ||
            getProductQuantity.value > 100
        ) {
            alert("Veuillez choisir une quantité corecte");
        } else {
            addBasket(basketValue);
        }
    });
})
.catch(function (err) {
    console.log(err);
})
