@ECHO OFF
ECHO "Деплой: загрузка проекта..."
ECHO Start %time%
git pull origin master
ECHO "Деплой: установка зависимостей..."
npm i
ECHO "Деплой: перезагрузка проекта..."
pm2 reload 4 || true
ECHO End %time%
ECHO "Деплой: успешно выполнено."