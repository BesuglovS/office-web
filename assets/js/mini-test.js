/**
 * Mini-Test Module
 * Handles self-check quizzes embedded on theory pages
 */
function checkMiniTest(sectionId) {
  var section = document.getElementById(sectionId);
  if (!section) return;

  var questions = section.querySelectorAll('.test-question');
  var correct = 0;
  var total = questions.length;

  questions.forEach(function (q) {
    var correctAnswer = q.getAttribute('data-answer');
    var selected = q.querySelector('input[type="radio"]:checked');
    var options = q.querySelectorAll('.test-option');

    // Clear previous highlights
    options.forEach(function (opt) {
      opt.classList.remove('correct-answer', 'wrong-answer', 'selected');
    });

    if (selected) {
      var selectedOption = selected.closest('.test-option');
      selectedOption.classList.add('selected');

      if (selected.value === correctAnswer) {
        correct++;
        selectedOption.classList.add('correct-answer');
      } else {
        selectedOption.classList.add('wrong-answer');
        // Highlight correct answer
        var correctInput = q.querySelector('input[value="' + correctAnswer + '"]');
        if (correctInput) {
          correctInput.closest('.test-option').classList.add('correct-answer');
        }
      }
    }
  });

  // Show result
  var resultEl = document.getElementById(sectionId + 'Result');
  if (resultEl) {
    resultEl.style.display = 'block';
    if (correct === total) {
      resultEl.style.background = '#e8f5e9';
      resultEl.style.color = '#2e7d32';
      resultEl.textContent = 'Отлично! ' + correct + ' из ' + total + ' правильных ответов. Вы усвоили тему!';
    } else if (correct >= total / 2) {
      resultEl.style.background = '#fff3e0';
      resultEl.style.color = '#e65100';
      resultEl.textContent = 'Хорошо! ' + correct + ' из ' + total + '. Просмотрите материал ещё раз по вопросам с ошибками.';
    } else {
      resultEl.style.background = '#ffebee';
      resultEl.style.color = '#c62828';
      resultEl.textContent = 'Нужно повторить! ' + correct + ' из ' + total + '. Вернитесь к теории и попробуйте снова.';
    }
  }
}