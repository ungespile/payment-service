# Устранение проблем

## Ошибка: Error creating bean with name 'liquibase'

Эта ошибка обычно возникает, когда Liquibase не может подключиться к базе данных H2.

### Решение 1: Проверьте права доступа к файлам

Убедитесь, что приложение имеет права на создание и запись в директорию `./data/`:
```bash
# Создайте директорию, если её нет
mkdir -p data
```

### Решение 2: Удалите поврежденные файлы базы данных

Если база данных была повреждена:
```bash
# Остановите приложение
# Удалите файлы базы данных
rm -rf data/
# или на Windows
rmdir /s /q data
```

Затем перезапустите приложение. Все таблицы будут созданы заново через Liquibase миграции.

### Решение 3: Проверьте настройки подключения

Убедитесь, что в `src/main/resources/application.properties` указаны правильные настройки:
```properties
spring.datasource.url=jdbc:h2:file:./data/payment_db;AUTO_SERVER=TRUE
spring.datasource.username=sa
spring.datasource.password=
```

### Решение 4: Очистите таблицы Liquibase (если они повреждены)

Если таблицы Liquibase были созданы некорректно, подключитесь к H2 Console:
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:file:./data/payment_db`
- Username: `sa`
- Password: (пусто)

Выполните SQL:
```sql
DROP TABLE IF EXISTS DATABASECHANGELOGLOCK;
DROP TABLE IF EXISTS DATABASECHANGELOG;
```

Затем перезапустите приложение.

### Решение 5: Временно отключите Liquibase для диагностики

Добавьте в `application.properties`:
```properties
spring.liquibase.enabled=false
```

Это позволит запустить приложение без миграций для проверки подключения к БД.

### Решение 6: Проверьте логи приложения

Включите детальное логирование в `application.properties`:
```properties
logging.level.liquibase=DEBUG
logging.level.org.h2=DEBUG
```

Это поможет увидеть точную причину ошибки.

## Типичные ошибки H2

### Ошибка: "Database may be already in use"
- Другое приложение или процесс использует файл базы данных
- Закройте все подключения к базе данных
- Перезапустите приложение

### Ошибка: "File not found" или "Permission denied"
- Нет прав на создание директории `./data/`
- Создайте директорию вручную: `mkdir data`
- Проверьте права доступа к файлам

### Ошибка: "Table already exists"
- Таблицы уже существуют в базе данных
- Либо удалите файл базы данных (`./data/payment_db.mv.db`), либо обновите changeSet в Liquibase

### Ошибка: "Syntax error"
- Проверьте миграции Liquibase на совместимость с H2
- Убедитесь, что используются правильные типы данных (BIGINT вместо BIGSERIAL)

## Доступ к H2 Console

Для просмотра и управления данными используйте H2 Console:
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:file:./data/payment_db`
- Username: `sa`
- Password: (оставьте пустым)

## Очистка базы данных

Для полной очистки базы данных:
```bash
# Остановите приложение
# Удалите директорию data
rm -rf data/
# или на Windows
rmdir /s /q data
```

При следующем запуске приложения база данных будет создана заново.
