#!/bin/bash

echo dk12 | sudo -S echo -- Authorized sudo --
echo "kamasado:$SSHPASS" | sudo chpasswd
sudo /etc/init.d/ssh start

yarn start
