# Payment Service

Сервис для управления платежами на Java 17 с использованием Spring Boot 3, H2 Database и Liquibase.

## Требования

- Java 17 или выше
- Maven 3.6+

## Настройка базы данных

Проект использует **H2 Database** - встроенную базу данных Java, которая не требует дополнительной установки или настройки.

### Автоматическая настройка

База данных H2 автоматически создается при первом запуске приложения. Данные сохраняются в файл `./data/payment_db.mv.db` в корне проекта.

### H2 Console

Для просмотра и управления данными доступна веб-консоль H2:
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:file:./data/payment_db`
- Username: `sa`
- Password: (пусто)

### Настройки базы данных

Настройки в `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:h2:file:./data/payment_db;AUTO_SERVER=TRUE
spring.datasource.username=sa
spring.datasource.password=
```

### Удаление данных

Для очистки базы данных просто удалите файл `./data/payment_db.mv.db` и перезапустите приложение. Все таблицы будут созданы заново через Liquibase миграции.

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

### 3. Получение всех payment requests по operator_id
**GET** `/api/operator/{operatorId}/payment-requests`

Параметры пути:
- `operatorId`: ID оператора

Ответ при успехе:
```json
[
  {
    "id": 1,
    "operatorId": 1,
    "accountId": 1,
    "amount": 1000.50,
    "isApproved": false
  },
  {
    "id": 2,
    "operatorId": 1,
    "accountId": 2,
    "amount": 500.00,
    "isApproved": true
  }
]
```

Если запросов нет, возвращается пустой массив `[]`.

### 4. Одобрение payment request
**PUT** `/api/operator/payment-requests/{paymentRequestId}/approve`

Параметры пути:
- `paymentRequestId`: ID payment request для одобрения

Ответ при успехе:
```json
{
  "id": 1,
  "operatorId": 1,
  "accountId": 1,
  "amount": 1000.50,
  "isApproved": true
}
```

Ответ при ошибке (payment request не найден):
- HTTP статус: `404 Not Found`

### 5. Создание запроса на вывод средств
**POST** `/api/cashout/request`

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

## Логика выбора аккаунта и оператора

При создании запроса на пополнение баланса или вывод средств система:
1. Выбирает первую запись из таблицы `accounts` с условиями:
   - `is_active = true`
   - `unchecked_available_amount < amount` (запрошенная сумма)
   - Аккаунты сортируются по `id` в порядке возрастания
2. Автоматически определяет `operator_id` из выбранного аккаунта (`accounts.operator_id`)
3. Создает запись в соответствующей таблице (`payment_requests` или `cashout_requests`) с определенным `operator_id` и `account_id`

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
  -d '{"amount":500.00}'
```

### Получение всех payment requests по operator_id
```bash
curl -X GET http://localhost:8080/api/operator/1/payment-requests
```

### Одобрение payment request
```bash
curl -X PUT http://localhost:8080/api/operator/payment-requests/1/approve
```

### Создание запроса на вывод средств
```bash
curl -X POST http://localhost:8080/api/cashout/request \
  -H "Content-Type: application/json" \
  -d '{"amount":300.00}'
```
