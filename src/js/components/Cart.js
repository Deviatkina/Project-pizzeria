import {settings, select, templates } from '../settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';


/* Dodawanie klasy Cart (dla utworzenia koszyka)*/
class Cart {
    constructor(element) {
        const thisCart = this;
        thisCart.products = [];
        thisCart.getElements(element);
        thisCart.initActions();
        //console.log('thisCart', thisCart);
    }
    getElements(element) {
        const thisCart = this;
        thisCart.dom = {};
        thisCart.dom.wrapper = element;

        thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);

        thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
        thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
        thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
        thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
        thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);

        //Added code for "Order"
        thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);

        thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
        thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
    }
    initActions() {
        const thisCart = this;
        thisCart.dom.toggleTrigger.addEventListener('click', function (event) {
            event.preventDefault();
            thisCart.dom.wrapper.classList.toggle('active');
        });
        thisCart.dom.productList.addEventListener('updated', function () {
            thisCart.update();
        });

        thisCart.dom.productList.addEventListener('remove', function (event) {
            const cartProductToDelete = event.detail.cartProduct;

            // usuniecie elementu z HTML-a
            cartProductToDelete.dom.wrapper.remove();

            // usuniecie tego produktu z koszyka
            const index = thisCart.products.indexOf(cartProductToDelete);
            thisCart.products.splice(index, 1);

            thisCart.update();
        });

        //dodajemy nasłuchiwacza do 'submit'
        thisCart.dom.form.addEventListener('submit', function (event) {
            event.preventDefault();

            thisCart.sendOrder();

        })
    }
    add(menuProduct) {
        const thisCart = this;

        /* generate HTML based on template */
        const generatedHTML = templates.cartProduct(menuProduct);

        /* create element using utils.createElementFromHTML */
        thisCart.element = utils.createDOMFromHTML(generatedHTML);

        /* find menu container */
        const cartContainer = document.querySelector(select.cart.productList);

        /* add element to menu */
        cartContainer.appendChild(thisCart.element);

        thisCart.products.push(new CartProduct(menuProduct, thisCart.element));

        thisCart.update();
        console.log('thisCart.products', thisCart.products);
    }

    update() {
        const thisCart = this;

        thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
        thisCart.totalNumber = 0;
        thisCart.subtotalPrice = 0;

        for (const cartProduct of thisCart.products) {
            thisCart.subtotalPrice = thisCart.subtotalPrice + cartProduct.price;
            thisCart.totalNumber = thisCart.totalNumber + cartProduct.amount;
        }
        if (thisCart.totalNumber > 0) {
            thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
        } else {
            thisCart.totalPrice = 0;
            thisCart.deliveryFee = 0;
        }

        thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
        thisCart.dom.totalPrice[0].innerHTML = thisCart.totalPrice;
        thisCart.dom.totalPrice[1].innerHTML = thisCart.totalPrice;
        thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
        thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
    }

    sendOrder() {

        const thisCart = this;

        const url = settings.db.url + '/' + settings.db.orders;

        // kod dla Order
        const payload = {
            address: thisCart.dom.address.value,
            phone: thisCart.dom.phone.value,
            totalPrice: thisCart.totalPrice,
            subtotalPrice: thisCart.subtotalPrice,
            totalNumber: thisCart.totalNumber,
            deliveryFee: thisCart.deliveryFee,
        }
        payload.products = [];

        for (let prod of thisCart.products) {
            payload.products.push(prod.getData());
        }

        if (payload.address.length === 0 || payload.phone.length === 0 || payload.products.length === 0){
            alert("Uzupełnij informacje dla zamówienia!")
        } else {

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        };

        fetch(url, options)
            .then(function () {
                alert('Zamówienie zostało złożone!');
            })
        }
    }

}
export default Cart;