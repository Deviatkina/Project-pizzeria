import { settings } from '../settings.js';

class BaseWidget {
    constructor(wrapperElement, initialValue) {
        const thisWidget = this;

        thisWidget.dom = {};
        thisWidget.dom.wrapper = wrapperElement;

        thisWidget.value = initialValue;
    }

    setValue(value) {
        const thisWidget = this;

        const newValue = thisWidget.parseValue(value);

        if (thisWidget.value !== newValue && thisWidget.isValid(newValue)) {
            thisWidget.value = newValue;
            thisWidget.announce();
        } else {
            thisWidget.dom.input.value = settings.amountWidget.defaultValue;
            thisWidget.value = settings.amountWidget.defaultValue;
        }
    
        thisWidget.renderValue();
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
