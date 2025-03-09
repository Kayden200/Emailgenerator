const usedNumbers = new Set();
let minNumber = 500;

function generateUniqueNumber() {
  let randomNumber;
  do {
    randomNumber = Math.floor(Math.random() * 1000000) + minNumber;
  } while (usedNumbers.has(randomNumber));
  usedNumbers.add(randomNumber);
  return randomNumber;
}

document.querySelector('.generate-button').addEventListener('click', function() {
  const emailCounter = generateUniqueNumber();
  const email = 'ryliecohn+' + emailCounter + '@yandex.com';
  document.querySelector('.email-input').value = email;
  alert("Generated email: " + email);
});

document.querySelector('.copy-button').addEventListener('click', function() {
  const emailInput = document.querySelector('.email-input');
  emailInput.select();
  emailInput.setSelectionRange(0, 99999);
  document.execCommand('copy');
  alert("Email copied to clipboard!");
});

document.querySelector('.check-button').addEventListener('click', function() {
  const email = document.querySelector('.email-input').value;
  if (email) {
    alert("Checking emails for: " + email);

    const clientId = '2e14e0de88da4c72b9fba1d510b5a26d'; // Replace with your client ID
    const clientSecret = '6dcdfbeb370a4a3ba2b5b1b63ebb2d9a'; // Replace with your client secret
    const tokenUrl = 'https://oauth.yandex.com/token';
    const apiUrl = 'https://mail.yandex.com/api/v2.0/json/messages';

    // Fetch access token
    fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); 
    })
    .then(tokenData => {
      const accessToken = tokenData.access_token;
      return fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); 
    })
    .then(data => {
      if (data && data.messages) {
        alert("Found messages for this email!");
        console.log(data.messages);
      } else {
        alert("No messages found for this email."); 
      }
    })
    .catch(error => {
      alert('Error fetching messages: ' + error);
      console.error('Error fetching messages:', error);
    }); 
  } else {
    alert("Please generate an email first.");
  }
});
