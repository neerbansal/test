const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const pty = require('node-pty');
const path = require('path');
const os = require('os');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    const shell = 'bash';
    const ptyProcess = pty.spawn(shell, ['--rcfile', path.join(__dirname, '.bashrc')], {
        name: 'xterm-color',
        cols: 80,
        rows: 24,
        cwd: process.env.HOME,
        env: {
            ...process.env,
            PATH: process.env.PATH + ':' + path.join(__dirname, 'bin')
        }
    });

    socket.on('input', (data) => {
        ptyProcess.write(data);
    });

    ptyProcess.onData((data) => {
        socket.emit('output', data);
    });

    socket.on('resize', (size) => {
        ptyProcess.resize(size.cols, size.rows);
    });

    socket.on('disconnect', () => {
        ptyProcess.kill();
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
