const cardContainer=document.getElementById("product-container");

function createProductCard(products) {
    products.forEach(product => {
        const newProduct = document.createElement("div");
        newProduct.classList.add("product-card");
        newProduct.innerHTML = `
            <img src="${product.urlImg}">
            <h3>${product.name}</h3>
            <p>€${product.price}</p>
            <button class="card-button">Add to cart</button> 
            <button class="card-button detail-button">Product detail</button>
        `;
        cardContainer.appendChild(newProduct);

        // Event listener for adding to cart
        newProduct.getElementsByClassName("card-button")[0].addEventListener("click", () => addToBasket(product));
        
        // Event listener for product detail button
        const detailButton = newProduct.getElementsByClassName("detail-button")[0];
        detailButton.addEventListener("click", () => {
            // Adjust the URL to match the path from the server root to the product detail pages
            window.location.href = `/descriptiongallery/${product.id}.html`;
        });
    }); 
}
getProducts().then (products=>{
    createProductCard(products);
})
