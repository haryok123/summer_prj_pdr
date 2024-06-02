const imageUrls = [
  '/images/profile1.gif',
  '/images/profile2.gif',
  '/images/profile3.gif',
];
document.addEventListener('DOMContentLoaded', () => {
  const imageContainer = document.getElementById('imageContainer');

  // // Function to fetch image URLs from the server
  // async function fetchImageNumber() {
  //   try {
  //     const response = await fetch('/api/images'); // Adjust this endpoint based on your server setup
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch image URLs');
  //     }
  //     const imageUrls = await response.json();
  displayImages(imageUrls);
  //   } catch (error) {
  //     console.error('Error loading images:', error);
  //   }

  function displayImages() {
    const imageContainer = document.getElementById('imageContainer');
    imageContainer.innerHTML = ''; // Clear any existing images

    let row;

    imageUrls.forEach((url, index) => {
      // Create a new row for every three images
      if (index % 3 === 0) {
        row = document.createElement('div');
        row.className = 'row mb-3'; // Bootstrap class for row and margin-bottom for spacing
        imageContainer.appendChild(row);
      }

      const col = document.createElement('div');
      col.className = 'col-4'; // Bootstrap class for 3 images per row

      const img = document.createElement('img');
      img.src = url;
      img.alt = 'Selectable image';
      img.className = 'img-thumbnail';
      img.style.height = '150px'; // Fixed height
      img.style.width = '100%'; // Full width of the column
      img.style.objectFit = 'cover'; // Ensure the image covers the area
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => selectImage(url));

      col.appendChild(img);
      row.appendChild(col); // Append the column to the current row
    });
  }

  // Function to handle image selection
  function selectImage(url) {
    console.log('Selected image URL:', url);
    // Implement your logic to handle the selected image
  }

  // Load images when the modal is shown
  const imageSelectionModal = new bootstrap.Modal(
    document.getElementById('imageSelectionModal'),
  );
  document
    .getElementById('changeProfileImgButton')
    .addEventListener('click', () => {
      displayImages();
      imageSelectionModal.show();
    });
});
