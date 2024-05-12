const cardContainer = document.getElementById("product-container");
const itemsElement = document.getElementById("items");
const priceElement = document.getElementById("price");
const totalCartElement = document.getElementById("total-cart");
const emptyCartElement = document.getElementById("empty");

function createProductCard() {
    cardContainer.innerHTML = "";
    const products = JSON.parse(localStorage.getItem("products"));
    if (products && products.length > 0) {
        products.forEach(product => {
            const newProduct = document.createElement("div");
            newProduct.classList = "product-card";
            newProduct.innerHTML = `
                <img src="/img/products/${product.id}.jpg">
                <h3>${product.name}</h3>
                <h4>€${product.price.toFixed(2)}</h4>
                <div>
                    <button class="card-button"> - </button>
                    <span class="quantity"> ${product.quantity} </span>
                    <button class="card-button"> + </button>
                </div>
                <a href="${product.descriptionUrl}" class="card-button">Product detail</a> <!-- Link to product detail page -->
            `;
            cardContainer.appendChild(newProduct);
            newProduct
                .getElementsByTagName("button")[1]
                .addEventListener("click", (e) => {
                    const itemTotal = e.target.parentElement.getElementsByTagName("span")[0];
                    itemTotal.innerText = addToBasket(product);
                    updateTotals();
                });

            newProduct
                .getElementsByTagName("button")[0]
                .addEventListener("click", (e) => {
                    removeFromBasket(product)
                    createProductCard();
                    updateTotals();
                });
        });
    } else {
        showEmptyBasketMessage();
    }
}

function updateTotals() {
    const prod = JSON.parse(localStorage.getItem("products"));
    let items = 0;
    let price = 0;
    if (prod && prod.length > 0) {
        prod.forEach(product => {
            items += product.quantity;
            price += product.price * product.quantity;
        });
        // Format the price to two decimal places
        price = price.toFixed(2);
    }
    itemsElement.innerText = items;
    priceElement.innerText = price; // Ensure the euro symbol is added only once
    
    if (prod && prod.length > 0) {
        totalCartElement.classList.remove("hide");
    } else {
        totalCartElement.classList.add("hide");
        showEmptyBasketMessage();
    }
}
emptyCartElement.addEventListener("click",emptyCart);
function emptyCart(){
  localStorage.removeItem("products");
  updateTotals();
  createProductCard();
  updateBasketNumber();
}

function showEmptyBasketMessage() {
    // Check if the empty basket message already exists
    let existingEmptyMessage = document.getElementById("empty-basket");
    if (!existingEmptyMessage) {
        const emptyBasketElement = document.createElement("p");
        emptyBasketElement.id = "empty-basket";
        emptyBasketElement.textContent = "Oops! There are no products in the Basket. ";
        const shopLink = document.createElement("a");
        shopLink.href = "/catalogue";
        shopLink.textContent = "Shop here";
        emptyBasketElement.appendChild(shopLink);
        cardContainer.appendChild(emptyBasketElement);
    }
}

createProductCard();
updateTotals();
