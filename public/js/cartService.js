function addToBasket(product) {
    const memory = JSON.parse(localStorage.getItem("products"));
    let count = 0;
    if (!memory) {
        const newProduct = getNewProductForMemory(product);
        localStorage.setItem("products", JSON.stringify([newProduct]));
        count = 1;
    } else {
        const productIndex = memory.findIndex(item => item.id === product.id);
        if (productIndex === -1) {
            memory.push(getNewProductForMemory(product));
            count = 1;
        } else {
            memory[productIndex].quantity++;
            count = memory[productIndex].quantity;
        }
        localStorage.setItem("products", JSON.stringify(memory));
    }
    updateBasketNumber();
    return count;
}

function removeFromBasket(product) {
    const memory = JSON.parse(localStorage.getItem("products"));
    const productIndex = memory.findIndex(item => item.id === product.id);
    if (memory[productIndex].quantity === 1) {
        memory.splice(productIndex, 1);
    } else {
        memory[productIndex].quantity--;
    }
    localStorage.setItem("products", JSON.stringify(memory));
    updateBasketNumber();
}

function getNewProductForMemory(product) {
    const newProduct = { ...product, quantity: 1 }; // Include quantity property
    return newProduct;
}

const totalCounterElement = document.getElementById("cart-counter");
function updateBasketNumber() {
    const memory = JSON.parse(localStorage.getItem("products"));
    if (memory && memory.length > 0) {
        const count = memory.reduce((acum, current) => acum + current.quantity, 0);
        totalCounterElement.innerText = count;
    } else {
        totalCounterElement.innerText = 0;
    }
}

updateBasketNumber();
