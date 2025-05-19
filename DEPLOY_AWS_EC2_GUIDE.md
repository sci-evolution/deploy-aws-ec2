# deploy-aws-ec2
Use Case of deployment to AWS EC2

# Steps (v1)
## Update system packages
```bash
sudo apt update
sudo apt upgrade
sudo apt install build-essential
sudo apt install nginx
```

## Configure Nginx
```bash
# Create a new Nginx configuration file
sudo vim /etc/nginx/sites-available/demo

# Add the following configuration
server {
    listen 80;
    server_name your_domain.com;

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

## Clone the repository
```bash
git clone https://github.com/wellington-plus/deploy-aws-ec2.git
cd deploy-aws-ec2
```

## Install or Update nvm
```bash
# Refer to https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# Install Node.js
nvm install --lts

# Install Node dependencies
npm install

# Build the project
npm run build
```

## Install PM2 and start the application 
```bash
sudo npm install -g pm2
pm2 start ecosystem.config.js
```