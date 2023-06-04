const basketValue = JSON.parse(localStorage.getItem("product"));

async function fetchApi() {
  let basketArrayFull = [];
  let basketClassFull = JSON.parse(localStorage.getItem("product"));
  if (basketClassFull !== null) {
    for (let i = 0; i < basketClassFull.length; i++) {
      await fetch(
        "http://localhost:3000/api/products/" +
          basketClassFull[i].idSelectedProduct
      )
        .then((res) => res.json())
        .then((kanap) => {
          const article = {
            _id: kanap._id,
            name: kanap.name,
            price: kanap.price,
            color: basketClassFull[i].colorSelectedProduct,
            quantity: basketClassFull[i].quantity,
            alt: kanap.altTxt,
            img: kanap.imageUrl,
          };
          basketArrayFull.push(article);
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }
  return basketArrayFull;
}

async function showBasket() {
  const responseFetch = await fetchApi();
  const basketValue = JSON.parse(localStorage.getitem("product"));
  if (basketValue !== null && basketValue.length !== 0) {
    const cartPage = document.querySelector("#cart__items");
    responseFetch.forEach((product) => {
      cartPage.innerHTML += `<article class="cart__item" data-id="${product._id}" data-color="${product.color}">
            <div class="cart__item__img">
              <img src="../images/product01.jpg" alt="Photographie d'un canapé">
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
    return messagePaniervide();
  }
}

function getBasket() {
  return JSON.parse(localStorage.getItem("product"));
}

async function modifyQuantity() {
  await fetchApi;
  const quantityinCart = document.querySelectorAll(".itemQuantity");
  for (let input of quantityInCart) {
    input.addEventListener("change", function () {
      let basketvalue = getBasket();
      let idModif = this.closest(".cart__item").dataset.id;
      let colorModif = this.closest(".cart__item").dataset.color;
      let findId = basketValue.filter(
        (e) => e.colorSelectedProduct === idModif
      );
      let findColor = findId.find((e) => e.colorSelectedProduct === colorModif);
      if (this.value > 0) {
        findColor.quantity = this.value;
        localStorage.setitem("product", JSON.stringify(basketValue));
        calculTotalQuantity();
        calculTotalPrice();
      } else {
        calculTotalQuantity();
        calculTotalPrice();
      }
      localStorage.setitem("product", JSON.stringify(basketvalue));
    });
  }
}

async function removeItem() {
  await fetchApi();
  const kanapDelete = document.querySelectorAll(".deleteItem");
  kanapDelete.forEach((article) => {
    article.addEventListener("click", function (event) {
      let basketvalue = getbasket();
      const idDelete = e.target.closest("article").getAttribute("data-id");
      const colorDelete = event.target
        .closest("article")
        .getAttribute("data-color");
      const searchDeleteKanap = basketValue.find(
        (element) =>
          element.idSelectedProduct == idDelete &&
          element.colorSelectedProduct == colorDelete
      );
      basketValue = basketValue.filter((item) => item != searchDeleteKanap);
      localStorage.setitem("product", JSON.stringify(basketValue));
      const getSection = document.querySelector("#cart__items");
      getSection.removeChild(event.target.closest("article"));
      alert("article supprimé !");
      calculTotalQuantity();
      calculTotalPrice();
    });
  });
}
removeItem();

initialize();

async function initialize(){
  showBasket();
  removeItem();
  modifyQuantity();

  calculTotalQuantity();
  calculTotalPrice();
}
