function addToBasket(product){
    const memory=JSON.parse(localStorage.getItem("products"));
    console.log(memory);
    let count=0;
    if(!memory){
        const newProduct=getNewProductForMemory(product);
        localStorage.setItem("products", JSON.stringify([newProduct]));
        // need to use JSON.stingify to convert the array/object products into a string as the memory cannot store objects
        count=1;
    } else{
        const productIndex= memory.findIndex(item=>item.id === product.id);
        console.log (productIndex)
        const newMemory= memory;
        if(productIndex === -1){
           newMemory.push(getNewProductForMemory(product))
           count=1;
        }
        else{
            newMemory[productIndex].quantity ++;
            count=newMemory[productIndex].quantity;
        }
        localStorage.setItem("products", JSON.stringify(newMemory));
        
    }
    updateBasketNumber();
    return count;
}

function removeFromBasket(product){
    const memory=JSON.parse(localStorage.getItem("products"));
    const productIndex= memory.findIndex(item=>item.id === product.id);
    if (memory[productIndex].quantity===1){
        memory.splice(productIndex,1);
    }else{
        memory[productIndex].quantity--;
    }
    localStorage.setItem("products", JSON.stringify(memory));
    updateBasketNumber();
}
function getNewProductForMemory(product){
    const newProduct=product;
    newProduct.quantity=1;
    return newProduct;
}
const totalCounterElement= document.getElementById("cart-counter");
function updateBasketNumber(){
    const memory=JSON.parse(localStorage.getItem("products"));
    if(memory && memory.length>0){
        const count=memory.reduce((acum, current) => acum+current.quantity,0);
        totalCounterElement.innerText=count;
        console.log(count)
    }else{
        totalCounterElement.innerText=0;
    }
}
async function buyBasket(){
    const basket = JSON.parse(localStorage.getItem("products"));
    if(basket && basket.length > 0){
      const res = await fetch("http://localhost:3000/basket/buy",{
        method:"POST",
        body: JSON.stringify(basket),
        headers: {
          "Content-Type": "application/json"
        }
      })
      return res.ok;
    }
    return false;
  }
  
updateBasketNumber();