//RECUPERATION DU NUMERO DE COMMANDE DANS L'URL POUR AFFICHAGE

let url = new URL(location.href); //déclare une variable valant l'url de la page actuelle
let orderIdKanap = url.searchParams.get("orderId"); //récupère l'id contenu dans l'url de la page actuelle

// Génère un nombre aléatoire à 17 chiffres
function generateRandomNumber() {
  const randomNumber =
    Math.floor(Math.random() * (99999999999999999 - 10000000000000000 + 1)) +
    10000000000000000;
  return randomNumber.toString();
}

// Utilisation du générateur de nombre aléatoire
const randomNum = generateRandomNumber();
console.log(randomNum);
document.getElementById("orderId").innerHTML += `${randomNum}`;
////// On vide le LocalStorage /////////
localStorage.clear();