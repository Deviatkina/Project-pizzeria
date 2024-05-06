import { settings, select } from '../settings.js';
import BaseWidget from './BaseWidget.js';


//Dodanie kolejnej klasy (Moduł 9)
//Klasa AmountWidget używana dla zmiany wartości/ilości produktów za pomocą inputa lub przycisków "+" i "-"
class AmountWidget extends BaseWidget {
    constructor(element) {
        super(element, settings.amountWidget.defaultValue); 
        /* super oznacza konstruktor klasy BaseWidget 
            1-szy argument (element) - to wrapper, czyli element przekazany klasie AmountWidget
            2-gi argument (settings.amountWidget.defaultValue) - to początkowa wrtość widgetu */
        const thisWidget = this;

        thisWidget.getElements();

        thisWidget.initActions();
        
        //console.log('AmountWidget:', thisWidget);
        //console.log('constructor argument:', element);

    }
    getElements() {
        const thisWidget = this;

        thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
        thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
        thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
    }

    isValid(value) {
        return !isNaN(value) //sprawdzamy czy przekazana wartość jest nie liczbą
            && value <= settings.amountWidget.defaultMax
            && value >= settings.amountWidget.defaultMin;

            
    }

    renderValue() {
        const thisWidget = this;

        thisWidget.dom.input.value = thisWidget.value;
    }

    initActions() {
        const thisWidget = this;

        thisWidget.dom.input.addEventListener('change', function () {
            thisWidget.setValue(thisWidget.dom.input.value);
            console.log('Liczba została zmieniona', thisWidget.dom.input.value);
        });
        thisWidget.dom.linkDecrease.addEventListener('click', function () {
            thisWidget.setValue(thisWidget.value - 1);
            console.log('link Decrease');
        });
        thisWidget.dom.linkIncrease.addEventListener('click', function () {
            thisWidget.setValue(thisWidget.value + 1);
            console.log('link Increase');
        });
    }
}
export default AmountWidget;