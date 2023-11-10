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
      id="${product._id}"
      src="${product.imageUrl}"
      class="card-img-top"
      style="height: 200px; object-fit: cover; cursor: pointer"
      onclick="seeDetails(event)"
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
            Edit
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

const editProd = event => {
  const id = event.currentTarget.parentElement.parentElement.parentElement.parentElement.children[0].id;
  window.location.assign("../back-office/back-office.html?prodId=" + id);
}

const seeDetails = event => {
  const id = event.currentTarget.id;
  window.location.assign("../detail/detail.html?prodId=" + id);
}

window.onload = () => {
  const products = getStoredProducts() ?? [];
  if (products.length > 0) {
    populateCards(products);
  } else {
    loadProducts(false);
  }
};
