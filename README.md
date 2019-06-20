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

.
├── package.json
├── package-lock.json
└── src
    ├── db
    │   ├── migrations
    │   │   ├── 20190611175237-create-task.js
    │   │   └── 20190611175246-create-user.js
    │   ├── models
    │   │   ├── index.js
    │   │   ├── task.js
    │   │   └── user.js
    │   └── seeders
    └── index.js
