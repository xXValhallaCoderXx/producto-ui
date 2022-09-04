import { parseISO, format } from "date-fns";

const adjustForUTCOffset = (date) => {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
};

export const utcDateNow = (dateString) => {
  const date = parseISO(dateString);
  const dateWithOffset = adjustForUTCOffset(date);
  return format(dateWithOffset, "LLL dd, yyyy HH:mm");
};

export const convertUTCDateToLocalDate = (date) => {
  var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

  var offset = date.getTimezoneOffset() / 60;
  var hours = date.getHours();

  newDate.setHours(hours - offset);

  return newDate;
};
