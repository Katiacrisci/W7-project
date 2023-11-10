const URL = "https://striveschool-api.herokuapp.com/api/product";
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTRkMzdmODI1NGU4ODAwMTgzZjE4NDEiLCJpYXQiOjE2OTk1NTk0MTYsImV4cCI6MTcwMDc2OTAxNn0.7-H9JvGlqFGz6CjycV_QqjLJxSS5TIoMOcOc4TYrFN4";

const form = document.querySelector("form");

form.addEventListener("submit", async ev => {
  ev.preventDefault();
  const productObj = Object.fromEntries(new FormData(ev.target));
  productObj.price = parseInt(productObj.price);

  const success = await createProduct(productObj);
  if (success) {
    form.reset();
    getAllProducts().then(products => {
      products.forEach(product => {
        document.getElementById("myGrid").innerHTML += populateCard(product);
      });
    });
  }
});

const createProduct = async product => {
  console.log("payload", JSON.stringify(product));

  const resp = await fetch(`${URL}/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(product)
  });
  return resp.ok;
};

const populateCard = product => `<div class="col mb-4">
                          <div class="card mb-4 shadow-sm h-100">
                          <img src=${product.imageUrl} class="card-img-top" style="height: 200px; object-fit: cover; cursor: pointer" onclick="goToDetails(${product._id})">
                            <div class="card-body d-flex flex-column">
                              <h5 class="card-title">${product.name}</h5>
                                <div
                                  class="d-flex justify-content-between align-items-center"
                                >
                                  <div class="btn-group">
                                    <button
                                      type="button"
                                      class="btn btn-sm btn-outline-secondary"
                                    >
                                      View
                                    </button>
                                    <button
                                      type="button"
                                      class="btn btn-sm btn-outline-secondary"
                                    >
                                      Hide
                                    </button>
                                  </div>
                                  <small class="text-muted">${product.price},00€</small>
                              </div>
                            </div>
                          </div>
                        </div>`;

const getAllProducts = async () => {
  const products = await fetch(URL, {
    headers: { Authorization: `Bearer ${TOKEN}` }
  });

  return products.json();
};

window.onload = () => {
  getAllProducts().then(products => {
    products.forEach(product => {
      document.getElementById("myGrid").innerHTML += populateCard(product);
    });
  });
}
