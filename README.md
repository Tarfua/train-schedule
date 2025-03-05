# Train Schedule App

Проект додатку розкладу поїздів, що складається з фронтенду на Next.js та бекенду на NestJS.

## Структура проекту

```
TrainScheduleApp/
├── frontend/         # Next.js фронтенд-додаток
├── backend/          # NestJS бекенд-додаток
├── .gitignore        # Глобальний .gitignore для всього проекту
└── README.md         # Цей файл
```

## Початок роботи

### Передумови

- Node.js (версія 18.x або вище)
- npm (версія 9.x або вище)

### Встановлення

1. Клонуйте репозиторій:
   ```bash
   git clone <repository-url>
   cd TrainScheduleApp
   ```

2. Встановіть залежності для фронтенду:
   ```bash
   cd frontend
   npm install
   ```

3. Встановіть залежності для бекенду:
   ```bash
   cd ../backend
   npm install
   ```

### Запуск для розробки

#### Фронтенд:
```bash
cd frontend
npm run dev
```

Фронтенд буде доступний за адресою: http://localhost:3000

#### Бекенд:
```bash
cd backend
npm run start:dev
```

Бекенд буде доступний за адресою: http://localhost:5000

## Ліцензія

[MIT](LICENSE) 