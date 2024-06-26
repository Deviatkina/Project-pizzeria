import {select} from '../settings.js';

import AmountWidget from './AmountWidget.js';


class CartProduct {

    constructor(menuProduct, element) {
        const thisCartProduct = this;

        thisCartProduct.id = menuProduct.id;
        thisCartProduct.name = menuProduct.name;
        thisCartProduct.amount = menuProduct.amount;
        thisCartProduct.price = menuProduct.price;
        thisCartProduct.priceSingle = menuProduct.priceSingle;
        thisCartProduct.params = menuProduct.params;

        thisCartProduct.getElements(element);
        thisCartProduct.initAmountWidget();
        thisCartProduct.initActions();

        console.log('new Cart Product', thisCartProduct);
    }
    getElements(element) {
        const thisCartProduct = this;
        thisCartProduct.dom = {};
        thisCartProduct.dom.wrapper = element;

        thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);

        thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);

        thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);

        thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);

        //console.log('thisCartProduct', thisCartProduct);
    }

    initAmountWidget() {
        const thisCartProduct = this;

        thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);
        thisCartProduct.dom.amountWidget.addEventListener('updated', function () {
            thisCartProduct.amount = thisCartProduct.amountWidget.value;
            thisCartProduct.price = thisCartProduct.amount * thisCartProduct.priceSingle;
            thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
        });
    }
    remove() { //metoda do usuwania elementu z koszyka
        const thisCartProduct = this;

        const event = new CustomEvent('remove', {
            bubbles: true,
            detail: {
                cartProduct: thisCartProduct,
            },
        });
        thisCartProduct.dom.wrapper.dispatchEvent(event);
        //console.log('remove', thisCartProduct);
    }
    initActions() {
        const thisCartProduct = this;

        thisCartProduct.dom.edit.addEventListener('click', function (event) {
            event.preventDefault();
            thisCartProduct.edit;
        });

        thisCartProduct.dom.remove.addEventListener('click', function (event) {
            event.preventDefault();
            thisCartProduct.remove();
        });
    }

    getData() {
        const thisCartProduct = this;

        const payload = {
            id: thisCartProduct.id,
            amount: thisCartProduct.amount,
            price: thisCartProduct.price,
            priceSingle: thisCartProduct.priceSingle,
            name: thisCartProduct.name,
            params: thisCartProduct.params,
        };

        return payload;

    }
}
export default CartProduct;