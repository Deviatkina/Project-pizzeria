import AmountWidget from './AmountWidget.js';
import { settings, select, templates } from '../settings.js';
import utils from '../utils.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';


class Booking {
    constructor(bookingWrapper) {
        const thisBooking = this;

        thisBooking.wrapper = bookingWrapper;

        thisBooking.render();
        thisBooking.getElements();
        thisBooking.initWidgets();
        thisBooking.getData();
    }

    getElements() {
        const thisBooking = this;

        thisBooking.dom = {};

        thisBooking.dom.bookingWidget = thisBooking.wrapper.querySelector('.booking-widget');

        thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount); //do diva osób
        thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount); //do diva z godzinami

        
    }
    getData() {
        const thisBooking = this;

        const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate)
        const endDateParam = settings.db.dateEndParamKey   + '=' + utils.dateToStr(thisBooking.datePicker.maxDate)

        const params = {
            booking: [
                startDateParam,  
                endDateParam,            
            ],
            eventCurrent:[
                settings.db.notRepeatParam,
                startDateParam,  
                endDateParam, 
            ],
            eventRepeat:[
                settings.db.repeatParam,
                endDateParam,
            ],
        };
        //console.log('getData params', params);

        const urls = {
            booking:        settings.db.url + '/' + settings.db.bookings  
                            + '?' + params.booking.join('&'),
            eventsCurrent:  settings.db.url + '/' + settings.db.events    
                            + '?' + params.eventCurrent.join('&'), 
            eventsRepeat:   settings.db.url + '/' + settings.db.events    
                            + '?' + params.eventRepeat.join('&'),
        };
        //console.log('getData urls', urls)
        Promise.all([
            fetch (urls.booking),
            fetch (urls.eventsCurrent),
            fetch (urls.eventsRepeat),
        ])
            .then(function(allResponses){
                const bookingsResponse = allResponses[0];
                const eventsCurrentResponse = allResponses[1];
                const eventsRepeatResponse = allResponses[2];
                return Promise.all ([
                    bookingsResponse.json(),
                    eventsCurrentResponse.json(),
                    eventsRepeatResponse.json(),
                ]);
            })
            .then(function([bookings, eventsCurrent, eventsRepeat]){
                console.log(bookings);
                console.log(eventsCurrent);
                console.log(eventsRepeat);
            });
       
    }

    render() {
        const thisBooking = this;

        thisBooking.menuContainer = thisBooking.wrapper;

        thisBooking.generatedHTML = templates.bookingWidget();

        thisBooking.menuContainer.innerHTML = thisBooking.generatedHTML;

    }
    initWidgets() {
        const thisBooking = this;

        thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
        thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);

        thisBooking.datePicker = new DatePicker(thisBooking.dom.bookingWidget.querySelector('.date-picker'));
        thisBooking.hourPicker = new HourPicker(thisBooking.dom.bookingWidget.querySelector('.hour-picker'));

    }
}
export default Booking;