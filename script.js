function setIsLoadingOn() {
  const bodyDisplay = document.getElementsByTagName('body')[0];

  const div = document.createElement('div');
  div.setAttribute('class', 'loading');
  div.innerHTML = 'Loading...';

  bodyDisplay.appendChild(div);

  bodyDisplay.style.display = 'none';
}

function setIsLoadingOff() {
  const bodyDisplay = document.getElementsByTagName('body')[0];
  bodyDisplay.lastChild.remove();
  bodyDisplay.style.display = 'flex';
}

async function searchProducts() {
  try {
    setIsLoadingOn();
    const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
    const data = await fetch(url);
    const products = await data.json();
    setIsLoadingOff();
    return products.results;
  } catch (error) {
    console.log('Error: ', error.message);
  }
}

async function productDetails(id) {
  try {
    setIsLoadingOn();
    const url = `https://api.mercadolibre.com/items/${id}`;
    const data = await fetch(url);
    const product = await data.json();
    setIsLoadingOff();
    return product;
  } catch (error) {
    console.log('Error: ', error.message);
  }
}

async function sumCart() {
  let total = 0;
  document.getElementsByClassName('total-price')[0].innerHTML = total;
  const products = JSON.parse(localStorage.getItem('cart'));
  products.forEach(async (product) => {
    const { price } = await productDetails(product);
    total += price;
    document.getElementsByClassName('total-price')[0].innerHTML = total;
  });
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
  if (id) {
    const cartInLS = JSON.parse(localStorage.getItem('cart'));
    const updatedCart = cartInLS.filter((element) => element !== id);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  } else {
    localStorage.setItem('cart', JSON.stringify([]));
  }
}

function removeItemFromCart({ target }) {
  const id = target.innerHTML.split(' ')[1];
  target.remove();
  removeProductFromLocalStorage(id);
  sumCart();
}

function addInLocalStorage(item) {
  const cartInLS = JSON.parse(localStorage.getItem('cart'));
  if (!cartInLS) {
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

function clearCart() {
  const cartButton = document.getElementsByClassName('empty-cart')[0];
  cartButton.addEventListener('click', () => {
    const cartItems = document.getElementsByClassName('cart__items')[0];
    while (cartItems.firstChild) {
      cartItems.firstChild.remove();
    }
    removeProductFromLocalStorage();
    sumCart();
  });
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
  sumCart();
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
  clearCart();
};
