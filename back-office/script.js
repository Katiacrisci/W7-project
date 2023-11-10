const URL = "https://striveschool-api.herokuapp.com/api/product";
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTRkMzdmODI1NGU4ODAwMTgzZjE4NDEiLCJpYXQiOjE2OTk1NTk0MTYsImV4cCI6MTcwMDc2OTAxNn0.7-H9JvGlqFGz6CjycV_QqjLJxSS5TIoMOcOc4TYrFN4";

const form = document.querySelector("form");
const resetBtn = document.querySelector(".btn-warning");
resetBtn.onclick = () => {
  form.reset();
  stopEditing();
};

const editMode = { status: false, updatingId: undefined };
const stopEditing = () => {
  editMode.status = false;
  editMode.updatingId = undefined;
  document.getElementById("formMode").innerText = "Create a new Product";
};

const getStoredProducts = () => {
  return JSON.parse(localStorage.getItem("products"));
};

const updateInMemoryProducts = (...products) => {
  const inMemoryProducts = getStoredProducts() ?? [];
  localStorage.setItem(
    "products",
    JSON.stringify([...inMemoryProducts, ...products])
  );
};

form.addEventListener("submit", async ev => {
  ev.preventDefault();
  const productObj = Object.fromEntries(new FormData(ev.target));
  productObj.price = parseInt(productObj.price);

  if (editMode.status) {
    productObj._id = editMode.updatingId;
  }

  const success = await createOrUpdateProduct(productObj);
  if (success) {
    form.reset();

    updateInMemoryProducts(productObj);
    loadProducts(editMode.status);
    stopEditing();
  }
});

const createOrUpdateProduct = async product => {
  console.log("payload", JSON.stringify(product));

  const id = product._id;

  const resp = await fetch(`${URL}/${id ?? ""}`, {
    method: id ? "PUT" : "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(product)
  });
  return resp.ok;
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
            Edit
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

const getAllProducts = async () => {
  const products = await fetch(URL, {
    headers: { Authorization: `Bearer ${TOKEN}` }
  });

  return products.json();
};

const loadProducts = (fromUpdate) => {
  if (fromUpdate) {
    document.getElementById("myGrid").innerHTML = "";
  }
  getAllProducts().then(products => {
    localStorage.setItem("products", JSON.stringify(products));

    populateCards(products);
  });
};

const editProd = event => {
  const id = event.currentTarget.parentElement.children[1].id;

  const product = getStoredProducts().find(p => p._id === id);

  editMode.status = true;
  editMode.updatingId = product._id;

  document.getElementById(
    "formMode"
  ).innerText = `Edit Product "${product.name}"`;

  form.scrollIntoView({ behavior: "smooth" });

  document.getElementById("inputName").value = product.name;
  document.getElementById("inputBrand").value = product.brand;
  document.getElementById("inputDesc").value = product.description;
  document.getElementById("inputImg").value = product.imageUrl;
  document.getElementById("inputPrice").value = product.price;
};

const deleteProduct = async id => {
  const resp = await fetch(`${URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${TOKEN}` }
  });
  return resp.ok;
};

const deleteProd = event => {
  const id = event.currentTarget.id;
  deleteProduct(id)
    .then(success => {
      if (success) {
        event.target.closest(".col").remove();
      }
    })
    .catch(console.error);
};

window.onload = () => {
  const products = getStoredProducts() ?? [];
  if (products.length > 0) {
    populateCards(products);
  } else {
    loadProducts(false);
  }
};
