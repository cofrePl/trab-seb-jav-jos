const http = require('http');

const data = JSON.stringify({
    name: "Test Crew Node",
    estado: "ACTIVA",
    cantidad_trabajadores: "2"
});

const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/crews',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtaWd1dXZwNDAwMDB5MDhqN2R5ZTFxanEiLCJlbWFpbCI6ImFkbWluQHByYWRlcmEubG9jYWwiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NjQ4OTg3MzQsImV4cCI6MTc2NDkyNzUzNH0.eWxCcn1kxb7mBggmK8s-Xa23ndx7LCxfp2wGADPtw28'
    }
};

const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Body: ${body}`);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
