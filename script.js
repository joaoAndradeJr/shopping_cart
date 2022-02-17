async function searchProducts() {
  try {
    const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
    const data = await fetch(url);
    const products = await data.json();
    return products.results;
  } catch (error) {
    console.log('Error: ', error.message);
  }
}

async function productDetails(id) {
  try {
    const url = `https://api.mercadolibre.com/items/${id}`;
    const data = await fetch(url);
    const product = await data.json();
    return product;
  } catch (error) {
    console.log('Error: ', error.message);
  }
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function removeProductFromLocalStorage(id) {
  const cartInLS = JSON.parse(localStorage.getItem('cart'));
  const updatedCart = cartInLS.filter((element) => element !== id);
  localStorage.setItem('cart', JSON.stringify(updatedCart));
}

function removeItemFromCart({ target }) {
  const id = target.innerHTML.split(' ')[1];
  target.remove();
  removeProductFromLocalStorage(id);
}

function addInLocalStorage(item) {
  const cartInLS = JSON.parse(localStorage.getItem('cart'));
  if (!cartInLS || cartInLS.lenght === 0) {
    const cart = [item];
    localStorage.setItem('cart', JSON.stringify(cart));
  } else {
    const alreadyInLS = cartInLS.find((element) => element === item);
    if (!alreadyInLS) {
      cartInLS.push(item);
      localStorage.setItem('cart', JSON.stringify(cartInLS));
    }
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.dataset.sku = sku;
  li.addEventListener('click', (event) => removeItemFromCart(event));
  return li;
}

async function addItemToCart(id) {
  const data = await productDetails(id);
  const { id: sku, title: name, price: salePrice } = data;
  const mountedItem = createCartItemElement({ sku, name, salePrice });
  const selected = document.querySelector('.cart__items');
  selected.appendChild(mountedItem);
  addInLocalStorage(sku);
}

function getProductsFromLocalStorage() {
  const cart = JSON.parse(localStorage.getItem('cart'));
  if (cart) {
    cart.forEach(async (item) => addItemToCart(item));
  }
}

function showProduct(product) {
  const section = document.getElementsByClassName('items')[0];
  const productId = product.firstChild.innerText;
  product.lastChild.addEventListener('click', () => addItemToCart(productId));
  section.appendChild(product);
}

async function getProductsList() {
  const productsList = await searchProducts();

  productsList.forEach((product) => {
    const productInfo = { sku: product.id, name: product.title, image: product.thumbnail };
    const mountedProduct = createProductItemElement(productInfo);
    showProduct(mountedProduct);
  });
  getProductsFromLocalStorage();
}

window.onload = () => {
  getProductsList();
};
