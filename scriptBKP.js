async function searchProducts(url) {
  try {
    const data = await fetch(url);
    const products = await data.json();
    if (!products) return []; 
    return products.results;
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function showProduct(product) {
  const section = document.getElementsByClassName('items')[0];
  section.appendChild(product);
}

async function getProductsList() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  const productsList = await searchProducts(url);
  
  productsList.forEach((product) => {
    const productInfo = { sku: product.id, name: product.title, image: product.thumbnail };
    showProduct(createProductItemElement(productInfo));
  });
}

window.onload = () => {
  getProductsList();
};
