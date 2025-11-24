#!/bin/bash

# Остановка и удаление существующего контейнера, если он существует
docker stop stock-analytics-container 2>/dev/null || true
docker rm stock-analytics-container 2>/dev/null || true

# Сборка Docker-образа
echo "Сборка Docker-образа..."
docker build -t stock-analytics-image .

# Запуск контейнера на порту 3001
echo "Запуск контейнера на порту 3001..."
docker run -d --name stock-analytics-container -p 3001:3001 stock-analytics-image

# Проверка статуса контейнера
echo "Проверка статуса контейнера..."
docker ps | grep stock-analytics-container

echo "Приложение доступно по адресу: http://localhost:3001" 