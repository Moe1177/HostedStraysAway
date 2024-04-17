'use strict';

function getCurrentDate() {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const date = new Date();

  const day = days[date.getDay()];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day}, ${month} ${date.getDate()} ${year}`;
}

getCurrentDate();

setInterval(getCurrentDate, 1000);

// --------------------------------------------------------------------------

const form = document.getElementById('createAccountForm');
const message = document.getElementById('message');

function validateInput() {
  e.preventDefault();

  const username = document.forms['CreateAccountForm']['username'].value;
  const password = document.forms['CreateAccountForm']['password'].value;

  console.log(username);
  console.log(password);
  

  const usernamePattern = /^[a-zA-Z0-9]+$/;
  const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d).{4,}$/;

  if (!usernamePattern.test(username)) {
    showMessage('Username can only contain letters and digits');
    return;
  }

  if (!passwordPattern.test(password)) {
    showMessage(
      'Password needs to have: Only letters and digits, minimum length of 4 and at least one character & digit.'
    );
    return;
  }

  sendDataToServer(username, password);
}

function showMessage(msg) {
  message.textContent = msg;
}

function sendDataToServer(username, password) {
  console.log('Sending data to server...');
  console.log('Username:', username);
  console.log('Password:', password);

  // Send a POST request to the server to create a new login
  fetch('/createAccount', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
    .then(response => response.json())
    .then(data => {
      showMessage(data.message);
    })
    .catch(error => {
      console.error('Error:', error);
      showMessage('An error occurred. Please try again.');
    });
}
