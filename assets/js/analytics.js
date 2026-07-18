/**
 * Analytics Module
 * Yandex Metrika event tracking for all pages
 */

(function () {
  'use strict';

  /**
   * Track a page view event
   * @param {string} pageTitle
   */
  function trackPageView(pageTitle) {
    if (typeof ym !== 'undefined' && ym) {
      try {
        ym(107219928, 'hit', window.location.href, {
          title: pageTitle || document.title,
          referer: document.referrer
        });
      } catch (e) {
        // analytics failure should not break the page
      }
    }
  }

  /**
   * Track a user action/event
   * @param {string} category - e.g. 'navigation', 'trainer', 'exercise'
   * @param {string} action - e.g. 'click', 'submit', 'complete'
   * @param {string} label - e.g. 'prev-topic', 'next-topic', 'sum-formula'
   * @param {*} [value] - optional numeric value
   */
  function trackEvent(category, action, label, value) {
    if (typeof ym !== 'undefined' && ym) {
      try {
        var params = {
          category: category,
          action: action,
          label: label
        };
        if (value !== undefined) {
          params.value = value;
        }
        ym(107219928, 'reachGoal', category + '_' + action, params);
      } catch (e) {
        // analytics failure should not break the page
      }
    }
  }

  /**
   * Track trainer answer submission
   * @param {string} topicId
   * @param {boolean} correct
   * @param {number} attemptNumber
   */
  function trackTrainerAnswer(topicId, correct, attemptNumber) {
    trackEvent('trainer', correct ? 'correct' : 'incorrect', topicId, attemptNumber);
  }

  /**
   * Track trainer completion
   * @param {string} topicId
   * @param {number} score
   * @param {number} total
   */
  function trackTrainerComplete(topicId, score, total) {
    trackEvent('trainer', 'complete', topicId + '_' + score + '_' + total);
  }

  /**
   * Track topic navigation
   * @param {string} direction - 'prev' or 'next'
   * @param {string} topicName
   */
  function trackNavigation(direction, topicName) {
    trackEvent('navigation', direction, topicName);
  }

  /**
   * Auto-track navigation link clicks
   */
  function bindNavigationTracking() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('.topic-nav-btn');
      if (!link) return;

      var isPrev = link.textContent.indexOf('←') !== -1;
      var direction = isPrev ? 'prev' : 'next';
      var topicName = link.textContent.replace(/[←→]/g, '').trim();

      trackNavigation(direction, topicName);
    });
  }

  /**
   * Track link clicks to other sections
   */
  function bindLinkTracking() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (!link) return;

      var href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

      // Track external links and section links
      if (href.startsWith('http') || href.indexOf('/') !== -1) {
        trackEvent('link', 'click', href);
      }
    });
  }

  /**
   * Initialize
   */
  function init() {
    trackPageView(document.title);
    bindNavigationTracking();
    bindLinkTracking();
  }

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose API globally
  window.OfficeAnalytics = {
    trackPageView: trackPageView,
    trackEvent: trackEvent,
    trackTrainerAnswer: trackTrainerAnswer,
    trackTrainerComplete: trackTrainerComplete,
    trackNavigation: trackNavigation
  };
})();