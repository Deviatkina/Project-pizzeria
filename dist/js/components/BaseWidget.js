import { settings } from '../settings.js';

class BaseWidget {
    constructor(wrapperElement, initialValue) {
        const thisWidget = this;

        thisWidget.dom = {};
        thisWidget.dom.wrapper = wrapperElement;

        thisWidget.correctValue = initialValue;
    }

    get value(){
        const thisWidget = this;

        return thisWidget.correctValue;
    }
    set value(value) {
        const thisWidget = this;

        const newValue = thisWidget.parseValue(value);

        if (thisWidget.correctValue !== newValue && thisWidget.isValid(newValue)) {
            thisWidget.correctValue = newValue;
            thisWidget.announce();
        } else {
            thisWidget.dom.input.value = settings.amountWidget.defaultValue;
            thisWidget.correctValue = settings.amountWidget.defaultValue;
        }
    
        thisWidget.renderValue();
    }

    setValue(value){
        const thisWidget = this;
        thisWidget.value = value;
    }

    parseValue(value) {
        /* ta metoda wykorzystywana do przeksztalcenia wrtości, którą chcemy ustawić na odpowiedni typ lub format*/
        return parseInt(value);
    }

    isValid(value) {
        return !isNaN(value) //sprawdzamy czy przekazana wartość jest nie liczbą
    }

    renderValue() {
        const thisWidget = this;

        thisWidget.dom.wrapper.innerHTML = thisWidget.value;
    }

    announce() {
        const thisWidget = this;

        const event = new CustomEvent('updated', {
            bubbles: true
        });
        thisWidget.dom.wrapper.dispatchEvent(event);
    }
}
export default BaseWidget;
