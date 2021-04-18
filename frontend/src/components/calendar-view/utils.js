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
