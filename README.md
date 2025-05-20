# Deploy AWS EC2

## Description
This is a Use Case for deploying a web application on an AWS EC2 instance using Nginx and PM2.
It covers the installation of necessary dependencies, SSL certificates, configuration of Nginx, and management of the application using PM2.

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
- A Static IP address (Elastic IP) associated with the instance
- A domain name pointing to the static IP address
- SSH access to the instance
- Your own fork of this repository

## Installation
### Update system packages
```bash
sudo apt update
sudo apt upgrade
sudo apt install build-essential
sudo apt install nginx
sudo apt install certbot python3-certbot-nginx

# Install or Update nvm
# Refer to https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# Install Node.js
nvm install --lts
```

### Install PM2
```bash
$ npm install -g pm2
pm2 -v # Check the version

# Create log directory
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2
```

## Configure certbot
```bash
sudo certbot --nginx -d your_domain.com -d www.your_domain.com
# Follow the prompts to set up SSL

# Test the renewal process
sudo certbot renew --dry-run

# Check if the certificate was installed correctly
sudo certbot certificates
```

### Configure Nginx
```bash
# Update the default Nginx configuration file
sudo vim /etc/nginx/sites-available/default

# Replace the content with the following configuration

# Redirect all HTTP requests to HTTPS
server {
    listen 80;
    server_name your_domain.com www.your_domain.com;
    return 301 https://$host$request_uri;
}

# Main HTTPS server block
server {
    listen 443 ssl http2;
    server_name your_domain.com www.your_domain.com;

    ssl_certificate /etc/letsencrypt/live/your_domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your_domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    location / {
        root /app/public;
        try_files $uri @fallback_to_deploy_aws_ec2;
    }

    location /_next/static {
        alias /app/.next/static;
        expires 1y;
        access_log off;
    }

    location @fallback_to_deploy_aws_ec2 {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Back to the terminal... Test the Nginx configuration
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
sudo mkdir /app
sudo chown -R $USER:$USER /app
cd /app
git clone https://github.com/wellington-plus/deploy-aws-ec2.git .
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
# pm2 startup systemd
# (Follow instructions)
```

## Usage
After the deployment, you can access your application by navigating to `https://your_domain.com` in your web browser.

## Contributing
Guidelines for contributing can be found [here](CONTRIBUTING.md).

## License
[MIT Licence](LICENSE).