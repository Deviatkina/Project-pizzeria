import {select, templates} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';

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

        //console.log('new Product:', thisProduct);
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

        thisProduct.amountWidgetElem.addEventListener('updated', function () {
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
        thisProduct.priceSingle = price;
        //console.log('cena pojedyncza', thisProduct.priceSingle);

        /* [NEW for inside event listener] multiply price by amount */
        price *= thisProduct.amountWidget.value;

        // update calculated price in the HTML
        thisProduct.priceElem.innerHTML = price;
    }
    addToCart() {
        const thisProduct = this;

        //  app.cart.add(thisProduct.prepareCartProduct());
        const event = new CustomEvent('add-to-cart', {
            bubbles: true,
            detail: {
                product: thisProduct.prepareCartProduct(),
            },
        }
        );
        thisProduct.element.dispatchEvent(event);
    }
    prepareCartProduct() {
        const thisProduct = this;

        const productParams = thisProduct.prepareCartProductParams();
        //console.log('productParams', productParams)

        const productSummary = {
            id: thisProduct.id,
            name: thisProduct.data.name,
            amount: thisProduct.amountWidget.value,
            priceSingle: thisProduct.priceSingle,
            price: thisProduct.priceSingle * thisProduct.amountWidget.value,
            //params: thisProduct.prepareCartProductParams,
            params: productParams,
        };
        return productSummary;
    }
    prepareCartProductParams() {
        const thisProduct = this;

        const formData = utils.serializeFormToObject(thisProduct.form);

        const params = {};

        // for very category (param)
        for (let paramId in thisProduct.data.params) {
            const param = thisProduct.data.params[paramId];

            // create category param in params const eg. params = { ingredients: { name: 'Ingredients', options: {}}}
            params[paramId] = {
                label: param.label,
                options: {}
            }

            // for every option in this category
            for (let optionId in param.options) {
                const option = param.options[optionId];
                const optionSelected = formData[paramId] && formData[paramId].includes(optionId);

                //cheking if this option selected in our form
                if (optionSelected) {
                    // option is selected!
                    params[paramId].options[optionId] = option.label;
                }
            }
        }
        return params;
    }
}
export default Product;