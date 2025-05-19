# Deploy AWS EC2

## Description
This is a Use Case for deploying a web application on an AWS EC2 instance using Nginx and PM2.
It covers the installation of necessary dependencies, configuration of Nginx, and management of the application using PM2.

## Table of Contents
- [Deploy AWS EC2](#deploy-aws-ec2)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
    - [Update system packages](#update-system-packages)
    - [Install PM2](#install-pm2)
    - [Configure Nginx](#configure-nginx)
    - [Clone the repository](#clone-the-repository)
    - [Install project dependencies, then build the project](#install-project-dependencies-then-build-the-project)
    - [Start the application](#start-the-application)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [License](#license)

## Prerequisites
- An AWS EC2 instance running Ubuntu 20.04 or later
- SSH access to the instance
- A domain name pointing to the instance's public IP address (optional)

## Installation
### Update system packages
```bash
sudo apt update
sudo apt upgrade
sudo apt install build-essential
sudo apt install nginx

# Install or Update nvm
# Refer to https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# Install Node.js
nvm install --lts
```

### Install PM2
```bash
$ sudo npm install -g pm2
pm2 -v # Check the version

# Create log directory
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2
```

### Configure Nginx
```bash
# Create a new Nginx configuration file
sudo vim /etc/nginx/sites-available/demo

# Add the following configuration
server {
    listen 80;
    server_name your_domain.com; # Replace with your domain name or public IP address
    # If you don't have a domain name, you can use the public IP address of your EC2 instance

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Back to the terminal...
sudo ln -s /etc/nginx/sites-available/demo /etc/nginx/sites-enabled/
sudo nginx -t

# You should see a message like this:
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful

# Restart Nginx
sudo systemctl restart nginx
# Or 'service nginx restart' if you are using an older version of Ubuntu
```

### Clone the repository
```bash
git clone https://github.com/wellington-plus/deploy-aws-ec2.git
cd deploy-aws-ec2
```

### Install project dependencies, then build the project
```bash
# Install project dependencies
npm install

# Build the project
npm run build
```

### Start the application 
```bash
pm2 start ecosystem.config.js

# Check the status of the application
pm2 status
# You should see the status of each application marked as "online"

# Save the PM2 process list
# This will save the current process list and its environment
# so that it can be restored on system startup
pm2 save
# If not already done, configure startup script
# sudo pm2 startup systemd
# (Follow instructions)
```

## Usage
After the deployment, you can access your application by navigating to `http://your_domain.com` in your web browser.

## Contributing
Guidelines for contributing can be found [here](CONTRIBUTING.md).

## License
[MIT Licence](LICENSE).