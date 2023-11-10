const URL = "https://striveschool-api.herokuapp.com/api/product/";
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTRkMzdmODI1NGU4ODAwMTgzZjE4NDEiLCJpYXQiOjE2OTk1NTk0MTYsImV4cCI6MTcwMDc2OTAxNn0.7-H9JvGlqFGz6CjycV_QqjLJxSS5TIoMOcOc4TYrFN4";

const getStoredProducts = () => {
  return JSON.parse(localStorage.getItem("products"));
};

const populateCard = product => `
<div class="col mb-4">
  <div class="card mb-4 shadow-sm h-100">
    <img
      src="${product.imageUrl}"
      class="card-img-top"
      style="height: 200px; object-fit: cover; cursor: pointer"
    />
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">${product.name}</h5>
      <div
        class="d-flex justify-content-between align-items-center"
      >
        <div class="btn-group">
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            onclick="editProd(event)"
          >
            Find out more
          </button>
          <button
            id="${product._id}"
            type="button"
            class="btn btn-sm btn-outline-danger ms-4"
            onclick="deleteProd(event)"
          >
            Delete
          </button>
        </div>
        <small class="text-muted">${product.price},00€</small>
      </div>
    </div>
  </div>
</div>
`;

const populateCards = products => {
  products.forEach(product => {
    document.getElementById("myGrid").innerHTML += populateCard(product);
  });
};

const loadProducts = fromUpdate => {
  if (fromUpdate) {
    document.getElementById("myGrid").innerHTML = "";
  }
  getAllProducts().then(products => {
    localStorage.setItem("products", JSON.stringify(products));

    populateCards(products);
  });
};

window.onload = () => {
  const products = getStoredProducts() ?? [];
  if (products.length > 0) {
    populateCards(products);
  } else {
    loadProducts(false);
  }
};
