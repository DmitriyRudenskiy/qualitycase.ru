## PM2
### Detect available init system, generate configuration and enable startup system
pm2 startup
NODE_ENV=production pm2 start /var/www/qualitycase.ru/src -n 'qualitycase.ru'
pm2 save

#Haproxy
haproxy -c -V -f /etc/haproxy/haproxy.cfg
service haproxy restart
systemctl enable haproxy

#Compress components with gzip
 option http-server-close
 mode http
 compression algo gzip
 compression type text/html text/plain text/css
 
 
 compression algo gzip
 compression type text/css text/html text/javascript application/javascript text/plain text/xml application/json