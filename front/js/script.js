const allKanaps = document.getElementById("items"); //je crée la variable allKanaps afin de récupéré les élements liés à l'ID "items" afin d'intérargir avec le document HTML lié

fetch("http://localhost:3000/api/products/") //requête afin de récupérer l'api pour importer les données des canapés
    .then((res) => res.json())//conversion des données reçues en format JSON exploitable par js
    .then((data) =>{ //données JSON renommées en data afin d'être exploitées comme un tableau
        for (let kanap of data){ //remplacer champ par kanap pour plus de clarté
            allKanaps.innerHTML += `<a href="product.html?id=${kanap._id}">
            <article>
            <img src="${kanap.imageUrl}" alt="${kanap.altTxt}">
              <h3 class="productName">${kanap.name}</h3>
              <p class="productDescription">${kanap.description}</p>
          </article>
      </a>`; // infos et photos stockées dynamiquement dans l'HTML de la page d'accueil + mettre kanap.id + facile et utile

        }
    })

    .catch(err => console.log(err))