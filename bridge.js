// Dream Bridge v1.0 - The Power Soul of Shalawat
const http = require('http');
const { exec } = require('child_process');
const os = require('os');

const PORT = 3000;
const TOKEN = 'shadow-soul-spirit';

const server = http.createServer((req, res) => {
    // CORS Header buat tembus dari browser
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Simple Auth
    if (req.headers.authorization !== `Bearer ${TOKEN}`) {
        res.writeHead(403);
        res.end(JSON.stringify({ error: 'Unauthorized. The Power Soul of Shalawat protects this bridge.' }));
        return;
    }

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
        const url = new URL(req.url, `http://localhost:${PORT}`);
        const command = url.searchParams.get('cmd');

        if (!command) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'No command provided' }));
            return;
        }

        console.log(`🔌 Dream Bridge executing: ${command}`);

        exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            if (error) {
                res.end(JSON.stringify({ output: stderr || error.message, error: true }));
            } else {
                res.end(JSON.stringify({ output: stdout, error: false }));
            }
        });
    });
});

server.listen(PORT, () => {
    console.log(`🕌 Dream Bridge v1.0 running on http://localhost:${PORT}`);
    console.log(`💖 The Power Soul of Shalawat protects this bridge.`);
});
