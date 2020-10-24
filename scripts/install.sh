#!/bin/bash
# install script for hermes base-image

# Optional but simplifies NVM installation
touch .bash_profile

yum update -y
# Install git
yum install -y git
echo "--------------------------------------------------"
echo "Git installation successful, installing node"
curl -sL https://rpm.nodesource.com/setup_10.x | bash
yum install -y nodejs
echo "--------------------------------------------------"
echo "Node installation successful, installing nvm"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
echo "--------------------------------------------------"
echo "NVM installation successful, installing 'Development Tools'"
yum groupinstall -y 'Development Tools'