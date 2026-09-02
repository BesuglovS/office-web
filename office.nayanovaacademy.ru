# ==========================================
# 1. Редирект HTTP -> HTTPS
# ==========================================
server {
    listen 80;
    server_name office.nayanovaacademy.ru;
    
    return 301 https://$host$request_uri;
}

# ==========================================
# 2. Основной HTTPS-сервер
# ==========================================
server {
    listen 443 ssl http2;
    server_name office.nayanovaacademy.ru;

    # --- SSL-сертификаты ---
    ssl_certificate     /etc/ssl/certs/nayanovaacademy.ru/cert.pem;
    ssl_certificate_key /etc/ssl/private/nayanovaacademy.ru/key.pem;
    
    # --- Настройки безопасности SSL ---
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    # --- Основные параметры сайта ---
    root /var/www/office.nayanovaacademy.ru/public;
    index index.html index.htm index.php;

    # Логирование
    access_log /var/log/nginx/office.nayanovaacademy.ru.access.log;
    error_log  /var/log/nginx/office.nayanovaacademy.ru.error.log;

    # 1. Маршрутизация (SPA / статика)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 3. Кэширование статических файлов
    # Ecosystem-скрипты без content-hash - ne keshirovat, inache obnovleniya
    # dohodyat do 30 dney (tracking-client, progress-client, progress-sync).
    location = /assets/js/tracking-client.js {
        add_header Cache-Control "no-cache, must-revalidate";
    }

    location = /assets/js/progress-client.js {
        add_header Cache-Control "no-cache, must-revalidate";
    }

    location = /assets/js/progress-sync.js {
        add_header Cache-Control "no-cache, must-revalidate";
    }

    location = /sw.js {
        add_header Cache-Control "no-cache, must-revalidate";
    }

    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|pdf)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # 4. Блокировка скрытых файлов
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
