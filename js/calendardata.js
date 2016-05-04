
export function createCalendar (year, month, doFixMonday) {
  const results = [];

  // find out first and last days of the month
  const firstDate = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0)

  // calculate first monday and last sunday
  const firstMonday = getFirstMonday(firstDate, doFixMonday);
  const lastSunday = getLastSunday(lastDate, doFixMonday);

  // iterate days starting from first monday
  let iterator = new Date(firstMonday);
  let i = 0;
  let week;

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
  const firstDay = firstDate.getDay();

  const offset = doFixMonday ? fixMonday(firstDay) : firstDay;
  const result = new Date(firstDate);

  result.setDate(firstDate.getDate() - offset);

  return result;
}

function getLastSunday (lastDate, doFixMonday) {
  const lastDay = lastDate.getDay();
  const offset = doFixMonday ? 6 - fixMonday(lastDay) : 6 - lastDay;
  const result = new Date(lastDate);

  result.setDate(lastDate.getDate() + offset);

  return result;
}
