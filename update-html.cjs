// Mass HTML updater for office-web - v2 (fixed)
const fs = require('fs');
const path = require('path');

const EXCEL_DIR = path.join(__dirname, 'excel');

// Meta descriptions for each Excel topic
const META = {
  'adresacia': 'Адресация в Excel — относительные, абсолютные и смешанные ссылки. Символ доллара ($) в формулах электронных таблиц.',
  'esli': 'Функция ЕСЛИ в Excel — синтаксис, примеры, вложенные условия. Условный оператор для вычислений в электронных таблицах.',
  'i': 'Функция И в Excel — логическое умножение (конъюнкция). Синтаксис, таблица истинности, примеры использования.',
  'ili': 'Функция ИЛИ в Excel — логическое сложение (дизъюнкция). Синтаксис, таблица истинности, примеры.',
  'ne': 'Функция НЕ в Excel — логическое отрицание (инверсия). Синтаксис, таблица истинности, примеры.',
  'maks': 'Функция МАКС в Excel — нахождение максимального значения в диапазоне. Синтаксис и примеры.',
  'min': 'Функция МИН в Excel — нахождение минимального значения в диапазоне. Синтаксис и примеры использования.',
  'maksesli': 'Функция МАКСЕСЛИ в Excel — максимальное значение по условию. Синтаксис, примеры, особенности.',
  'minesli': 'Функция МИНЕСЛИ в Excel — минимальное значение по условию. Синтаксис, примеры, особенности.',
  'summ': 'Функция СУММ в Excel — синтаксис, примеры, особенности. Научитесь суммировать числа в диапазонах ячеек.',
  'summesli': 'Функция СУММЕСЛИ в Excel — суммирование по одному условию. Синтаксис и примеры использования.',
  'summeslimn': 'Функция СУММЕСЛИМН в Excel — суммирование по нескольким условиям. Синтаксис и примеры.',
  'srznach': 'Функция СРЗНАЧ в Excel — вычисление среднего арифметического. Синтаксис и примеры.',
  'srznachesli': 'Функция СРЗНАЧЕСЛИ в Excel — среднее арифметическое по одному условию. Синтаксис, примеры.',
  'srznacheslimn': 'Функция СРЗНАЧЕСЛИМН в Excel — среднее по нескольким условиям. Синтаксис, примеры.',
  'schet': 'Функция СЧЁТ в Excel — подсчёт количества чисел в диапазоне. Синтаксис и примеры.',
  'schetesli': 'Функция СЧЁТЕСЛИ в Excel — подсчёт ячеек по одному условию. Синтаксис, примеры.',
  'scheteslimn': 'Функция СЧЁТЕСЛИМН в Excel — подсчёт ячеек по нескольким условиям. Синтаксис, примеры.',
  'index': 'Электронные таблицы Excel — список всех изучаемых функций. Адресация, логические функции, статистические функции.',
  'oge14-trainer': 'ОГЭ задание 14 — тренажёр по функциям Excel. Интерактивные задания с проверкой ответов.',
  'oge14-theory': 'ОГЭ задание 14 — теория по функциям Excel. Важные аспекты выполнения задания 14 на ОГЭ по информатике.'
};

const yandexMetrika = `    <!-- Yandex.Metrika counter -->
    <script type="text/javascript">
       (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
       m[i].l=1*new Date();
       for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
       k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
       (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
       ym(107219928, "init", {clickmap:true,trackLinks:true,accurateTrackBounce:true});
    </script>
    <noscript><div><img src="https://mc.yandex.ru/watch/107219928" style="position:absolute; left:-9999px;" alt="Метрика" /></div></noscript>
    <!-- /Yandex.Metrika counter -->
`;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const basename = path.basename(filePath, '.html');
  const metaDesc = META[basename] || 'Изучение функций электронных таблиц Excel. Подготовка к ОГЭ по информатике.';

  console.log('Processing: ' + basename);

  // 1. Remove <style>...</style> blocks (non-greedy, works multiline)
  content = content.replace(/<style>[\s\S]*?<\/style>/g, '');

  // 2. Add meta description, CSS link, manifest, canonical after </title>
  if (!content.includes('assets/css/styles.css')) {
    content = content.replace(
      /<\/title>\s*/,
      '</title>\n    <meta name="description" content="' + metaDesc + '" />\n    <link rel="stylesheet" href="../assets/css/styles.css" />\n    <link rel="manifest" href="../manifest.json" />\n    <link rel="canonical" href="https://nayanovaacademy.ru/office-web/excel/' + basename + '.html" />\n'
    );
  }

  // 3. Add Yandex Metrika before </head>
  if (!content.includes('yandex.ru/metrika')) {
    content = content.replace('</head>', yandexMetrika + '\n</head>');
  }

  // 4. Update body tag with classes (handle both <body> and <body...>)
  content = content.replace(/<body(\s*)>/g, '<body class="page-excel page-' + basename + '"$1>');

  // 5. Add role="main" to container div
  content = content.replace(/<div class="container">/g, '<div class="container" role="main">');

  // 6. Add role="navigation" to nav-links
  content = content.replace(/<div class="nav-links">/g, '<div class="nav-links" role="navigation" aria-label="Навигация по темам">');

  // 7. Remove old quick-nav + scroll script (FIXED: only match the specific old pattern)
  // Pattern: <!-- Быстрая навигация --> ... </script>
  // Use non-greedy match but anchored to the comment
  content = content.replace(/<!-- Быстрая навигация -->[\s\S]*?<\/script>/g, '');
  // Also handle <!-- Scroll to top button --> variants
  content = content.replace(/<button[^>]*onclick=["']scrollToTop\(\)["'][^>]*>[\s\S]*?<\/button>/g, '');
  content = content.replace(/<button[^>]*onclick=["']window\.scrollTo[^>]*>[\s\S]*?<\/button>/g, '');

  // 8. Remove old <script> with scrollToTop function (FIXED: only if small)
  content = content.replace(/<script>\s*function scrollToTop\(\)\s*\{[\s\S]*?\}\s*<\/script>/g, '');

  // 9. Add scripts + SW + quick-nav before </body>
  if (!content.includes('topic-nav.js')) {
    const footer = `
    <script src="../assets/js/topic-nav.js"></script>
    <script src="../assets/js/progress.js"></script>
    <script src="../assets/js/analytics.js"></script>
    <script>
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('../../sw.js');
      }
    </script>
    <div class="quick-nav" role="complementary" aria-label="Быстрая навигация">
      <button class="quick-nav-btn top" onclick="window.scrollTo({top:0,behavior:'smooth'})" title="Наверх" aria-label="Наверх">↑</button>
    </div>
`;
    content = content.replace('</body>', footer + '\n</body>');
  }

  // 10. Remove inline style="..." attributes (skip noscript which has metrika)
  // Use a safer approach: only remove style from known elements
  content = content.replace(/<a([^>]*?)style="[^"]*"([^>]*?)>/g, '<a$1$2>');
  content = content.replace(/<div([^>]*?)style="[^"]*"([^>]*?)>/g, '<div$1$2>');

  // Write back
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('  Done: ' + basename);
}

// Process all Excel HTML files
const files = fs.readdirSync(EXCEL_DIR).filter(f => f.endsWith('.html'));
files.forEach(f => {
  processFile(path.join(EXCEL_DIR, f));
});

console.log('\nDone! Processed ' + files.length + ' Excel files.');