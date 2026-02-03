# CRM для Review Business Opportunities

Система управления бизнес-возможностями (аналог Affinity CRM) для команды 10-50 человек.

## Особенности

- Управление контактами, компаниями и бизнес-возможностями
- Pipeline с 5 фиксированными стадиями (Скрининг, Дипдайв, Дью Дилидженс, Сайнинг, Closed)
- Система напоминаний с email-уведомлениями
- Аналитические дашборды (воронка продаж, конверсия, топ менеджеров)
- Импорт данных из CSV/Excel
- Кастомные поля
- Управление пользователями с ролями (Admin/User)
- JWT аутентификация

## Технологический стек

**Backend:**
- Node.js + Express + TypeScript
- PostgreSQL
- JWT для аутентификации
- Nodemailer для email-уведомлений
- Node-cron для планировщика задач

**Frontend:**
- React + TypeScript
- React Router для навигации
- Axios для HTTP запросов
- Recharts для графиков

**Infrastructure:**
- Docker + Docker Compose
- PostgreSQL в контейнере

## Быстрый старт

### Предварительные требования

- Docker и Docker Compose установлены
- Node.js 18+ (для локальной разработки без Docker)

### Установка и запуск с Docker

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Создайте файл `.env` на основе `.env.example`:
```bash
cp .env.example .env
```

3. Отредактируйте `.env` файл и укажите свои настройки, особенно SMTP для email-уведомлений.

4. Запустите приложение:
```bash
docker-compose up --build
```

5. Приложение будет доступно:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5432

### Первый вход

1. Зарегистрируйте первого пользователя через UI (он автоматически получит роль `user`)
2. Для создания администратора, подключитесь к базе данных:
```bash
docker exec -it crm-db psql -U crm_user -d crm_db
UPDATE users SET role = 'admin' WHERE email = 'ваш@email.com';
\q
```

## Структура проекта

```
.
├── server/                 # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/        # Конфигурация БД и email
│   │   ├── models/        # Модели данных
│   │   ├── controllers/   # Бизнес-логика
│   │   ├── routes/        # API маршруты
│   │   ├── middleware/    # Middleware (auth, роли)
│   │   ├── services/      # Сервисы (email, напоминания, импорт)
│   │   └── index.ts       # Entry point
│   ├── migrations/        # SQL миграции
│   └── seeds/             # Демо данные
├── client/                # Frontend (React)
│   └── src/
│       ├── api/           # API клиент
│       ├── components/    # React компоненты
│       ├── pages/         # Страницы
│       ├── context/       # React Context (Auth)
│       └── types/         # TypeScript типы
├── docker-compose.yml     # Docker конфигурация
├── Dockerfile.server      # Docker для backend
├── Dockerfile.client      # Docker для frontend
└── README.md
```

## API Документация

### Аутентификация

**POST /api/auth/register**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**POST /api/auth/login**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**GET /api/auth/me**
Headers: `Authorization: Bearer <token>`

### Компании

- GET /api/companies - Получить все компании
- GET /api/companies/:id - Получить компанию по ID
- POST /api/companies - Создать компанию
- PUT /api/companies/:id - Обновить компанию
- DELETE /api/companies/:id - Удалить компанию

### Контакты

- GET /api/contacts - Получить все контакты
- GET /api/contacts/:id - Получить контакт по ID
- POST /api/contacts - Создать контакт
- PUT /api/contacts/:id - Обновить контакт
- DELETE /api/contacts/:id - Удалить контакт

### Opportunities

- GET /api/opportunities - Получить все opportunities
- GET /api/opportunities/:id - Получить opportunity по ID
- POST /api/opportunities - Создать opportunity
- PUT /api/opportunities/:id - Обновить opportunity
- DELETE /api/opportunities/:id - Удалить opportunity
- POST /api/opportunities/:id/comments - Добавить комментарий
- POST /api/opportunities/:id/reminders - Добавить напоминание

### Dashboard

- GET /api/dashboard/overview - Общая статистика
- GET /api/dashboard/funnel - Данные воронки по стадиям
- GET /api/dashboard/conversion - Конверсия между стадиями
- GET /api/dashboard/timeline - Динамика по времени
- GET /api/dashboard/top-managers - Топ менеджеров

### Import

- POST /api/import/parse - Парсинг заголовков файла
- POST /api/import/import - Импорт данных

## Функциональность

### Pipeline стадии

1. **Screening** - первичная оценка opportunity
2. **Deep Dive** - глубокое изучение
3. **Due Diligence** - проверка и верификация
4. **Signing** - подписание документов
5. **Closed** - сделка закрыта (Won/Lost)

### Роли пользователей

**Admin:**
- Управление пользователями
- Удаление любых данных
- Все права User

**User:**
- Создание/редактирование контактов, компаний, opportunities
- Удаление только своих данных
- Просмотр всех данных

### Напоминания

- Cron job проверяет напоминания каждые 5 минут
- Email-уведомления отправляются автоматически
- Поддерживается SMTP (Gmail, SendGrid и др.)

### Импорт данных

- Поддержка CSV и Excel файлов
- Маппинг колонок через UI
- Импорт контактов, компаний и opportunities
- Обработка ошибок и отчет о результатах

## Настройка email-уведомлений

### Gmail

1. Включите "2-Step Verification" в вашем Google аккаунте
2. Создайте "App Password" для приложения
3. Укажите в `.env`:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ваш-email@gmail.com
SMTP_PASSWORD=app-password
SMTP_FROM=ваш-email@gmail.com
```

### SendGrid

```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=ваш-sendgrid-api-key
SMTP_FROM=noreply@yourdomain.com
```

## Разработка

### Локальная разработка без Docker

**Backend:**
```bash
cd server
npm install
npm run dev
```

**Frontend:**
```bash
cd client
npm install
npm start
```

**База данных:**
Установите PostgreSQL и создайте базу данных, затем выполните миграцию:
```bash
psql -U postgres -d crm_db -f server/migrations/001_initial_schema.sql
```

## Тестирование

Демо данные можно загрузить из `server/seeds/demo_data.sql`:
```bash
docker exec -i crm-db psql -U crm_user -d crm_db < server/seeds/demo_data.sql
```

## Production Deployment

1. Измените JWT_SECRET на случайную строку
2. Настройте production SMTP сервис
3. Используйте реальную PostgreSQL базу данных
4. Настройте SSL/TLS для HTTPS
5. Настройте rate limiting и другие меры безопасности

## Лицензия

MIT

## Поддержка

Для вопросов и issues: создайте issue в репозитории
