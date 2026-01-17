#!/bin/bash

# setup_and_run.sh — скрипт для быстрой настройки и запуска LoL-Drafter

set -e  # Прервать выполнение при любой ошибке

echo "🐍 Создание виртуального окружения..."
python -m venv .venv

echo "✅ Активация виртуального окружения..."
source .venv/bin/activate

echo "📦 Установка зависимостей..."
pip install -r requirements.txt

echo "🗃️  Применение миграций..."
python manage.py makemigrations
python manage.py migrate

echo "📂 Сбор статических файлов..."
python manage.py collectstatic --noinput

echo "🚀 Запуск сервера разработки..."
python manage.py runserver 0.0.0.0:8000