const socket = io();

const term = new Terminal({
    fontFamily: 'Redaction, monospace',
    fontSize: 18,
    theme: {
        background: '#ffffff',
        foreground: '#000000',
        cursor: '#000000',
        selectionBackground: 'rgba(0, 0, 0, 0.3)',
        black: '#000000',
        red: '#ff0000',
        green: '#00ff00',
        yellow: '#ffff00',
        blue: '#0000ff',
        magenta: '#ff00ff',
        cyan: '#00ffff',
        white: '#ffffff',
        brightBlack: '#808080',
        brightRed: '#ff0000',
        brightGreen: '#00ff00',
        brightYellow: '#ffff00',
        brightBlue: '#0000ff',
        brightMagenta: '#ff00ff',
        brightCyan: '#00ffff',
        brightWhite: '#ffffff'
    },
    cursorBlink: true,
    allowProposedApi: true
});

const fitAddon = new FitAddon.FitAddon();
term.loadAddon(fitAddon);
term.open(document.getElementById('terminal-container'));
fitAddon.fit();

window.addEventListener('resize', () => {
    fitAddon.fit();
    socket.emit('resize', { cols: term.cols, rows: term.rows });
});

term.onData(data => {
    socket.emit('input', data);
});

socket.on('output', data => {
    term.write(data);
});

socket.on('connect', () => {
    socket.emit('resize', { cols: term.cols, rows: term.rows });
});
