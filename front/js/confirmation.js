let url = new URL(location.href); //déclare une variable valant l'url de la page actuelle
let orderIdKanap = url.searchParams.get("orderId"); //récupère l'id contenu dans l'url de la page actuelle

const zoneOrderId = document.getElementById("orderId");
zoneOrderId.innerHTML = `${orderIdKanap}`; // ajout de l'orderId dans le message de validation //

////// On vide le LocalStorage /////////
localStorage.clear();