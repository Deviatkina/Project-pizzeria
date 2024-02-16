/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

const select = {
  templateOf: {
    menuProduct: '#template-menu-product',
    cartProduct: '#template-cart-product', // CODE ADDED
  },
  containerOf: {
    menu: '#product-list',
    cart: '#cart',
  },
  all: {
    menuProducts: '#product-list > .product',
    menuProductsActive: '#product-list > .product.active',
    formInputs: 'input, select',
  },
  menuProduct: {
    clickable: '.product__header',
    form: '.product__order',
    priceElem: '.product__total-price .price',
    imageWrapper: '.product__images',
    amountWidget: '.widget-amount',
    cartButton: '[href="#add-to-cart"]',
  },
  widgets: {
    amount: {
      input: 'input.amount', // CODE CHANGED
      linkDecrease: 'a[href="#less"]',
      linkIncrease: 'a[href="#more"]',
    },
  },
  // CODE ADDED START
  cart: {
    productList: '.cart__order-summary',
    toggleTrigger: '.cart__summary',
    totalNumber: `.cart__total-number`,
    totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
    subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
    deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
    form: '.cart__order',
    formSubmit: '.cart__order [type="submit"]',
    phone: '[name="phone"]',
    address: '[name="address"]',
  },
  cartProduct: {
    amountWidget: '.widget-amount',
    price: '.cart__product-price',
    edit: '[href="#edit"]',
    remove: '[href="#remove"]',
  },
  // CODE ADDED END
};

const classNames = {
  menuProduct: {
    wrapperActive: 'active',
    imageVisible: 'active',
  },
  // CODE ADDED START
  cart: {
    wrapperActive: 'active',
  },
  // CODE ADDED END
};

const settings = {
  amountWidget: {
    defaultValue: 1,
    defaultMin: 1,
    defaultMax: 9,
  }, // CODE CHANGED
  // CODE ADDED START
  cart: {
    defaultDeliveryFee: 20,
  },
  // CODE ADDED END
};

const templates = {
  menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  // CODE ADDED START
  cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
  // CODE ADDED END
};
  /*Dodajemy klasę Product*/
  class Product {
    constructor(id, data) {
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();

      thisProduct.getElements();

      thisProduct.initAccordion();
      thisProduct.initOrderForm();

      //[NEW] wywolujemy metodę initAmountWidget
      thisProduct.initAmountWidget();

      thisProduct.processOrder();

      console.log('new Product:', thisProduct);
    }
    renderInMenu() {
      const thisProduct = this;

      /* generate HTML based on template */
      const generatedHTML = templates.menuProduct(thisProduct.data);

      /* create element using utils.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);

      /* find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu);

      /* add element to menu */
      menuContainer.appendChild(thisProduct.element);
    }
    getElements() {
      const thisProduct = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);

      /*referencje do diva z obrazkami*/
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);

      /* [NEW] referencje dla nowej klasy AmountWidget*/
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);

    }

    initAccordion() {
      /*Dodanie metody initAccordion */
      const thisProduct = this;
      //console.log(thisProduct);

      /* find the clickable trigger (the element that should react to clicking) */
      const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);

      /* START: add event listener to clickable trigger on event click */
      clickableTrigger.addEventListener('click', function (event) {
        /*[lub powyższy kod może być zapisany tak 
        thisProduct.accordionTrigger.addEventListener('click', function(event) { ]*/
        /* prevent default action for event */
        event.preventDefault();
        /* find active product (product that has active class) */
        const activeProduct = document.querySelector('.product.active');

        /* if there is active product and it's not thisProduct.element, remove class active from it */
        if (activeProduct && activeProduct !== thisProduct.element) {
          activeProduct.classList.remove('active');
        }
        /* toggle active class on thisProduct.element */
        thisProduct.element.classList.toggle('active');
      });
    }
    initOrderForm() {
      const thisProduct = this;
      //console.log(thisProduct);

      thisProduct.form.addEventListener('submit', function (event) {
        event.preventDefault();
        thisProduct.processOrder();
      });

      for (let input of thisProduct.formInputs) {
        input.addEventListener('change', function () {
          thisProduct.processOrder();
        });
      }

      thisProduct.cartButton.addEventListener('click', function (event) {
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
      });
    }

    //[NEW to AmountWidget class]
    initAmountWidget() {
      const thisProduct = this;

      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);

      thisProduct.amountWidgetElem.addEventListener('updated', function() {
        thisProduct.processOrder();
      })
    }

    processOrder() {
      const thisProduct = this;

      // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
      const formData = utils.serializeFormToObject(thisProduct.form);
      //console.log('formData', formData);

      // set price to default price
      let price = thisProduct.data.price;

      // for every category (param)...
      for (let paramId in thisProduct.data.params) {
        // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
        const param = thisProduct.data.params[paramId];
        //console.log(paramId, param);

        // for every option in this category
        for (let optionId in param.options) {
          // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
          const option = param.options[optionId];
          //console.log(optionId, option);         

          //chekong if this option selected in our form
          if (formData[paramId] && formData[paramId].includes(optionId)) {
            // Option is selected, add its price to the total
            price += option.price;
          }

          //[NEW]finding the image with thr class .paramId-optionId in the div with the images
          const optionImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);
          //console.log(optionImage);

          if (optionImage) {
            //chekong if this option selected in our form
            if (formData[paramId] && formData[paramId].includes(optionId)) {
              optionImage.classList.add('active');
            }
            else {
              optionImage.classList.remove('active');
            }
          }
        }
      }
      /* [NEW for inside event listener] multiply price by amount */
      price *= thisProduct.amountWidget.value;

      //?? thisProduct.priceS = thisProduct.data.price;
      thisProduct.priceSingle = price;
        //console.log('cena pojedyncza', thisProduct.priceSingle);
      
      // update calculated price in the HTML
      thisProduct.priceElem.innerHTML = price;
   }
   addToCart() {
    const thisProduct = this;
    
    app.cart.add(thisProduct.prepareCartProduct());
   }
   prepareCartProduct(){
    const thisProduct = this;
    const productSummary = {
      id: thisProduct.id,
      name: thisProduct.data.name,
      amount: thisProduct.amountWidget.value,
      priceSingle: thisProduct.priceSingle,
      price: thisProduct.priceSingle*thisProduct.amountWidget.value,
      params: thisProduct.params,
    };
    //console.log(price);
    return productSummary; 
   }
  }
  //Dodanie kolejnej klasy (Moduł 9)
  //Klasa AmountWidget używana dla zmiany wartości/ilości produktów za pomocą inputa lub przycisków "+" i "-"
  class AmountWidget {
    constructor(element) {
      const thisWidget = this;

      thisWidget.getElements(element);
      thisWidget.setValue(thisWidget.input.value);

      console.log('AmountWidget:', thisWidget);
      console.log('constructor argument:', element);
      
      thisWidget.initActions();
      thisWidget.announce();

    }
    getElements(element) {
      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }

    setValue(value) {
      const thisWidget = this;

      const newValue = parseInt(value);

      /*Done : Add validation*/
      if (thisWidget.value !== newValue && !isNaN(newValue) && newValue <= settings.amountWidget.defaultMax && newValue >= settings.amountWidget.defaultMin) {
        thisWidget.value = newValue;
      }

      if (thisWidget.value)
        thisWidget.input.value = thisWidget.value;
      else {
        thisWidget.input.value = settings.amountWidget.defaultValue;
        thisWidget.value = settings.amountWidget.defaultValue;
      }
      thisWidget.announce();

    }
    initActions() {
      const thisWidget = this;
      
      thisWidget.input.addEventListener('change', function () {
        thisWidget.setValue(thisWidget.input.value);
        console.log('Liczba została zmieniona', thisWidget.input.value);
      });
      thisWidget.linkDecrease.addEventListener('click', function(){
        thisWidget.setValue(thisWidget.value - 1);
        console.log('link Decrease');
      });
      thisWidget.linkIncrease.addEventListener('click', function(){
        thisWidget.setValue(thisWidget.value + 1);
        console.log('link Increase');
      });
    }

      announce() {
        const thisWidget = this;
  
        const event = new Event('updated');
        thisWidget.element.dispatchEvent(event);
    }
  }
/* Dodawanie klasy Cart (dla utworzenia koszyka)*/
class Cart{
  constructor(element){
    const thisCart = this;
    thisCart.products = [];
    thisCart.getElements(element);
    thisCart.initActions();
    console.log('thisCart', thisCart);
  }
  getElements(element){
    const thisCart = this;
    thisCart.dom = {};
    thisCart.dom.wrapper = element;

    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
  }
  initActions(){
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function(event) {
      event.preventDefault();
      thisCart.dom.wrapper.classList.toggle('active');
    });
  }
  add(menuProduct){
    //const thisCart = this;
    const thisCart = this;
    thisCart.products.push(menuProduct);
    console.log('adding product', menuProduct);
  }
}
  const app = {
    initMenu: function() { /*Dodano instancje do każdego elementu z klasy Product*/
      const thisApp = this;
      console.log('thisApp.data:', thisApp.data);

      for (let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
    }
  },
    initCart: function() { /*Dodano instancja do klasy Cart (Koszyk) */
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);
  },
   
    /*Część kodu, która będzie potem odpowiadała za wczytywanie informacji o produktach do aplikacji z serwera*/
    initData: function() {
      const thisApp = this;

      thisApp.data = dataSource;
    },
    init: function() {
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();

      thisApp.initMenu();

      thisApp.initCart();
    },
    
};

  app.init();
}
