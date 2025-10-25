const http = require('http')
const fs = require('fs');

const server = http.createServer((req, res) => {
    fs.readFile('c:/Users/VICTUS/Desktop/Backend Dev Lab/Experiment1/Q2/test.txt', 'utf-8', (err, data) => {
        if (err) {
            console.error('Could not find or read the file', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error reading file');
            return;
        }
        // Send a 200 OK status back to the browser when file is there
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        // Send the file's content ('data') as the response and end it
        res.end(data);
    });
});

server.listen(3000, () => {
    console.log('Minimal server running at http://localhost:3000/');
});