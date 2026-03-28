const http = require('http');

fetch('http://127.0.0.1:8080/insight', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ prompt: 'Hello, what is Bitcoin?' })
})
.then(res => res.json().then(data => console.log('Status', res.status, data)))
.catch(err => console.error(err));
