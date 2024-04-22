//import AmountWidget from './AmountWidget.js';

class Booking{
    constructor (bookingWrapper){
        const thisBooking = this;

        thisBooking.wrapper = bookingWrapper;

        thisBooking.render(bookingWrapper);
        thisBooking.initWidgets();

        console.log('new Booking:', thisBooking);
    }

    /*render() {
        thisBooking= this;

        thisBooking.dom = {};

        thisBooking.menuContainer = thisBooking.wrapper;

        thisBooking.generatedHTML = templates.bookingWidget();

        menuContainer.innerHTML = thisBooking.generatedHTML;

    }*/

}
export default Booking;