
import { el, text, mount, List } from 'frzr';
import { createCalendar } from './calendardata';

const WEEKDAYS = 'Su Mo Tu We Th Fr Sa'.split(' ');
const MONTHS = 'January February March April May June July August September October November December'.split(' ');

export class Weekday {
  constructor () {
    this.el = el('td');
  }
  update (data) {
    this.el.textContent = data;
  }
}

export class Day {
  constructor () {
    this.el = el('td');
  }
  update (data) {
    this.el.className = 'day' + (data.before ? ' before' : data.after ? ' after' : '');
    this.el.textContent = data.date.getDate();
  }
}

export class Week {
  constructor () {
    this.el = el('tr',
      this.days = new List(Day)
    );
  }
  update (data) {
    this.days.update(data);
  }
}

export class Calendar {
  constructor () {
    this.el = el('div', { class: 'calendar' },
      this.month = el('p', { class: 'month' },
        this.previousMonth = el('a', { class: 'previous' }, '←'),
        this.monthName = text(''),
        ' ',
        this.year = text(''),
        this.nextMonth = el('a', { class: 'next' }, '→')
      ),
      this.table = el('table',
        el('thead',
          this.weekdays = new List(Weekday)
        ),
        el('tbody',
          this.weeks = new List(Week)
        )
      )
    );
    this.previousMonth.onclick = () => {
      this.update(this.state.year, --this.state.month, this.state.fixMonday);
    };
    this.nextMonth.onclick = () => {
      this.update(this.state.year, ++this.state.month, this.state.fixMonday)
    };
  }
  update (year, month, fixMonday) {
    const date = new Date(year || new Date().getFullYear(), month || new Date().getMonth());

    this.state = {
      year: date.getFullYear(),
      month: date.getMonth(),
      fixMonday: fixMonday
    };

    fixMonday ? this.weekdays.update(WEEKDAYS.slice(1).concat(WEEKDAYS[0])) : this.weekdays.update(WEEKDAYS);
    this.monthName.textContent = MONTHS[this.state.month];
    this.year.textContent = this.state.year;
    this.weeks.update(createCalendar(this.state.year, this.state.month, fixMonday));
  }
}
