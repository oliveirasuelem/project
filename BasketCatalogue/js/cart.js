const cardContainer = document.getElementById("product-container");
const itemsElement = document.getElementById("items");
const priceElement = document.getElementById("price");
const emptyBasketElement = document.getElementById("empty-basket");
const totalCartElement = document.getElementById("total-cart");
const binBasketElement = document.getElementById("empty");


function createProductCard() {
    cardContainer.innerHTML = "";
    const products = JSON.parse(localStorage.getItem("products"));
    console.log(products)
    if (products && products.length > 0) {
        products.forEach(product => {
            const newProduct = document.createElement("div");
            newProduct.classList = "product-card";
            newProduct.innerHTML = `
            <img src="./img/products/${product.id}.jpg">
            <h3>${product.name}</h3>
            <h4>€${product.price}</h4>
            <div>
                <button class="card-button"> - </button>
                <span class="quantity"> ${product.quantity} </span>
                <button class="card-button"> + </button>
            </div>
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
    }
}
createProductCard();
updateTotals();

function updateTotals() {
    const prod = JSON.parse(localStorage.getItem("products"));
    let items = 0;
    let price = 0;
    if (prod && prod.length > 0) {
        prod.forEach(product => {
            items += product.quantity;
            price += product.price * product.quantity;
        });
        itemsElement.innerText = items;
        priceElement.innerText = price.toFixed(2);
    }
    showEmptyBasketMessage()
}

function showEmptyBasketMessage() {
    const products = JSON.parse(localStorage.getItem("products"));
    const hasProducts = products && products.length > 0;

    // Show emptyBasketElement only if there are no products
    if (emptyBasketElement) {
        emptyBasketElement.style.display = hasProducts ? 'none' : 'block';
    }

    // Adjust totalCartElement visibility accordingly
    if (totalCartElement) {
        totalCartElement.style.display = hasProducts ? 'block' : 'none';
    }
}

showEmptyBasketMessage();

binBasketElement.addEventListener("click", binBasket);
function binBasket() {
    localStorage.removeItem("products");
    updateTotals();
    createProductCard();
};

document.getElementById("buy").addEventListener("click", async () => {
    const res = await buyBasket();
    if (res) {
        binBasket();
        // Show the success page
        window.location.href = "http://127.0.0.1:5500/success-buy.html";
        // Wait for 5 seconds before redirecting
        setTimeout(() => {
            window.location.href = "http://127.0.0.1:5500/catalogue.html"; // Adjust the URL to your catalogue page as needed
        }, 5000); // 5000 milliseconds = 5 seconds
    }
})


