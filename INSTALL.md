## PM2
### Detect available init system, generate configuration and enable startup system
pm2 startup
NODE_ENV=production pm2 start /var/www/qualitycase.ru/src -n 'qualitycase.ru'
pm2 save

#Haproxy
haproxy -c -V -f /etc/haproxy/haproxy.cfg
service haproxy restart
systemctl enable haproxy