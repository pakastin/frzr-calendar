
import { el, mount } from 'frzr';
import { Calendar } from './calendar';

const calendar = new Calendar();
calendar.update(2016, 1);

const calendar2 = new Calendar();
calendar2.update(2016, 1, true);

mount(document.body, calendar);
mount(document.body, calendar2);
