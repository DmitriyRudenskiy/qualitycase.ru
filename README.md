### Начало работы

# Установите пакеты
    npm i

# Создайте базу данных
    node_modules/.bin/sequelize db:create --config=app/database/config.js
    node_modules/.bin/sequelize db:create --config=database/config.js
    node node_modules/sequelize-cli/lib/sequelize --options-path=database/options.js seed:generate --name Categories


# Запустите миграцию, чтобы создать таблицы:
    node node_modules/sequelize-cli/lib/sequelize --options-path=database/options.js model:generate --name=User --attributes=firstName:string,lastName:string,email:string
    node node_modules/sequelize-cli/lib/sequelize --options-path=database/options.js model:generate --name Posts --attributes title:string,slug:string,body:text,position:integer,visible:BOOLEAN
    node node_modules/sequelize-cli/lib/sequelize --options-path=database/options.js model:generate --name Category --attributes parent:integer,position:integer,title:string,slug:string,visible:BOOLEAN

    node node_modules/sequelize-cli/lib/sequelize --migrations-path=database/migrations db:migrate --url 'mysql://root:12345@localhost/qualitycase_ru'
    node node_modules/sequelize-cli/lib/sequelize --config=datab`ase/config.js` --migrations-path=database/migrations db:migrate



# Запускаем сервер
    node src/
    
# Перед git commit
    npm run pretty
    
    
# For test
    https://qualitycase.herokuapp.com/

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


# For deploy
git tag 1.12.34-release 
git push origin master --tags

# For edit cron
EDITOR=nano crontab -e
* * * * * if [ $(ps aux | grep 'qualitycase.ru/auto_deploy.sh' | grep -v grep | wc -l | tr -s "\n") -lt 1 ]; then /var/www/qualitycase.ru/auto_deploy.sh > /dev/null 2>&1; fi

npm install -g bower


