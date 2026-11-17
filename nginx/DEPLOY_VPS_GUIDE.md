# 🚀 VPS Deployment Guide with Nginx & Docker

This guide details how to deploy the **TOT Selection Project** to your VPS server (Ubuntu/Debian) using Nginx and Docker.

---

## 📋 Prerequisites on VPS

1. Update packages and install Docker & Docker Compose:
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y curl git ufw
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   ```
2. Enable UFW Firewall (allow SSH, HTTP, HTTPS):
   ```bash
   sudo ufw allow OpenSSH
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

3. Point your domain (e.g. `yourdomain.com`) to your VPS IP via an **A Record** in your DNS provider (Cloudflare, Namecheap, etc.).

---

## 🛠️ Deployment Option 1: All-in-Docker with Nginx (Recommended)

In this approach, Nginx runs inside a Docker container alongside Express, React, PostgreSQL, and Redis.

### Step 1: Configure Environment Variables
Create your `.env` file on the VPS:
```bash
cp .env.example .env
nano .env
```
Ensure the values are set:
```ini
PORT=6001
DB_USER=your_db_user
DB_PASSWORD=your_secure_password
DB_DATABASE=tot_db
DB_HOST=postgres-db
DB_PORT=5432
JWT_SECRET=your_super_secret_jwt_key
VITE_API_URL=http://your-vps-ip # Or https://yourdomain.com
FRONTEND_URL=http://your-vps-ip # Or https://yourdomain.com
```

### Step 2: Start the Application
```bash
docker compose up -d --build
```
Your application is now live on `http://your-vps-ip` (or `http://yourdomain.com`) on port 80!

### Step 3: Enable SSL (HTTPS) with Let's Encrypt
1. Run Certbot to generate certificates:
   ```bash
   docker compose run --rm --entrypoint "\
     certbot certonly --webroot -w /var/www/certbot \
     -d yourdomain.com -d www.yourdomain.com \
     --email your-email@example.com --agree-tos --no-eff-email" certbot
   ```
2. Copy the SSL template to active configuration:
   ```bash
   cp nginx/conf.d/default-ssl.conf.example nginx/conf.d/default.conf
   ```
3. Edit `nginx/conf.d/default.conf` and replace `yourdomain.com` with your actual domain:
   ```bash
   nano nginx/conf.d/default.conf
   ```
4. Reload Nginx:
   ```bash
   docker compose exec nginx nginx -s reload
   ```

---

## 🌐 Deployment Option 2: Nginx Installed Directly on VPS Host

If you prefer running Nginx on the host Ubuntu system rather than inside Docker:

### Step 1: Install Nginx & Certbot on VPS
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

### Step 2: Copy the Host Nginx Configuration
```bash
sudo cp nginx/vps-host-nginx.conf /etc/nginx/sites-available/tot_project.conf
```
Edit the file to put your domain name:
```bash
sudo nano /etc/nginx/sites-available/tot_project.conf
```

Enable the site configuration:
```bash
sudo ln -s /etc/nginx/sites-available/tot_project.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### Step 3: Run Docker Containers
Run Docker Compose (without the internal Nginx container):
```bash
docker compose up -d backend-app frontend-app postgres-db redis-cache
```

### Step 4: Obtain SSL Certificate
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
Certbot will automatically configure HTTPS redirection and renew certificates automatically.

---

## 🔍 Useful Maintenance Commands

- **Check logs:**
  ```bash
  docker compose logs -f nginx
  docker compose logs -f backend-app
  docker compose logs -f frontend-app
  ```
- **Restart services:**
  ```bash
  docker compose restart nginx
  ```
- **Stop all services:**
  ```bash
  docker compose down
  ```
