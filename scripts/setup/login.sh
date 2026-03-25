#!/bin/bash
# BlackRoad OS Login System
# Real-time terminal interface with authentication

# Brand colors
PINK='\033[38;5;205m'
AMBER='\033[38;5;214m'
BLUE='\033[38;5;69m'
VIOLET='\033[38;5;135m'
PINK='\033[38;5;205m'
WHITE='\033[38;5;231m'
GRAY='\033[38;5;240m'
GREEN='\033[38;5;82m'
RED='\033[38;5;196m'
RESET='\033[0m'

# User database
USERS_DB="$HOME/.blackroad/users.db"

# Ensure directory exists
mkdir -p "$HOME/.blackroad"

# Initialize users database if it doesn't exist — prompt for initial credentials
if [ ! -f "$USERS_DB" ]; then
    echo -e "${PINK}First-time setup: create an admin account${RESET}"
    echo -n "  Choose admin username: "
    read -r init_user
    echo -n "  Choose admin password: "
    read -rs init_pass
    echo ""
    init_salt=$(openssl rand -hex 16)
    init_hash=$(echo -n "${init_salt}${init_pass}" | shasum -a 256 | awk '{print $1}')
    echo "${init_user}:${init_salt}:${init_hash}" > "$USERS_DB"
    chmod 600 "$USERS_DB"
    echo -e "${GREEN}✓ Admin account created.${RESET}"
fi

# Function to display header with real-time clock
display_header() {
    clear
    local datetime=$(date "+%A, %B %d, %Y  %I:%M:%S %p")
    
    echo ""
    echo -e "${GRAY}┌────────────────────────────────────────────────────────────────────────────┐${RESET}"
    echo -e "${GRAY}│${RESET}  ${PINK}⏰ ${WHITE}${datetime}${RESET}"
    echo -e "${GRAY}└────────────────────────────────────────────────────────────────────────────┘${RESET}"
    echo ""
    echo -e "${PINK}    ██████╗ ██╗      █████╗  ██████╗██╗  ██╗${AMBER}██████╗  ██████╗  █████╗ ██████╗ ${RESET}"
    echo -e "${PINK}    ██╔══██╗██║     ██╔══██╗██╔════╝██║ ██╔╝${AMBER}██╔══██╗██╔═══██╗██╔══██╗██╔══██╗${RESET}"
    echo -e "${PINK}    ██████╔╝██║     ███████║██║     █████╔╝ ${AMBER}██████╔╝██║   ██║███████║██║  ██║${RESET}"
    echo -e "${PINK}    ██╔══██╗██║     ██╔══██║██║     ██╔═██╗ ${AMBER}██╔══██╗██║   ██║██╔══██║██║  ██║${RESET}"
    echo -e "${PINK}    ██████╔╝███████╗██║  ██║╚██████╗██║  ██╗${AMBER}██║  ██║╚██████╔╝██║  ██║██████╔╝${RESET}"
    echo -e "${PINK}    ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝${AMBER}╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝ ${RESET}"
    echo ""
    echo -e "    ${BLUE}┌──────────────────────────────────────────────────────────────────────┐${RESET}"
    echo -e "    ${BLUE}│${RESET}                    ${PINK}░▒▓ ${WHITE}BLACKROAD OS, INC.${PINK} ▓▒░${RESET}                      ${BLUE}│${RESET}"
    echo -e "    ${BLUE}│${RESET}              ${GRAY}Distributed AI Operating System${RESET}                   ${BLUE}│${RESET}"
    echo -e "    ${BLUE}└──────────────────────────────────────────────────────────────────────┘${RESET}"
    echo ""
}

# Function to verify credentials (SHA-256 with per-user salt)
verify_credentials() {
    local username="$1"
    local password="$2"

    while IFS=: read -r stored_user stored_salt stored_hash; do
        if [ "$stored_user" = "$username" ]; then
            local password_hash
            password_hash=$(echo -n "${stored_salt}${password}" | shasum -a 256 | awk '{print $1}')
            if [ "$stored_hash" = "$password_hash" ]; then
                return 0
            fi
        fi
    done < "$USERS_DB"

    return 1
}

# Function to login
login() {
    local attempts=0
    local max_attempts=3
    
    while [ $attempts -lt $max_attempts ]; do
        display_header
        
        if [ $attempts -gt 0 ]; then
            echo -e "    ${RED}✗ Invalid credentials. Attempt $((attempts + 1))/${max_attempts}${RESET}"
            echo ""
        fi
        
        echo -e "    ${VIOLET}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
        echo -e "    ${PINK}SYSTEM LOGIN${RESET}"
        echo -e "    ${VIOLET}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
        echo ""
        
        # Get username
        echo -ne "    ${WHITE}Username:${RESET} "
        read -r username
        
        # Get password (hidden)
        echo -ne "    ${WHITE}Password:${RESET} "
        read -rs password
        echo ""
        echo ""
        
        # Verify credentials
        if verify_credentials "$username" "$password"; then
            echo -e "    ${GREEN}✓ Authentication successful!${RESET}"
            echo -e "    ${GRAY}Welcome back, ${WHITE}${username}${GRAY}...${RESET}"
            echo ""
            sleep 1
            
            # Store session
            echo "$username" > "$HOME/.blackroad/current_user"
            export BLACKROAD_USER="$username"
            
            # Launch dashboard
            launch_dashboard "$username"
            return 0
        else
            attempts=$((attempts + 1))
            sleep 1
        fi
    done
    
    echo -e "    ${RED}✗ Maximum login attempts exceeded.${RESET}"
    echo -e "    ${GRAY}System locked. Please try again later.${RESET}"
    echo ""
    exit 1
}

# Function to launch dashboard
launch_dashboard() {
    local username="$1"
    clear
    
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════════════════════╗${RESET}"
    echo -e "${GREEN}║${RESET}  ${PINK}⚡${RESET} ${WHITE}BLACKROAD OS COMMAND CENTER${RESET}                                          ${GREEN}║${RESET}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════════════════════╝${RESET}"
    echo ""
    echo -e "  ${WHITE}User:${RESET}     ${PINK}${username}${RESET}"
    echo -e "  ${WHITE}Session:${RESET}  ${GREEN}Active${RESET}"
    echo -e "  ${WHITE}Time:${RESET}     ${GRAY}$(date "+%I:%M:%S %p")${RESET}"
    echo ""
    echo -e "${VIOLET}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
    echo -e "${PINK}Available Commands:${RESET}"
    echo -e "${VIOLET}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
    echo ""
    echo -e "  ${AMBER}br-stats${RESET}          ${GRAY}View system statistics${RESET}"
    echo -e "  ${AMBER}lucidia${RESET}           ${GRAY}Launch Lucidia CLI${RESET}"
    echo -e "  ${AMBER}memory-system.sh${RESET}  ${GRAY}Access memory system${RESET}"
    echo -e "  ${AMBER}br-live${RESET}           ${GRAY}Live agent dashboard${RESET}"
    echo -e "  ${AMBER}exit${RESET}              ${GRAY}Logout${RESET}"
    echo ""
    
    # Start interactive shell
    export PS1="${PINK}blackroad${GRAY}@${WHITE}${username}${RESET} ${VIOLET}➜${RESET}  "
    bash --norc --noprofile
}

# Main execution
if [ "$1" = "--add-user" ]; then
    echo "Add new user to BlackRoad OS"
    echo -n "Username: "
    read -r new_user
    echo -n "Password: "
    read -rs new_pass
    echo ""
    
    new_salt=$(openssl rand -hex 16)
    new_hash=$(echo -n "${new_salt}${new_pass}" | shasum -a 256 | awk '{print $1}')
    echo "${new_user}:${new_salt}:${new_hash}" >> "$USERS_DB"
    echo "✓ User ${new_user} added successfully!"
    exit 0
elif [ "$1" = "--help" ]; then
    echo "BlackRoad OS Login System"
    echo ""
    echo "Usage:"
    echo "  blackroad              Login to BlackRoad OS"
    echo "  blackroad --add-user   Add new user"
    echo "  blackroad --help       Show this help"
    echo ""
    echo "On first run you will be prompted to create an admin account."
    exit 0
else
    login
fi
