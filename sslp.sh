#!/bin/bash
# A menu driven shell script sample template 
## ----------------------------------
# Step #1: Define variables
# ----------------------------------
 
# ----------------------------------
# Step #2: User defined function
# ----------------------------------
pause(){
  read -p "Press [Enter] key to continue..." fackEnterKey
}


one(){
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "   Installing SSLP and Prerequisites   "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	sudo apt-get -y install cmatrix
	sudo apt-get -y install curl dirmngr apt-transport-https lsb-release ca-certificates
	sudo apt-get -y install mongodb
	sudo apt-get -y install redis-server
	echo "done..."
	sleep 3
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "             Moving config             "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	cp sslp.ini.example sslp.ini
	echo "done..."
	sleep 3
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "    Allowing port 8001 on firewall     "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	sudo ufw allow 8001
	echo "done..."
	sleep 3
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo " Installing Solar Side Ledger Protocol "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	yarn install
	echo "done..."
	sleep 3
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "       Succesfully Installed SSLP       "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
        pause
}
 
# do something in two()
two(){
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "             Stopping SSLP             "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	pm2 stop sslpParser.js
	pm2 stop sslpApi.js
	echo "done..."
	sleep 3
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "     Pulling Updates from Github       "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	sleep 1
	git pull
	echo "done..."
	sleep 3
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "    Allowing port 8001 on firewall     "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	sleep 1
	sudo ufw allow 8001
	echo "done..."
	sleep 3
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo " Installing Solar Side Ledger Protocol "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	sleep 1
	yarn install
	echo "done..."
	sleep 3
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "  Launching Solar Side Ledger Protocol "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	sleep 1
	pm2 start sslpParser.js
	sleep 1
	pm2 start sslpApi.js
	echo "done..."
	sleep 3
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "        Succesfully Launched SSLP       "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
        pause
}

three(){
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "  Launching Solar Side Ledger Protocol "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	sleep 1
        pm2 start sslpParser.js
	sleep 1
	pm2 start sslpApi.js
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "        Succesfully Launched SSLP       "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
        pause
} 

four(){
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "             Stopping SSLP             "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
        pm2 stop sslpParser.js
        pm2 stop sslpApi.js
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "             Stopped SSLP              "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	sleep 1
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "  Launching Solar Side Ledger Protocol "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	sleep 1
        pm2 start sslpParser.js
	sleep 1
	pm2 start sslpApi.js
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "        Succesfully Launched SSLP       "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
        pause
} 

five(){
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "             Stopping SSLP             "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
        pm2 stop sslpParser.js
        sleep 1
        pm2 stop sslpApi.js
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "             Stopped SSLP              "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	sleep 1
        pause
} 

six(){
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "             PM2 Monitor               "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
        pm2 monit
        pause
} 

seven(){
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "              PM2 Status               "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	sleep 1
        pm2 status   
        pause
} 

eight(){
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "             Stopping SSLP             "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	sleep 1
	pm2 stop sslpParser.js
        pm2 stop sslpApi.js
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "     Pulling Updates from Github       "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	sleep 1
	git pull
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "        Installing Prerequisites       "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	sleep 1
	sudo apt-get update
	sudo apt-get -y install curl dirmngr apt-transport-https lsb-release ca-certificates
	sudo apt-get -y install mongodb
	sudo apt-get -y install redis-server
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "            Resetting Config           "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	sleep 1
	cp sslp.ini.example sslp.ini
	echo "done.."
	sleep 3
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "    Allowing port 8001 on firewall     "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	sleep 1
	sudo ufw allow 8001
	echo "done.."
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo " Installing Solar Side Ledger Protocol "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	sleep 1
	yarn install
	echo "done..."
	sleep 3
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "  Launching Solar Side Ledger Protocol "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	sleep 1
        pm2 start sslpParser.js
	sleep 1
	pm2 start sslpApi.js
	echo "done..."
	sleep 1
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "        Succesfully Launched SSLP       "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
        pause
}

ninetyeight(){
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "        Installing the Matrix          "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	sleep 2
	sudo apt-get -y install cmatrix
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo " You are now ready to enter the Matrix "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	sleep 2
} 

ninetynine(){
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "         Entering the Matrix           "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	sleep 2
	cmatrix
	exit
} 
# function to display menus
show_menus() {
	clear
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "      Solar Side Ledger Protocol      "
	echo "             Manager v1.1              "
        echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "           M A I N - M E N U           "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo " "
	echo " 1. Install SSLP"
	echo " 2. Update SSLP"
	echo " 3. Start SSLP"
	echo " 4. Restart SSLP"
	echo " 5. Stop SSLP"
	echo " 6. PM2 Monitor"
	echo " 7. View Status"
	echo " 8. Reinstall, Reset Config & Start SSLP"
	echo " 9. Exit"
	echo "98. Install the Matrix"
	echo "99. Enter the Matrix."
	echo " "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
	echo "     One script to rule them all,      "
	echo "        One script to find them,       "
	echo "     One script to bring them all,     "
	echo "     and in the darkness bind them.    "
	echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"

}
# read input from the keyboard and take a action
# invoke the one() when the user select 1 from the menu option.
# invoke the two() when the user select 2 from the menu option.
# Exit when user the user select 3 form the menu option.
read_options(){
	local choice
	read -p "Enter choice [ 1 - 9] " choice
	case $choice in
		1) one ;;
		2) two ;;
                3) three ;;
                4) four ;;
                5) five ;;
                6) six ;;
		7) seven ;;
		8) eight ;;
		98) ninetyeight ;;
		99) ninetynine ;;
		9) exit 0;;
		*) echo -e "${RED}Error...${STD}" && sleep 2
	esac
}
 
# ----------------------------------------------
# Step #3: Trap CTRL+C, CTRL+Z and quit singles
# ----------------------------------------------
trap '' SIGINT SIGQUIT SIGTSTP
 
# -----------------------------------
# Step #4: Main logic - infinite loop
# ------------------------------------
while true
do
 
	show_menus
	read_options
done
