/**
 * Progress Tracking Module
 * Uses localStorage to track user progress across topics and trainers
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'office-web-progress';
  var TOPIC_COUNT_KEY = 'office-web-total-topics';

  /**
   * Get all progress data from localStorage
   * @returns {object}
   */
  function getProgress() {
    try {
      var data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  /**
   * Save progress data to localStorage
   * @param {object} data
   */
  function saveProgress(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // localStorage might be full or unavailable
    }
  }

  /**
   * Mark a topic as visited
   * @param {string} section - e.g. 'excel', 'word'
   * @param {string} topicId - e.g. 'summ', 'esli'
   */
  function markVisited(section, topicId) {
    var progress = getProgress();
    if (!progress[section]) {
      progress[section] = {};
    }
    if (!progress[section][topicId]) {
      progress[section][topicId] = { visited: false, score: 0, completed: false };
    }
    progress[section][topicId].visited = true;
    progress[section][topicId].lastVisited = new Date().toISOString();
    saveProgress(progress);
  }

  /**
   * Record a trainer score
   * @param {string} section
   * @param {string} topicId
   * @param {number} score
   * @param {number} total
   */
  function recordScore(section, topicId, score, total) {
    var progress = getProgress();
    if (!progress[section]) {
      progress[section] = {};
    }
    if (!progress[section][topicId]) {
      progress[section][topicId] = { visited: false, score: 0, completed: false };
    }
    progress[section][topicId].score = score;
    progress[section][topicId].total = total;
    progress[section][topicId].completed = score === total;
    progress[section][topicId].lastAttempt = new Date().toISOString();
    saveProgress(progress);
  }

  /**
   * Get progress for a specific topic
   * @param {string} section
   * @param {string} topicId
   * @returns {object|null}
   */
  function getTopicProgress(section, topicId) {
    var progress = getProgress();
    if (progress[section] && progress[section][topicId]) {
      return progress[section][topicId];
    }
    return null;
  }

  /**
   * Get overall progress percentage for a section
   * @param {string} section
   * @param {number} totalTopics
   * @returns {number} 0-100
   */
  function getSectionProgress(section, totalTopics) {
    var progress = getProgress();
    if (!progress[section]) return 0;

    var completed = 0;
    var keys = Object.keys(progress[section]);
    for (var i = 0; i < keys.length; i++) {
      if (progress[section][keys[i]].completed) {
        completed++;
      }
    }

    return totalTopics > 0 ? Math.round((completed / totalTopics) * 100) : 0;
  }

  /**
   * Get total topics count from localStorage or default
   * @returns {number}
   */
  function getTotalTopics() {
    try {
      var val = localStorage.getItem(TOPIC_COUNT_KEY);
      return val ? parseInt(val, 10) : 21;
    } catch (e) {
      return 21;
    }
  }

  /**
   * Set total topics count
   * @param {number} count
   */
  function setTotalTopics(count) {
    try {
      localStorage.setItem(TOPIC_COUNT_KEY, count.toString());
    } catch (e) {
      // ignore
    }
  }

  /**
   * Render progress bar
   * @param {string} section
   * @param {HTMLElement} container - element to insert progress bar before/into
   * @param {number} totalTopics
   */
  function renderProgressBar(section, totalTopics, container) {
    var percentage = getSectionProgress(section, totalTopics);
    var html =
      '<div class="progress-bar-container" role="progressbar" aria-valuenow="' + percentage + '" aria-valuemin="0" aria-valuemax="100">' +
      '<span>📊 Прогресс:</span>' +
      '<div class="progress-bar">' +
      '<div class="progress-bar-fill" style="width:' + percentage + '%"></div>' +
      '</div>' +
      '<span class="progress-text">' + percentage + '%</span>' +
      '</div>';

    container.insertAdjacentHTML('afterend', html);
  }

  /**
   * Auto-detect current topic and mark as visited
   */
  function autoTrack() {
    var path = window.location.pathname;
    var sections = ['excel', 'word', 'powerpoint', 'kumir'];

    for (var i = 0; i < sections.length; i++) {
      var section = sections[i];
      if (path.indexOf('/' + section + '/') !== -1) {
        var fileName = path.split('/').pop() || 'index.html';
        var topicId = fileName.replace('.html', '');
        markVisited(section, topicId);

        // Render progress bar after h1
        var h1 = document.querySelector('h1');
        var totalTopics = getTotalTopics();
        if (h1 && section === 'excel') {
          renderProgressBar(section, totalTopics, h1);
        }
        return;
      }
    }
  }

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoTrack);
  } else {
    autoTrack();
  }

  // Expose API globally
  window.OfficeProgress = {
    markVisited: markVisited,
    recordScore: recordScore,
    getTopicProgress: getTopicProgress,
    getSectionProgress: getSectionProgress,
    getProgress: getProgress,
    setTotalTopics: setTotalTopics,
    getTotalTopics: getTotalTopics
  };
})();