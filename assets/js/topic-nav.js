/**
 * Topic Navigation Module
 * Handles prev/next navigation between topics and rendering topic-nav UI
 */

(function () {
  'use strict';

  /**
   * Topic order configuration
   * Defines the sequence of topics for prev/next navigation
   */
  const TOPIC_ORDER = {
    excel: [
      { id: 'index', file: 'index.html', name: 'Электронные таблицы' },
      { id: 'adresacia', file: 'adresacia.html', name: 'Адресация' },
      { id: 'summ', file: 'summ.html', name: 'СУММ' },
      { id: 'srznach', file: 'srznach.html', name: 'СРЗНАЧ' },
      { id: 'schet', file: 'schet.html', name: 'СЧЁТ' },
      { id: 'min', file: 'min.html', name: 'МИН' },
      { id: 'maks', file: 'maks.html', name: 'МАКС' },
      { id: 'esli', file: 'esli.html', name: 'ЕСЛИ' },
      { id: 'i', file: 'i.html', name: 'И' },
      { id: 'ili', file: 'ili.html', name: 'ИЛИ' },
      { id: 'ne', file: 'ne.html', name: 'НЕ' },
      { id: 'summesli', file: 'summesli.html', name: 'СУММЕСЛИ' },
      { id: 'summeslimn', file: 'summeslimn.html', name: 'СУММЕСЛИМН' },
      { id: 'srznachesli', file: 'srznachesli.html', name: 'СРЗНАЧЕСЛИ' },
      { id: 'srznacheslimn', file: 'srznacheslimn.html', name: 'СРЗНАЧЕСЛИМН' },
      { id: 'schetesli', file: 'schetesli.html', name: 'СЧЁТЕСЛИ' },
      { id: 'scheteslimn', file: 'scheteslimn.html', name: 'СЧЁТЕСЛИМН' },
      { id: 'maksesli', file: 'maksesli.html', name: 'МАКСЕСЛИ' },
      { id: 'minesli', file: 'minesli.html', name: 'МИНЕСЛИ' },
      { id: 'oge14-trainer', file: 'oge14-trainer.html', name: 'ОГЭ 14: Тренажёр' },
      { id: 'oge14-theory', file: 'oge14-theory.html', name: 'ОГЭ 14: Теория' }
    ],
    word: [
      { id: 'index', file: 'index.html', name: 'Microsoft Word' }
    ],
    powerpoint: [
      { id: 'index', file: 'index.html', name: 'Microsoft PowerPoint' }
    ],
    kumir: [
      { id: 'index', file: 'index.html', name: 'КуМир' }
    ]
  };

  /**
   * Detect current section and topic from URL path
   * @returns {{ section: string, topicId: string } | null}
   */
  function detectCurrentTopic() {
    const path = window.location.pathname;
    const sections = ['excel', 'word', 'powerpoint', 'kumir'];

    for (const section of sections) {
      if (path.includes('/' + section + '/')) {
        const fileName = path.split('/').pop() || 'index.html';
        const topicId = fileName.replace('.html', '');
        return { section, topicId };
      }
    }

    // Check if we're on a section index page directly
    for (const section of sections) {
      if (path.endsWith('/' + section + '/') || path.endsWith('/' + section)) {
        return { section, topicId: 'index' };
      }
    }

    return null;
  }

  /**
   * Get prev/next topic information
   * @param {string} section
   * @param {string} topicId
   * @returns {{ prev: object|null, next: object|null, current: object|null, currentIndex: number, total: number }}
   */
  function getNavigation(section, topicId) {
    const topics = TOPIC_ORDER[section];
    if (!topics) return { prev: null, next: null, current: null, currentIndex: -1, total: 0 };

    let currentIndex = topics.findIndex(function (t) { return t.id === topicId; });

    // Fallback: try matching by file name
    if (currentIndex === -1) {
      currentIndex = topics.findIndex(function (t) { return t.file === topicId + '.html'; });
    }

    return {
      prev: currentIndex > 0 ? topics[currentIndex - 1] : null,
      next: currentIndex < topics.length - 1 ? topics[currentIndex + 1] : null,
      current: currentIndex >= 0 ? topics[currentIndex] : null,
      currentIndex: currentIndex,
      total: topics.length
    };
  }

  /**
   * Render topic navigation UI
   * @param {string} section
   * @param {string} topicId
   * @param {HTMLElement} container
   */
  function renderNavigation(section, topicId, container) {
    var nav = getNavigation(section, topicId);

    if (nav.total <= 1 && !nav.prev && !nav.next) {
      return; // No navigation needed for single-topic sections
    }

    var html = '<nav class="topic-nav" aria-label="Навигация по темам">';

    if (nav.prev) {
      html += '<a href="' + nav.prev.file + '" class="topic-nav-btn" title="Предыдущая тема: ' + nav.prev.name + '">← ' + nav.prev.name + '</a>';
    } else {
      html += '<span class="topic-nav-spacer"></span>';
    }

    if (nav.next) {
      html += '<a href="' + nav.next.file + '" class="topic-nav-btn" title="Следующая тема: ' + nav.next.name + '">' + nav.next.name + ' →</a>';
    } else {
      html += '<span class="topic-nav-spacer"></span>';
    }

    html += '</nav>';

    container.insertAdjacentHTML('afterbegin', html);
  }

  /**
   * Initialize topic navigation
   */
  function init() {
    var current = detectCurrentTopic();
    if (!current) return;

    var container = document.querySelector('.nav-links');
    if (!container) return;

    renderNavigation(current.section, current.topicId, container);
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();