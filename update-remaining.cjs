// Update remaining HTML files: root index.html, word/, powerpoint/, kumir/
const fs = require('fs');
const path = require('path');

const BASE_DIR = __dirname;

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

const files = [
  {
    path: 'word/index.html',
    metaDesc: 'Текстовые редакторы Microsoft Word и LibreOffice Writer — теория, основные функции, горячие клавиши, подготовка к ОГЭ по информатике.',
    canonicalPath: 'word/index.html',
    bodyClass: 'page-word page-index',
    cssPath: '../assets/css/styles.css',
    manifestPath: '../manifest.json',
    swPath: '../../sw.js',
    jsPath: '../assets/js/'
  },
  {
    path: 'powerpoint/index.html',
    metaDesc: 'Редакторы презентаций Microsoft PowerPoint и LibreOffice Impress — теория, создание слайдов, диаграммы, подготовка к ОГЭ.',
    canonicalPath: 'powerpoint/index.html',
    bodyClass: 'page-powerpoint page-index',
    cssPath: '../assets/css/styles.css',
    manifestPath: '../manifest.json',
    swPath: '../../sw.js',
    jsPath: '../assets/js/'
  },
  {
    path: 'kumir/index.html',
    metaDesc: 'Система Кумир и исполнитель Робот — теория, команды, решение задания 15 ОГЭ по информатике, критерии оценки.',
    canonicalPath: 'kumir/index.html',
    bodyClass: 'page-kumir page-index',
    cssPath: '../assets/css/styles.css',
    manifestPath: '../manifest.json',
    swPath: '../../sw.js',
    jsPath: '../assets/js/'
  },
  {
    path: 'index.html',
    metaDesc: 'Изучение офисных приложений — Microsoft Excel, Word, PowerPoint и Кумир. Теория, тренажёры, подготовка к ОГЭ по информатике.',
    canonicalPath: '',
    bodyClass: 'page-home',
    cssPath: 'assets/css/styles.css',
    manifestPath: 'manifest.json',
    swPath: 'sw.js',
    jsPath: 'assets/js/'
  }
];

files.forEach(file => {
  const fullPath = path.join(BASE_DIR, file.path);
  let content = fs.readFileSync(fullPath, 'utf8');

  console.log('Processing: ' + file.path);

  // 1. Remove <style>...</style> blocks
  content = content.replace(/<style>[\s\S]*?<\/style>/g, '');

  // 2. Add meta description, CSS link, manifest, canonical after </title>
  if (!content.includes(file.cssPath)) {
    content = content.replace(
      /<\/title>\s*/,
      '</title>\n    <meta name="description" content="' + file.metaDesc + '" />\n    <link rel="stylesheet" href="' + file.cssPath + '" />\n    <link rel="manifest" href="' + file.manifestPath + '" />\n    <link rel="canonical" href="https://nayanovaacademy.ru/office-web/' + file.canonicalPath + '" />\n'
    );
  }

  // 3. Add Yandex Metrika before </head> (only if not present)
  if (!content.includes('yandex.ru/metrika')) {
    content = content.replace('</head>', yandexMetrika + '\n</head>');
  }

  // 4. Update body tag with classes
  content = content.replace(/<body(\s*)>/g, '<body class="' + file.bodyClass + '"$1>');

  // 5. Add role="main" to container div (first container match)
  content = content.replace(/<div class="container">/g, '<div class="container" role="main">');

  // 6. Add role="navigation" to nav-links
  content = content.replace(/<div class="nav-links">/g, '<div class="nav-links" role="navigation" aria-label="Навигация по темам">');

  // 7. Remove old quick-nav fragments
  content = content.replace(/<!-- Быстрая навигация -->[\s\S]*?<\/script>/g, '');
  content = content.replace(/<button[^>]*onclick=["']scrollToTop\(\)["'][^>]*>[\s\S]*?<\/button>/g, '');
  content = content.replace(/<button[^>]*onclick=["']window\.scrollTo[^>]*>[\s\S]*?<\/button>/g, '');
  content = content.replace(/<script>\s*function scrollToTop\(\)\s*\{[\s\S]*?\}\s*<\/script>/g, '');

  // 8. Add scripts + SW + quick-nav before </body>
  if (!content.includes('topic-nav.js')) {
    const footer = `
    <script src="${file.jsPath}topic-nav.js"></script>
    <script src="${file.jsPath}progress.js"></script>
    <script src="${file.jsPath}analytics.js"></script>
    <script>
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('${file.swPath}');
      }
    </script>
    <div class="quick-nav" role="complementary" aria-label="Быстрая навигация">
      <button class="quick-nav-btn top" onclick="window.scrollTo({top:0,behavior:'smooth'})" title="Наверх" aria-label="Наверх">↑</button>
    </div>
`;
    content = content.replace('</body>', footer + '\n</body>');
  }

  // 9. Remove inline style="..." from <a> and <div> tags
  content = content.replace(/<a([^>]*?)style="[^"]*"([^>]*?)>/g, '<a$1$2>');
  content = content.replace(/<div([^>]*?)style="[^"]*"([^>]*?)>/g, '<div$1$2>');

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('  Done: ' + file.path);
});

console.log('\nDone! Processed ' + files.length + ' files.');