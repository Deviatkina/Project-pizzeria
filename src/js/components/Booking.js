//import AmountWidget from './AmountWidget.js';
//import {select} from '../settings.js';


class Booking{
    constructor (bookingWrapper){
        const thisBooking = this;

        thisBooking.wrapper = bookingWrapper;

        thisBooking.render(bookingWrapper);
        thisBooking.initWidgets();

        console.log('new Booking:', thisBooking);
    }

    /*
    getElements(bookingWrapper){
        thisBooking= this;

        thisBooking.dom = {};

    }
    render() {
        thisBooking= this;

        thisBooking.menuContainer = thisBooking.wrapper;

        thisBooking.generatedHTML = templates.bookingWidget();

        menuContainer.innerHTML = thisBooking.generatedHTML;



    }
    initWidget(){
        thisBooking= this;

        thisBooking.initWidget = new AmountWidget(thisBooking.dom.initWidget);

        thisBooking.dom.initWidget. addEventListenet('updated', function() {
            
        });
        thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);

        thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);

    }
    
    */

}
export default Booking;