FROM python:3.11-slim

# Устанавливаем системные зависимости
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Копируем весь проект в /app
COPY . /app

# Устанавливаем рабочую директорию — корень проекта, где лежит manage.py
WORKDIR /app

# Устанавливаем зависимости (обратите внимание на правильное имя файла!)
RUN pip install --no-cache-dir -r requirements.txt

# Собираем статику и запускаем Gunicorn
CMD python manage.py makemigrations --noinput && \
    python manage.py migrate --noinput && \
    python manage.py collectstatic --noinput && \
    gunicorn --bind 0.0.0.0:8000 loldraft.wsgi:application