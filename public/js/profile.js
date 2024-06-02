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
