const http = require('http');

const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtaWd1dXZwNDAwMDB5MDhqN2R5ZTFxanEiLCJlbWFpbCI6ImFkbWluQHByYWRlcmEubG9jYWwiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NjQ4OTg3MzQsImV4cCI6MTc2NDkyNzUzNH0.eWxCcn1kxb7mBggmK8s-Xa23ndx7LCxfp2wGADPtw28';

function request(path, method, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 4000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        };

        if (data) {
            options.headers['Content-Length'] = data.length;
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve(JSON.parse(body)));
        });

        req.on('error', reject);

        if (data) req.write(data);
        req.end();
    });
}

async function run() {
    try {
        // 1. Get Workers
        const workers = await request('/api/workers', 'GET');
        console.log(`Found ${workers.length} workers.`);
        if (workers.length < 2) {
            console.error('Not enough workers to test.');
            return;
        }

        const workerIds = [workers[0].id, workers[1].id];
        console.log('Using Worker IDs:', workerIds);

        // 2. Create Crew with Workers
        const crewData = JSON.stringify({
            name: "Test Crew Node Workers",
            estado: "ACTIVA",
            cantidad_trabajadores: "2",
            workerIds: workerIds,
            projectId: "" // Testing empty string explicitly
        });

        const crew = await request('/api/crews', 'POST', crewData);
        console.log('Crew Created:', crew);

    } catch (error) {
        console.error('Error:', error);
    }
}

run();
