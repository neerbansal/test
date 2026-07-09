# Hack Club Terminal Customizations
export PATH="$PATH:/app/bin"

# Custom prompt
export PS1="hackclub@terminal:\w\$ "

# Display ASCII art on login
if [ -f /app/bin/motd.txt ]; then
    cat /app/bin/motd.txt
fi
