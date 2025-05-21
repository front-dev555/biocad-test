# Biocad Test Backend

Бэкенд-приложение на Node.js (TypeScript, Express) с использованием Prisma и PostgreSQL.

---

## Описание

Это REST API для регистрации, авторизации и управления пользователями. Использует:
- **Express** для серверной логики
- **Prisma** для работы с PostgreSQL
- **JWT** для авторизации
- **Docker** для контейнеризации
- **Jest** для тестирования

---

## Быстрый старт (локально)

1. **Установи зависимости:**
   ```sh
   npm install
   ```

2. **Создай файл `.env` в папке `back`:**
   ```
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/biocad
   JWT_SECRET=your_jwt_secret
   ```

3. **Запусти PostgreSQL** (например, через Docker):
   ```sh
   docker run --name biocad-test-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=biocad -p 5432:5432 -d postgres:15
   ```

4. **Применить миграции и сгенерировать Prisma Client:**
   ```sh
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Собери и запусти сервер:**
   ```sh
   npm run build
   npm start
   ```
   Сервер будет доступен на [http://localhost:4200](http://localhost:4200) (или другой порт, если указан).

---

## Запуск в Docker

1. **Создай файл `.env` в папке `back`:**
   ```
   DATABASE_URL=postgres://postgres:postgres@db:5432/biocad
   JWT_SECRET=your_jwt_secret
   ```

2. **Запусти всё через docker-compose:**
   ```sh
   docker-compose up --build
   ```
   - Бэкенд будет доступен на [http://localhost:4200](http://localhost:4200) (или другой порт, см. docker-compose.yaml).
   - База данных — на порту 5433.

---

## Основные команды

- `npm run build` — компиляция TypeScript в папку `dist/`
- `npm start` — запуск собранного приложения
- `npm run dev` — запуск в режиме разработки (nodemon + ts-node)
- `npx prisma migrate dev` — применение миграций Prisma (локально)
- `npx prisma generate` — генерация Prisma Client
- `npm test` — запуск тестов (Jest)

---

## Важно про Prisma

- **Prisma Client должен быть сгенерирован для той платформы, где запускается сервер!**
- В Docker-контейнере Prisma Client генерируется автоматически при сборке.
- Если меняешь схему в `prisma/schema.prisma`, не забудь выполнить миграцию и генерацию клиента:
  ```sh
  npx prisma migrate dev
  npx prisma generate
  ```

---

## Тесты

- Тесты лежат в папке `tests/`
- Запуск тестов:
  ```sh
  npm test
  ```

---

## Прочее

- Линтер: `npm run lint`
- Форматирование: `npm run format`

---

## Структура проекта

```
back/
  src/            # исходный код приложения
  prisma/         # схема Prisma и миграции
  dist/           # собранный JS-код
  tests/          # тесты
  .env            # переменные окружения
  Dockerfile
  docker-compose.yaml
```

---

**Если возникнут вопросы — смотри логи контейнеров или обращайся к документации Prisma и Express!**

# Mobile App

Мобильное приложение на React Native + Expo с авторизацией и просмотром пользователей.

## Требования

- Node.js (версия 16 или выше)
- npm или yarn
- Expo Go на мобильном устройстве
- Backend сервер запущен в Docker

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл `.env` в корне проекта:
```bash
# Замените IP-адрес на IP вашего компьютера в локальной сети
# Важно: используйте IP компьютера, а не localhost!
# Чтобы можно было запустить на телефоне и был доступ к бэку
# Пример: API_URL=http://192.168.1.42:4200
API_URL=http://<ваш-локальный-ip>:4200
```

Чтобы узнать ваш IP-адрес:
- MacOS: `ipconfig getifaddr en0`
- Linux: `hostname -I`
- Windows: `ipconfig`

## Запуск

1. Убедитесь, что backend запущен в Docker и доступен по указанному в `.env` адресу

2. Запустите приложение:
```bash
npx expo start
```

3. Отсканируйте QR-код с помощью:
- iOS: камера телефона
- Android: приложение Expo Go

## Проверка подключения

1. Убедитесь, что телефон и компьютер в одной Wi-Fi сети

2. Проверьте доступность backend:
   - Откройте в браузере телефона `http://<ваш-локальный-ip>:4000`
   - Должна появиться страница API или сообщение "Cannot GET /"

## Очистка кэша

Если возникли проблемы, попробуйте очистить кэш:
```bash
npx expo start -c
```

## Возможные проблемы

1. **Ошибка подключения к API**:
   - Проверьте правильность IP-адреса в `.env`
   - Убедитесь, что backend запущен
   - Проверьте firewall/брандмауэр

2. **QR код не сканируется**:
   - Убедитесь, что телефон и компьютер в одной сети
   - Попробуйте переподключиться к Wi-Fi

3. **Не работает авторизация**:
   - Проверьте консоль приложения на наличие ошибок
   - Убедитесь, что API_URL указан верно

## Функционал

- Регистрация и авторизация
- Просмотр списка пользователей
- Выход из аккаунта
- Сохранение сессии
- Валидация форм

## Технологии

- React Native
- Expo
- TypeScript
- Axios
- React Navigation
- Secure Store для хранения токенов
