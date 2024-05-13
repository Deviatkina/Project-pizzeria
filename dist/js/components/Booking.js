import AmountWidget from './AmountWidget.js';
import {select, templates} from '../settings.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';


class Booking{
    constructor (bookingWrapper){
        const thisBooking = this;

        thisBooking.wrapper = bookingWrapper;

        thisBooking.render();
        thisBooking.getElements();
        thisBooking.initWidgets();
    }
    
    getElements(){
        const thisBooking= this;

        thisBooking.dom = {};

        thisBooking.dom.bookingWidget = thisBooking.wrapper.querySelector('.booking-widget');
       
        thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount); //do diva osób
        thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount); //do diva z godzinami
    }
    render() {
        const thisBooking= this;

        thisBooking.menuContainer = thisBooking.wrapper;

        thisBooking.generatedHTML = templates.bookingWidget();

        thisBooking.menuContainer.innerHTML = thisBooking.generatedHTML;

    }
    initWidgets(){
        const thisBooking= this;

        thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
        thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);

        thisBooking.datePicker = new DatePicker(thisBooking.dom.bookingWidget.querySelector('.date-picker'));
        thisBooking.hourPicker = new HourPicker(thisBooking.dom.bookingWidget.querySelector('.hour-picker'));
        
        console.log(thisBooking.hourPicker);
    }
}
export default Booking;