#!/bin/bash

# Проверка запуска от имени root
if [[ $EUID -ne 0 ]]; then
   echo "Этот скрипт должен быть запущен от имени пользователя root" 
   exit 1
fi

# Путь к директории установки
INSTALL_DIR="/root/websites/koveh-invest"
API_DIR="$INSTALL_DIR/api"
VENV_DIR="$INSTALL_DIR/venv"
LOG_DIR="/var/log/koveh-invest"
DATA_DIR="/var/lib/koveh-invest"

# Создаем необходимые директории
echo "Создание директорий..."
mkdir -p "$INSTALL_DIR"
mkdir -p "$API_DIR"
mkdir -p "$LOG_DIR"
mkdir -p "$DATA_DIR/files"
mkdir -p "$DATA_DIR/documents"

# Копируем файлы API
echo "Копирование файлов API..."
cp -v main.py "$API_DIR/"
cp -v requirements.txt "$API_DIR/"
cp -v koveh-invest.service /etc/systemd/system/

# Настройка виртуального окружения Python
echo "Настройка виртуального окружения Python..."
python3 -m venv "$VENV_DIR"
"$VENV_DIR/bin/pip" install --upgrade pip
"$VENV_DIR/bin/pip" install -r "$API_DIR/requirements.txt"

# Настройка прав доступа
echo "Настройка прав доступа..."
chmod -R 755 "$INSTALL_DIR"
chmod -R 755 "$DATA_DIR"
chmod -R 755 "$LOG_DIR"

# Перезагрузка systemd и запуск службы
echo "Запуск службы..."
systemctl daemon-reload
systemctl enable koveh-invest.service
systemctl start koveh-invest.service

# Проверка статуса службы
echo "Проверка статуса службы..."
systemctl status koveh-invest.service

echo "Установка завершена!"
echo "API доступен по адресу: http://api.koveh.com/invest/"
echo "Для просмотра документации откройте: http://api.koveh.com/invest/docs" 