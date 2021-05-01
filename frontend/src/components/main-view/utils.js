function calendarDays(month, year) {
  var date = new Date(year, month, 1);
  var days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  if (days[0].getDay() !== 0) {
    // The first day of the month is a not sunday so old days are needed
    // get days from the previous month
    const oldMonth = month >= 0 ? month - 1 : 12;
    const oldYear = month >= 0 ? year : year - 1;
    var oldDate = new Date(oldYear, oldMonth, 1);
    var oldDays = [];

    while (oldDate.getMonth() === oldMonth) {
      oldDays.push(new Date(oldDate));
      oldDate.setDate(oldDate.getDate() + 1);
    }
    const amountOfOldDays = -days[0].getDay();
    const daysToAdd = oldDays.slice(amountOfOldDays);
    days = daysToAdd.concat(days);
  }

  // Get dates of the next month
  const nextYear = month === 11 ? year : year + 1;
  const nextMonth = month === 11 ? 0 : month + 1;
  var nextDate = new Date(nextYear, nextMonth, 1);
  var nextDays = [];
  while (nextDate.getMonth() === nextMonth) {
    nextDays.push(new Date(nextDate));
    nextDate.setDate(nextDate.getDate() + 1);
  }

  days = days.concat(nextDays);
  days = days.slice(0, 35);
  return days;
}

export const getCalendarDays = (day) => calendarDays(day.getMonth(), day.getFullYear());

function getDaysInMonth(month, year) {
  var date = new Date(year, month, 1);
  var days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  //get first day of the month
  // if it is not a sunday append the days from the month prior
  const firstDay = days[0];
  const weekday = firstDay.getDay();
  if (weekday === 0) {
    return days;
  }

  // The first day is not a sunday
  const numberOfDaysToAdd = weekday;
  const newMonth = month > 0 ? month - 1 : 12;
  const newYear = month > 0 ? year : year - 1;
  const newDays = getDaysInLastMonth(newMonth, newYear, numberOfDaysToAdd);
  days = newDays.concat(days);

  return days.splice(0, 28);
}

function getDaysInLastMonth(month, year, numberOfDays) {
  var date = new Date(year, month, 1);
  var days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return days.slice(-numberOfDays);
}

export const getDays = (day) => getDaysInMonth(day.getMonth(), day.getFullYear());
