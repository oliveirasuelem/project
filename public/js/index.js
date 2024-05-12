const cardContainer = document.getElementById("product-container");

function createProductCard(products) {
    products.forEach(product => {
        const newProduct = document.createElement("div");
        newProduct.classList = "product-card";
        newProduct.innerHTML = `
            <img src="./images/${product.img}">
            <h3>${product.name}</h3>
            <p>€${product.price}</p>
            <button class="card-button">Add to cart</button> 
            <a href="${product.descriptionUrl}" class="card-button">Product detail</a>
        `;
        cardContainer.appendChild(newProduct);
        newProduct.getElementsByClassName("card-button")[0].addEventListener("click", () => addToBasket(product));
    }); 
}
createProductCard(products);
