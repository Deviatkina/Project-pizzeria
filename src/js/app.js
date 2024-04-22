import { settings, select, classNames } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';

const app = {
  initMenu: function () { /*Dodano instancje do każdego elementu z klasy Product*/
    const thisApp = this;
    //console.log('thisApp.data:', thisApp.data);

    for (let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },
  initCart: function () { /*Dodano instancja do klasy Cart (Koszyk) */
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product)
    });
  },

  /*Część kodu, która będzie potem odpowiadała za wczytywanie informacji o produktach do aplikacji z serwera*/
  initData: function () {
    const thisApp = this;

    thisApp.data = {};

    const url = settings.db.url + '/' + settings.db.products;

    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        console.log('parsedResponse', parsedResponse);

        /* save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;

        /* execute initMenu methos */
        thisApp.initMenu();
      });

    console.log('thisApp.data', JSON.stringify(thisApp.data));
  },
  init: function () {
    const thisApp = this;
    console.log('*** App starting ***');
    console.log('thisApp:', thisApp);
    console.log('classNames:', classNames);
    console.log('settings:', settings);
    //console.log('templates:', templates);

    thisApp.initData();

    /* Skasowano dla implementacji AJAX-a
    thisApp.initMenu();  */
    thisApp.initCart();
  },
};

app.init();