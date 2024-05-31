document.addEventListener('DOMContentLoaded', function () {
  const userAnswer = '{{currentQuestion.user_answer}}';
  const correctAnswer = '{{currentQuestion.question.q_correct_answer}}';

  // Highlight the answers based on previous selection
  if (userAnswer) {
    document.querySelectorAll('.answer-button').forEach((btn) => {
      const answer = btn.getAttribute('data-answer');
      if (answer == correctAnswer) {
        btn.classList.add('correct');
      } else if (answer == userAnswer) {
        btn.classList.add('incorrect');
      }
      btn.disabled = true;
    });
  }

  // Add event listeners to answer buttons
  document.querySelectorAll('.answer-button').forEach((button) => {
    button.addEventListener('click', async function () {
      const userAnswer = this.getAttribute('data-answer');
      const questionId = '{{currentQuestion.test_question_id}}';
      try {
        const response = await fetch(`/tests/update/questions/${questionId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({ user_answer: userAnswer }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();

        // Highlight the buttons based on the correctness of the answer
        document.querySelectorAll('.answer-button').forEach((btn) => {
          const answer = btn.getAttribute('data-answer');
          btn.classList.remove('correct', 'incorrect');
          if (answer == result.correctAnswer) {
            btn.classList.add('correct');
          } else if (answer == userAnswer) {
            btn.classList.add('incorrect');
          }
          btn.disabled = true;
        });

        // Update the pagination button color
        const paginationButton = document.querySelector(
          `.pagination-button:nth-child(${parseInt('{{question_index}}') + 1})`,
        );
        if (userAnswer == result.correctAnswer) {
          paginationButton.classList.add('correct');
          paginationButton.classList.remove('incorrect');
        } else {
          paginationButton.classList.add('incorrect');
          paginationButton.classList.remove('correct');
        }
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    });
  });
});

function navigateToQuestion(themeId, testId, questionIndex) {
  window.location.href = `/tests/themes/test?theme_id=${themeId}&test_id=${testId}&question_index=${questionIndex}`;
}

function endTest() {
  document.getElementById('endTestModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('endTestModal').style.display = 'none';
}
