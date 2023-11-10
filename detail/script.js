const getStoredProducts = () => {
  return JSON.parse(localStorage.getItem("products"));
};

const populateProductDetails = product => `
        <h1 class="text-center">${product.name}</h1>
        <h3 class="text-center">by ${product.brand}™</h3>
        <div id="img-content" class="d-flex flex-column">
          <img src="${product.imageUrl}" class="img-fluid" />
        </div>
        <h4 class="py-3">${product.description}</h4>
        <div class="d-flex justify-content-end">
          <h5>Starting at</h5>
        </div>
        <div class="d-flex justify-content-end">
          <h5>${product.price},00€</h5>
        </div>
`;

window.onload = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get("prodId");

  const product = getStoredProducts().find(p => p._id === id);

  document.querySelector(".container").innerHTML += populateProductDetails(product);
};
