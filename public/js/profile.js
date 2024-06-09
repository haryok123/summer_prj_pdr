window.onload = function () {
  displayImages();
};

function displayImages() {
  const imageContainer = document.getElementById('imageContainer');
  imageContainer.innerHTML = '';

  let row;

  for (let index = 1; index < 10; index++) {
    if ((index - 1) % 3 === 0) {
      row = document.createElement('div');
      row.className = 'row mb-3';
      imageContainer.appendChild(row);
    }

    const col = document.createElement('div');
    col.className = 'col-4';

    const img = document.createElement('img');
    const url = '/images/avatar' + index + '.gif'; // Adjusted the URL path
    img.src = url;
    img.alt = 'Selectable image';
    img.className = 'img-thumbnail';
    img.style.height = '150px';
    img.style.width = '100%';
    img.style.objectFit = 'cover';
    img.style.cursor = 'pointer';
    img.onclick = function () {
      updateUserPhoto(index);
    };

    col.appendChild(img);
    row.appendChild(col);
  }
}

const imageSelectionModal = new bootstrap.Modal(
  document.getElementById('imageSelectionModal'),
);

document.getElementById('changeProfileImgButton').onclick = function () {
  displayImages();
  imageSelectionModal.show();
};

function updateUserPhoto(index) {
  const imageNumber = index;
  const userLogin = document.getElementById('currentUserLogin').textContent;
  console.log(userLogin);
  fetch('/profile/updateProfileImgNumber', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userLogin: userLogin,
      photoNumber: parseInt(imageNumber),
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      window.location.reload();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
document.addEventListener('DOMContentLoaded', function () {
  fetch('/profile/statistics')
    .then((response) => response.json())
    .then((data) => {
      document.getElementById('loading').style.display = 'none';

      const statisticsCard = document.getElementById('statisticsCard');
      statisticsCard.innerHTML = `
              <div class="title">Загальний прогрес по темах:</div>
              <div class="stat-value ${getProgressClass(data.overallProgress)}">${data.overallProgress}%</div>
              <div class="progress-bar">
                <div class="progress ${getProgressClass(data.overallProgress)}" style="width: ${data.overallProgress}%;"></div>
              </div>
              <div class="stat-row">
                <div class="stat-item">
                  <div class="stat-value ${getExamPassClass(data.examsTotal - data.examsPassed)}">${data.examsPassed}/${data.examsTotal}</div>
                  <div class="stat-description">Зданих іспитів</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value ${getScoreClass(data.averageScore)}">${data.averageScore}/20</div>
                  <div class="stat-description">Середній рахунок іспиту</div>
                </div>
              </div>
              <div class="stat-row">
                <div class="stat-item">
                  <div class="stat-value">${data.totalQuestions}</div>
                  <div class="stat-description">Запитань пройдено</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value" style="color: #ff4d4f;">${data.incorrectAnswers}</div>
                  <div class="stat-description">Невірних відповідей</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value" style="color: #4CAF50;">${data.correctAnswers}</div>
                  <div class="stat-description">Правильних відповідей</div>
                </div>
              </div>
            `;
    })
    .catch((error) => {
      console.error('Error fetching statistics:', error);
    });

  function getProgressClass(progress) {
    if (progress < 10) return 'bad-result';
    if (progress < 20) return 'poor-result';
    if (progress < 40) return 'medium-result';
    if (progress < 70) return 'good-result';
    return 'great-result';
  }

  function getExamPassClass(examsLeft) {
    if (examsLeft > 10) return 'bad-result';
    if (examsLeft > 8) return 'poor-result';
    if (examsLeft > 6) return 'medium-result';
    if (examsLeft > 4) return 'good-result';
    return 'great-result';
  }

  function getScoreClass(score) {
    if (score < 4) return 'bad-result';
    if (score < 8) return 'poor-result';
    if (score < 12) return 'medium-result';
    if (score < 17) return 'good-result';
    return 'great-result';
  }
});
document.getElementById('reset-progress-btn').addEventListener('click', () => {
  document.getElementById('confirmationModal').style.display = 'block';
});

document.getElementById('cancel-reset-btn').addEventListener('click', () => {
  document.getElementById('confirmationModal').style.display = 'none';
});

document
  .getElementById('confirm-reset-btn')
  .addEventListener('click', async () => {
    const response = await fetch('/tests/delete/all', { method: 'DELETE' });
    if (response.ok) {
      location.reload();
    } else {
      alert('Помилка при скиданні прогресу');
    }
  });

document.querySelector('.modal .close').addEventListener('click', () => {
  document.getElementById('confirmationModal').style.display = 'none';
});
