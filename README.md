# Payment Service

Сервис для управления платежами на Java 17 с использованием Spring Boot 3, PostgreSQL и Liquibase.

## Требования

- Java 17 или выше
- Maven 3.6+
- Docker и Docker Compose (для запуска PostgreSQL) или PostgreSQL 12+

## Настройка базы данных

### Вариант 1: Использование Docker (рекомендуется)

1. Запустите PostgreSQL контейнер:
```bash
docker-compose up -d
```

2. База данных будет доступна по адресу `localhost:5432` с настройками:
   - Database: `payment_db`
   - Username: `postgres`
   - Password: `postgres`

3. Настройки в `src/main/resources/application.properties` уже настроены для работы с Docker контейнером.

### Вариант 2: Локальная установка PostgreSQL

1. Создайте базу данных PostgreSQL:
```sql
CREATE DATABASE payment_db;
```

2. Обновите настройки подключения в `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/payment_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Остановка Docker контейнера

Для остановки PostgreSQL контейнера:
```bash
docker-compose down
```

Для остановки и удаления данных:
```bash
docker-compose down -v
```

## Структура базы данных

### Таблица `operators`
- `operator_id` (BIGSERIAL, PRIMARY KEY)
- `username` (VARCHAR(255), UNIQUE, NOT NULL)
- `password` (VARCHAR(255), NOT NULL)

### Таблица `accounts`
- `id` (BIGSERIAL, PRIMARY KEY)
- `operator_id` (BIGINT, FOREIGN KEY -> operators)
- `account_number` (VARCHAR(255), UNIQUE, NOT NULL)
- `available_amount` (DECIMAL(19,2), NOT NULL)
- `unchecked_available_amount` (DECIMAL(19,2), NOT NULL)
- `is_active` (BOOLEAN, NOT NULL)
- `is_used` (BOOLEAN, NOT NULL)

### Таблица `payment_requests`
- `id` (BIGSERIAL, PRIMARY KEY)
- `operator_id` (BIGINT, FOREIGN KEY -> operators)
- `account_id` (BIGINT, FOREIGN KEY -> accounts)
- `amount` (DECIMAL(19,2), NOT NULL)
- `is_approved` (BOOLEAN, NOT NULL)

### Таблица `cashout_requests`
- `id` (BIGSERIAL, PRIMARY KEY)
- `operator_id` (BIGINT, FOREIGN KEY -> operators)
- `account_id` (BIGINT, FOREIGN KEY -> accounts)
- `amount` (DECIMAL(19,2), NOT NULL)
- `is_approved` (BOOLEAN, NOT NULL)

## Сборка и запуск

### Сборка проекта
```bash
mvn clean install
```

### Запуск приложения
```bash
mvn spring-boot:run
```

Или запустите JAR файл:
```bash
java -jar target/payment-service-1.0.0.jar
```

Приложение будет доступно по адресу: `http://localhost:8080`

## API Endpoints

### 1. Авторизация
**POST** `/api/auth/login`

Тело запроса:
```json
{
  "username": "operator1",
  "password": "password123"
}
```

Ответ при успехе:
```json
{
  "success": true,
  "message": "Login successful",
  "operatorId": 1,
  "username": "operator1"
}
```

Ответ при ошибке:
```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

### 2. Пополнение баланса
**POST** `/api/payment/top-up`

Заголовки:
- `X-Operator-Id`: ID оператора (обязательно)

Тело запроса:
```json
{
  "amount": 1000.50
}
```

Ответ при успехе:
```json
{
  "success": true,
  "message": "Payment request created successfully",
  "paymentRequestId": 1,
  "accountId": 1,
  "amount": 1000.50
}
```

Ответ при ошибке (аккаунт не найден):
```json
{
  "success": false,
  "message": "No active account found with unchecked_available_amount less than the requested amount"
}
```

### 3. Создание запроса на вывод средств
**POST** `/api/cashout/request`

Заголовки:
- `X-Operator-Id`: ID оператора (обязательно)

Тело запроса:
```json
{
  "amount": 500.00
}
```

Ответ при успехе:
```json
{
  "success": true,
  "message": "Cashout request created successfully",
  "cashoutRequestId": 1,
  "accountId": 1,
  "amount": 500.00
}
```

Ответ при ошибке (аккаунт не найден):
```json
{
  "success": false,
  "message": "No active account found with unchecked_available_amount less than the requested amount"
}
```

## Логика выбора аккаунта

При создании запроса на пополнение баланса система выбирает первую запись из таблицы `accounts` с условиями:
- `is_active = true`
- `unchecked_available_amount < amount` (запрошенная сумма)

Аккаунты сортируются по `id` в порядке возрастания.

## Примеры использования

### Авторизация
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"operator1","password":"password123"}'
```

### Пополнение баланса
```bash
curl -X POST http://localhost:8080/api/payment/top-up \
  -H "Content-Type: application/json" \
  -H "X-Operator-Id: 1" \
  -d '{"amount":500.00}'
```

### Создание запроса на вывод средств
```bash
curl -X POST http://localhost:8080/api/cashout/request \
  -H "Content-Type: application/json" \
  -H "X-Operator-Id: 1" \
  -d '{"amount":300.00}'
```
