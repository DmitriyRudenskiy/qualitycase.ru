### Начало работы

# Установите пакеты
    npm i

# Создайте базу данных
    node_modules/.bin/sequelize db:create --config=app/database/config.js

# Запустите миграцию, чтобы создать таблицы:
    node_modules/.bin/sequelize db:migrate --migrations-path=app/database/migrations/ --config=app/database/config.js
    
# Запускаем сервер
    node src/
    
# Перед git commit
    npm run pretty

#test