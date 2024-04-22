import {settings, select} from '../settings.js';


//Dodanie kolejnej klasy (Moduł 9)
//Klasa AmountWidget używana dla zmiany wartości/ilości produktów za pomocą inputa lub przycisków "+" i "-"
class AmountWidget {
    constructor(element) {
        const thisWidget = this;

        thisWidget.getElements(element);
        thisWidget.setValue(thisWidget.input.value);

        //console.log('AmountWidget:', thisWidget);
        //console.log('constructor argument:', element);

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
        thisWidget.linkDecrease.addEventListener('click', function () {
            thisWidget.setValue(thisWidget.value - 1);
            console.log('link Decrease');
        });
        thisWidget.linkIncrease.addEventListener('click', function () {
            thisWidget.setValue(thisWidget.value + 1);
            console.log('link Increase');
        });
    }

    announce() {
        const thisWidget = this;

        const event = new CustomEvent('updated', {
            bubbles: true
        });
        thisWidget.element.dispatchEvent(event);
    }
}
export default AmountWidget;