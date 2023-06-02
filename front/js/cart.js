// variable qui contiendra les keys et les values du localStorage
let productRegisterLocalStorage = JSON.parse(localStorage.getItem("product"));
    console.log(productRegisterLocalStorage)
// balise dans laquelle on va insérer les produits et leurs informations
const productsPositionHtml = document.getElementById("cart__items");

async function fecthApi(){
    
}