async function getProducts(){
    const res = await fetch("http://localhost:3000/products");
    const resJson=await res.json();
    return resJson;
}
