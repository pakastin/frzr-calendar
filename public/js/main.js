(function () {
	'use strict';

	function text (str) {
	  return document.createTextNode(str);
	}

	function el (tagName) {
	  var arguments$1 = arguments;

	  var element = document.createElement(tagName);

	  for (var i = 1; i < arguments$1.length; i++) {
	    var arg = arguments$1[i];

	    if (arg == null) {
	      continue;
	    } else if (mount(element, arg)) {
	      continue;
	    } else if (typeof arg === 'object') {
	      for (var attr in arg) {
	        if (element[attr] != null) {
	          element[attr] = arg[attr];
	        } else {
	          element.setAttribute(attr, arg[attr]);
	        }
	      }
	    }
	  }

	  return element;
	}

	function List (View, key, initData, skipRender) {
	  this.View = View;
	  this.views = [];
	  this.initData = initData;
	  this.skipRender = skipRender;

	  if (key) {
	    this.key = key;
	    this.lookup = {};
	  }
	}

	List.prototype.update = function (data, cb) {
	  var View = this.View;
	  var views = this.views;
	  var parent = this.parent;
	  var key = this.key;
	  var initData = this.initData;
	  var skipRender = this.skipRender;

	  if (cb) {
	    var added = [];
	    var updated = [];
	    var removed = [];
	  }

	  if (key) {
	    var lookup = this.lookup;
	    var newLookup = {};

	    views.length = data.length;

	    for (var i = 0; i < data.length; i++) {
	      var item = data[i];
	      var id = item[key];
	      var view = lookup[id];

	      if (!view) {
	        view = new View(initData, item, i);
	        cb && added.push(view);
	      } else {
	        cb && updated.push(view);
	      }

	      views[i] = newLookup[id] = view;

	      view.update && view.update(item, i);
	    }

	    if (cb) {
	      for (var id in lookup) {
	        if (!newLookup[id]) {
	          removed.push(lookup[id]);
	          !skipRender && parent && unmount(parent, lookup[id]);
	        }
	      }
	    }

	    this.lookup = newLookup;
	  } else {
	    if (cb) {
	      for (var i = data.length; i < views.length; i++) {
	        var view = views[i];

	        !skipRender && parent && unmount(parent, view);
	        removed.push(view);
	      }
	    }

	    views.length = data.length;

	    for (var i = 0; i < data.length; i++) {
	      var item = data[i];
	      var view = views[i];

	      if (!view) {
	        view = new View(initData, item, i);
	        cb && added.push(view);
	      } else {
	        cb && updated.push(view);
	      }

	      view.update && view.update(item, i);
	      views[i] = view;
	    }
	  }

	  !skipRender && parent && setChildren(parent, views);
	  cb && cb(added, updated, removed);
	}

	function mount (parent, child, before) {
	  var parentEl = parent.el || parent;
	  var childEl = child.el || child;

	  if (childEl instanceof Node) {
	    if (before) {
	      var beforeEl = before;
	      parentEl.insertBefore(childEl, beforeEl);
	    } else {
	      parentEl.appendChild(childEl);
	    }

	    if (child.el !== child) {
	      child.parent = parent;
	    }

	  } else if (typeof childEl === 'string' || typeof childEl === 'number') {
	    mount(parentEl, document.createTextNode(childEl), before);

	  } else if (childEl instanceof Array) {
	    for (var i = 0; i < childEl.length; i++) {
	      mount(parentEl, childEl[i], before);
	    }

	  } else if (child instanceof List) {
	    child.parent = parent;
	    setChildren(parentEl, child.views);

	  } else {
	    return false;
	  }
	  return true;
	}

	function unmount (parent, child) {
	  var parentEl = parent.el || parent;
	  var childEl = child.el || child;

	  parentEl.removeChild(childEl);

	  if (childEl !== child) {
	    child.parent = null;
	  }
	}

	function setChildren (parent, children) {
	  var parentEl = parent.el || parent;
	  var traverse = parentEl.firstChild;

	  for (var i = 0; i < children.length; i++) {
	    var child = children[i];
	    var childEl = child.el || child;

	    if (traverse === childEl) {
	      traverse = traverse.nextSibling;
	      continue;
	    }

	    mount(parent, child, traverse);
	  }

	  while (traverse) {
	    var next = traverse.nextSibling;

	    unmount(parentEl, traverse);

	    traverse = next;
	  }
	}

	function createCalendar (year, month, doFixMonday) {
		var results = [];

		// find out first and last days of the month
		var firstDate = new Date(year, month, 1);
		var lastDate = new Date(year, month + 1, 0)

	  // calculate first monday and last sunday
	  var firstMonday = getFirstMonday(firstDate, doFixMonday);
	  var lastSunday = getLastSunday(lastDate, doFixMonday);

		// iterate days starting from first monday
		var iterator = new Date(firstMonday);
	  var i = 0;
		var week;

	  // ..until last sunday
	  while (iterator <= lastSunday) {
			if (i++ % 7 === 0) {
	    	// start new week when monday
	    	week = [];
				results.push(week);
			}

	    // push day to week
			week.push({
	    	date: new Date(iterator),
	      before: iterator < firstDate, // add indicator if before current month
	      after: iterator > lastDate // add indicator if after current month
	    });

			// iterate to next day
			iterator.setDate(iterator.getDate() + 1);
		}

	  return results;
	}

	function fixMonday (day) {
		day || (day = 7);
	  return --day;
	}

	function getFirstMonday (firstDate, doFixMonday) {
		var firstDay = firstDate.getDay();

		var offset = doFixMonday ? fixMonday(firstDay) : firstDay;
		var result = new Date(firstDate);

	  result.setDate(firstDate.getDate() - offset);

	  return result;
	}

	function getLastSunday (lastDate, doFixMonday) {
		var lastDay = lastDate.getDay();
		var offset = doFixMonday ? 6 - fixMonday(lastDay) : 6 - lastDay;
	  var result = new Date(lastDate);

	  result.setDate(lastDate.getDate() + offset);

		return result;
	}

	var WEEKDAYS = 'Su Mo Tu We Th Fr Sa'.split(' ');
	var MONTHS = 'January February March April May June July August September October November December'.split(' ');

	var Weekday = function Weekday () {
	  this.el = el('td');
	};
	Weekday.prototype.update = function update (data) {
	  this.el.textContent = data;
	};

	var Day = function Day () {
	  this.el = el('td');
	};
	Day.prototype.update = function update (data) {
	  this.el.className = 'day' + (data.before ? ' before' : data.after ? ' after' : '');
	  this.el.textContent = data.date.getDate();
	};

	var Week = function Week () {
	  this.el = el('tr',
	    this.days = new List(Day)
	  );
	};
	Week.prototype.update = function update (data) {
	  this.days.update(data);
	};

	var Calendar = function Calendar () {
	  var this$1 = this;

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
	  this.previousMonth.onclick = function () {
	    this$1.update(this$1.state.year, --this$1.state.month, this$1.state.fixMonday);
	  };
	  this.nextMonth.onclick = function () {
	    this$1.update(this$1.state.year, ++this$1.state.month, this$1.state.fixMonday)
	  };
	};
	Calendar.prototype.update = function update (year, month, fixMonday) {
	  var date = new Date(year || new Date().getFullYear(), month || new Date().getMonth());

	  this.state = {
	    year: date.getFullYear(),
	    month: date.getMonth(),
	    fixMonday: fixMonday
	  };

	  fixMonday ? this.weekdays.update(WEEKDAYS.slice(1).concat(WEEKDAYS[0])) : this.weekdays.update(WEEKDAYS);
	  this.monthName.textContent = MONTHS[this.state.month];
	  this.year.textContent = this.state.year;
	  this.weeks.update(createCalendar(this.state.year, this.state.month, fixMonday));
	};

	var calendar = new Calendar();
	calendar.update();

	var calendar2 = new Calendar();
	calendar2.update(null, null, true);

	mount(document.body, calendar);
	mount(document.body, calendar2);

}());