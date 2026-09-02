# AGENTS.md — Инструкции для ИИ-ассистентов

Статический образовательный сайт по MS Office / LibreOffice (Excel-тренажёры, 21 тема; Word, PowerPoint,
КуМир — по 1 странице) для подготовки к ОГЭ по информатике. Чистый HTML/CSS/vanilla JS без сборки.
Русский язык, русская локаль Excel (`=СУММ(...)` через `;`). Деплой: `office.nayanovaacademy.ru`
(в канонических ссылках также фигурирует `nayanovaacademy.ru/office-web/` — уточняйте авторитетный URL перед правкой canonical).

## ⚠️ Критические правила

1. **Не перезапускать `update-html.cjs` / `update-remaining.cjs`** — это одноразовые разрушительные
   миграционные скрипты (июль 2026): срезают inline-`style`, добавляют meta/SW/скрипты. Не идемпотентны, без бэкапа.
2. **`sw.js`**: при изменении статики **поднять `CACHE_NAME`** (сейчас `office-web-v2`) и `?v=` на
   `style.css`, иначе браузеры отдают старый кэш. nginx шлёт `no-cache` для `sw.js`, `tracking-client.js`,
`progress-client.js` и `progress-sync.js` (все без content-hash).
3. **Три системы прогресса должны быть согласованы**: `progress.js` (ключ `office-web-progress`;
   в ARCHITECTURE.md ошибочно указан `office-progress`), `progress-client.js` (`nayanova-progress`),
   `progress-sync.js` (читает `data/topics.json` для итога, fallback 21). Серверный синк — только на `index.html`.
4. **`data/topics.json` ↔ `assets/js/topic-nav.js` (`TOPIC_ORDER`) ↔ `sitemap.xml` держать в синхроне**
   при добавлении/переименовании тем. `topics.json` не используется для рендера страниц.
5. **`css/design-tokens.css` не подключён** ни на одной странице (экосистемный токен-файл под будущую тёмную тему). Не удалять, не предполагать использование.
6. **Экосистемные файлы `progress-client.js`, `progress-sync.js`, `tracking-client.js` — вендоренные копии**
   из `auth-web`/`na-web/shared/`. Правки — через канонический источник + синк.
7. **Тренажёры встроены инлайн в каждую страницу** (`checkAnswer(qNum, expected)` — свой state-machine
   на страницу); `mini-test.js` — единственный общий хелпер квизов. Не выносите тренажёры в общий модуль
   без регресс-проверки всех 21 страниц.
8. **`oge14-trainer.html` вызывает несуществующие глобалы** (`window.trackTrainerAnswer` и др.) под
   guard'ом `typeof ... === 'function'` — молча no-op. Это точка интеграции, если подключать.
9. **`.env` gitignored** (SSH-параметры), из tar исключён. Не печатать/коммитить.
10. **Рабочее дерево впереди git** (правки `progress-sync.js`, `deploy.ps1`, `index.html`; untracked
    `tracking-client.js`, nginx-конфиг) — это активная фича «unified progress», не откатывать.

## 🔧 Команды

```bash
python -m http.server 8000   # локальный dev-сервер
.\deploy.ps1 -DryRun         # сухой прогон
.\deploy.ps1                 # деплой
```

Сборки, линтера, тестов, CI — **нет**. Проверка вручную в браузере (разные разрешения).

## 🏗 Структура

```
index.html               # лендинг (3 карточки Word/Excel/PowerPoint) + progress/tracking скрипты
excel/                   # 21 страница-тема (adresacia, summ, summesli, srznach, schet, min/max, i/ili/ne/esli, oge14-*)
word/, powerpoint/, kumir/   # по 1 index.html (теория)
assets/css/styles.css    # единственный живой стиль; design-tokens.css НЕ подключён
assets/js/topic-nav.js   # prev/next навигация + TOPIC_ORDER
assets/js/progress.js    # localStorage office-web-progress
assets/js/mini-test.js   # checkMiniTest() для встроенных квизов
assets/js/analytics.js   # Yandex.Metrika 107219928 (window.OfficeAnalytics)
assets/js/progress-client.js, progress-sync.js, tracking-client.js  # экосистемные копии (index.html)
data/topics.json         # реестр тем (только data-файл)
manifest.json, sw.js, offline.html, 404.html, favicon.svg
robots.txt, sitemap.xml  # на nayanovaacademy.ru/office-web/
.htaccess                # легаси (Apache); прод — nginx
deploy.ps1, office.nayanovaacademy.ru (nginx)
```

## 📝 Редактирование контента

Скелет страницы-урока: `<head>` (title, description, styles.css, favicon, manifest, canonical, Metrika) →
`.container role="main"` → `.nav-links` (back-link) → `<h1>` → `.theory-section` (`.formula-box`,
`.example-box`, `.tip-box`, `.warning-box`, `.function-syntax`, таблицы, `.step-card`) → опц. `#miniTest`
и `.trainer-container` → скрипты `topic-nav.js` + `progress.js` + `analytics.js` + SW-registration → `.quick-nav`.
Body-классы: `page-{section} page-{topic}` (напр. `page-excel page-summ`).

## 💻 Конвенции кода

- **JS**: ES5-стиль (без стрелок/`const`/`let` вне scope), IIFE, глобалы `window.OfficeProgress`,
  `window.OfficeAnalytics`, `window.NayanovaProgress`, `window.NayanovaTrack`, `'use strict'`.
- **CSS**: переменные `--color-*` в `:root` (styles.css), `--na-*` (design-tokens.css), kebab-case классы,
  брейкпоинты 1024/768/600/480px.
- **HTML**: валидный HTML5, семантика, ARIA (`role="main"`, `aria-label`), эмодзи в заголовках, `lang="ru"`.
- Имена файлов/CSS — kebab-case; JS-ID — camelCase.
- Контент — **русский**, русская Excel-локаль (аргументы через `;`).

## 🚀 Деплой (`deploy.ps1`)

1. `.env` → SSH-переменные; `icacls` ключа.
2. `tar` проекта (без `.git`, `.env`, `deploy.ps1`, nginx-конфига, IDE/лог-файлов) → SSH.
3. Удалённо: `rm -rf {remotePath}/*` → распаковка.
4. Если есть локальный nginx-конфиг: `scp` → `/etc/nginx/sites-available/` → `nginx -t && systemctl reload nginx`.

⚠️ Деплой стирает удалённую директорию. Требования: nginx, SSL `/etc/ssl/certs/nayanovaacademy.ru/`,
root `/var/www/office.nayanovaacademy.ru/public`, `try_files ... /index.html`, static `immutable 30d`.

## 🔒 Безопасность

- `.env` и `G:\WebSites\na\ssh-private.key` — никогда не печатать/коммитить.
- Не менять массово переносы строк (CRLF/LF) в HTML/JS — гигантские диффы и риск для SW.
- Остатки после миграции (пустые `style=""`, лишние пустые строки перед `</body>`) — косметика, не «чинить» массово.