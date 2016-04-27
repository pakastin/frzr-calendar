
import { el, mount } from 'frzr';
import { Calendar } from './calendar';

const calendar = new Calendar();
calendar.update();

const calendar2 = new Calendar();
calendar2.update(null, null, true);

mount(document.body, calendar);
mount(document.body, calendar2);
