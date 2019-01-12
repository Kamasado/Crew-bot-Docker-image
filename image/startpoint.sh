#!/bin/bash

echo dk12 | sudo -S echo -- Authorized sudo --
echo "kamasado:$SSHPASS" | sudo chpasswd
sudo /etc/init.d/ssh start

git clone https://github.com/Kamasado/Crew-bot.git ./bot
cd ./bot
yarn
yarn start
