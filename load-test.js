const http = require('http');
const requests = 100;
console.log("Simulating traffic spike...");
for(let i = 0; i < requests; i++) {
    http.get('http://localhost:5000');
}
console.log("Spike initiated.");
