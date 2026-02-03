# Quick Start Guide

## Запуск приложения за 5 минут

### 1. Предварительные требования
- Docker и Docker Compose установлены на вашем компьютере

### 2. Клонирование и настройка

```bash
# Перейдите в директорию проекта
cd /path/to/project

# Создайте .env файл
cp .env.example .env

# (Опционально) Отредактируйте .env для настройки email
```

### 3. Запуск

```bash
# Запустите все сервисы
docker-compose up --build
```

Подождите 2-3 минуты пока все контейнеры запустятся и соберутся.

### 4. Доступ к приложению

- Откройте браузер: http://localhost:3000
- API: http://localhost:3001

### 5. Первый вход

1. Нажмите "Зарегистрироваться"
2. Введите email и пароль
3. Войдите в систему

### 6. Создание администратора

Для получения прав администратора:

```bash
# Подключитесь к базе данных
docker exec -it crm-db psql -U crm_user -d crm_db

# Измените роль пользователя
UPDATE users SET role = 'admin' WHERE email = 'ваш@email.com';

# Выйдите
\q
```

Перезайдите в приложение, и у вас появится доступ к разделу "Пользователи".

### 7. Загрузка демо данных (опционально)

```bash
# Загрузите демо данные
docker exec -i crm-db psql -U crm_user -d crm_db < server/seeds/demo_data.sql
```

Это добавит:
- 3 пользователя (admin@crm.local, john@crm.local, jane@crm.local)
- 5 компаний
- 7 контактов
- 7 opportunities
- Комментарии и напоминания

**Пароль для всех демо пользователей:** password123

### 8. Остановка приложения

```bash
# Ctrl+C для остановки
# Или в другом терминале:
docker-compose down
```

## Основные возможности

### Компании
- Управление списком компаний
- Добавление описания, отрасли, веб-сайта
- Связь с контактами и opportunities

### Контакты
- Управление контактными лицами
- Привязка к компаниям
- Email и телефон

### Opportunities (Возможности)
- 5 стадий pipeline:
  1. Скрининг
  2. Дипдайв
  3. Дью Дилидженс
  4. Сайнинг
  5. Закрыто (Won/Lost)
- Сумма сделки
- Дата закрытия
- Комментарии
- Напоминания

### Dashboard
- Общая статистика
- Воронка продаж
- Конверсия между стадиями
- Топ менеджеров

### Импорт
- Загрузка CSV или Excel
- Маппинг колонок
- Импорт компаний, контактов, opportunities

## Настройка Email-уведомлений

Для работы напоминаний нужно настроить SMTP в `.env`:

### Gmail:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ваш-email@gmail.com
SMTP_PASSWORD=app-password-из-google
SMTP_FROM=ваш-email@gmail.com
```

Создайте App Password: https://myaccount.google.com/apppasswords

### SendGrid:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=ваш-sendgrid-api-key
SMTP_FROM=noreply@yourdomain.com
```

## Разработка без Docker

### Backend:
```bash
cd server
npm install
npm run dev
```

### Frontend:
```bash
cd client
npm install
npm start
```

### База данных:
```bash
# Создайте БД
createdb crm_db

# Выполните миграцию
psql -d crm_db -f server/migrations/001_initial_schema.sql

# (Опционально) Загрузите демо данные
psql -d crm_db -f server/seeds/demo_data.sql
```

## Troubleshooting

### Порты заняты
Если порты 3000, 3001 или 5432 заняты, измените их в `docker-compose.yml`.

### База данных не инициализируется
```bash
docker-compose down -v
docker-compose up --build
```

### Ошибки npm
```bash
docker-compose down
rm -rf server/node_modules client/node_modules
docker-compose up --build
```

## Поддержка

Создайте issue в репозитории для вопросов и проблем.
