# Hack Club Minimalist Terminal

A web-based terminal emulator for Hack Club members, featuring a clean white-on-black aesthetic and integrated AI capabilities.

## Features

- **Minimalist Design:** Pure white background with black text.
- **Redaction Font:** Uses the custom 'Redaction' font for a unique look.
- **AI Integration:** Integrated \`ai.ask\` command that uses the Hack Club AI proxy.
- **Persistent Sessions:** Powered by \`node-pty\` for a real Linux shell experience.

## Usage

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set Environment Variables:**
   ```bash
   export GROK="your_ai_proxy_token"
   ```

3. **Start the Server:**
   ```bash
   node server.js
   ```

4. **Access the Terminal:**
   Open \`http://localhost:3000\` in your browser.

## AI Command

Within the terminal, you can ask questions to the AI:
```bash
ai.ask "Who is the founder of Hack Club?"
```
