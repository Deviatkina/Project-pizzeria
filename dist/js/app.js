import { settings, select, classNames } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';


const app = {
  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#/', '');
    console.log('idFromHash', idFromHash);

    thisApp.activatePage(thisApp.pages[0].id);

    for (let link of thisApp.navLinks){
      link.addEventListener('click', function (event){
        const clickedElement = this;
        event.preventDefault();

        /* get page id from href attribute*/
        const id = clickedElement.getAttribute('href').replace('#', '');

        /* run thisApp.activatePage with that id*/
        thisApp.activatePage(id);

        /* change URL hash */ 
        window.location.hash = '#/' + id;
      }); 
    }

  },

  activatePage: function(pageId){
    const thisApp = this;

    /* add class 'active' to matching pages, remove from non-matching*/
    for (let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
    /*add class 'active' to matching links, remove from non-matching*/
    for (let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active, 
        link.getAttribute('href') == '#' + pageId);
    }
  },

  initBooking: function() {
    const thisApp = this;

    /* finding the contener for rezervation page*/
    thisApp.bookingWrapper = document.querySelector(select.containerOf.booking);

    

  },

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

    thisApp.initPages();

    thisApp.initData();

    /* Skasowano dla implementacji AJAX-a
    thisApp.initMenu();  */
    thisApp.initCart();

    thisApp.initBooking();

  },
};

app.init();