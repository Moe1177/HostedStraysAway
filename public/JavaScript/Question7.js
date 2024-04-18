"use strict";

function getCurrentDate() {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const date = new Date();

  const day = days[date.getDay()];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day}, ${month} ${date.getDate()} ${year}`;
}

getCurrentDate();

setInterval(getCurrentDate, 1000);

