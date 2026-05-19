# Office Web — Интерактивные задания по информатике

Веб-приложение для подготовки к заданиям по информатике, связанным с пакетом Microsoft Office. Проект содержит интерактивные тренажёры по Excel, Word, PowerPoint и КуМир.

## 📋 Разделы

### Excel

Интерактивные задания по работе с электронными таблицами:

- **Сумм** (`summ.html`) — вычисление суммы по условию
- **СуммЕсли** (`summesli.html`) — сумма с условием
- **СуммЕслиМн** (`summeslimn.html`) — сумма по множественным условиям
- **СрЗнач** (`srznach.html`) — среднее значение
- **СрЗначЕсли** (`srznachesli.html`) — среднее значение с условием
- **СрЗначЕслиМн** (`srznacheslimn.html`) — среднее по множественным условиям
- **Счёт** (`schet.html`) — подсчёт значений
- **СчётЕсли** (`schetesli.html`) — подсчёт с условием
- **СчётЕслиМн** (`scheteslimn.html`) — подсчёт по множественным условиям
- **Мин/Макс** (`min.html`, `maks.html`) — поиск минимального/максимального значения
- **МинЕсли/МаксЕсли** (`minesli.html`, `maksesli.html`) — с условием
- **И/ИЛИ/НЕ** (`i.html`, `ili.html`, `ne.html`) — логические функции
- **ЕСЛИ** (`esli.html`) — условные вычисления
- **Адресация** (`adresacia.html`) — типы ссылок (абсолютные, относительные, смешанные)
- **ОГЭ 14** (`oge14.html`, `oge14-important.html`) — задания по электронным таблицам из ОГЭ

### Word

- Раздел с материалами по Microsoft Word (`word/index.html`)

### PowerPoint

- Раздел с материалами по Microsoft PowerPoint (`powerpoint/index.html`)

### КуМир

- Раздел с материалами по учебной среде программирования КуМир (`kumir/index.html`)

## 🛠️ Технологии

- **HTML5** — структура страниц
- **CSS3** — стилизация, адаптивный дизайн
- **JavaScript** — интерактивность, логика проверки заданий

## 🚀 Запуск

Просто откройте `index.html` в браузере или запустите локальный сервер:

```bash
# С помощью Python
python -m http.server 8000

# С помощью Node.js
npx serve
```

Затем откройте http://localhost:8000 в браузере.

## 📁 Структура проекта

```
office-web/
├── index.html                 # Главная страница
├── README.md                  # Документация проекта
├── excel/                     # Тренажёры по Excel
│   ├── index.html             #    Главная по Excel
│   ├── adresacia.html         #    Адресация ячеек
│   ├── esli.html              #    Функция ЕСЛИ
│   ├── i.html / ili.html / ne.html  #    Логические функции
│   ├── maks.html / min.html   #    Максимум / Минимум
│   ├── maksesli.html / minesli.html  #    МаксЕсли / МинЕсли
│   ├── schet.html             #    Счёт
│   ├── schetesli.html         #    СчётЕсли
│   ├── scheteslimn.html       #    СчётЕслиМн
│   ├── srznach.html           #    Среднее значение
│   ├── srznachesli.html       #    СреднееЕсли
│   ├── srznacheslimn.html     #    СреднееЕслиМн
│   ├── summ.html              #    Сумма
│   ├── summesli.html          #    СуммаЕсли
│   ├── summeslimn.html        #    СуммаЕслиМн
│   ├── oge14.html             #    ОГЭ электронные таблицы
│   └── oge14-important.html   #    ОГЭ Важное
├── word/                      # Материалы по Word
│   └── index.html
├── powerpoint/                # Материалы по PowerPoint
│   └── index.html
└── kumir/                     # Материалы по КуМир
    └── index.html
```

## ✨ Особенности

- **Интерактивная проверка** — мгновенная обратная связь при вводе ответов
- **Навигация** — удобное переключение между темами и разделами
- **Все темы Excel** — охвачены основные функции и приёмы работы с электронными таблицами

## 🤝 Вклад в развитие

Приветствуются pull request'ы с улучшениями, исправлениями багов и новыми тренажёрами!

## 📄 Лицензия

MIT License

Copyright (c) 2026 Безуглов Сергей

---

## 👤 Автор

**Безуглов Сергей**

- GitHub: [@BesuglovS](https://github.com/BesuglovS)
- Repository: [https://github.com/BesuglovS/office-web](https://github.com/BesuglovS/office-web)
