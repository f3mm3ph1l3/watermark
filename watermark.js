const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const applyWatermarkBtn = document.getElementById('applyWatermark');
const progressBarContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const watermarkTextBox = document.getElementById('watermarkText');
const progressText = document.getElementById('progressText');

imageInput.addEventListener('change', handleImageUpload);
applyWatermarkBtn.addEventListener('click', applyWatermark);

let images = [];
let processedCount = 0;

function handleImageUpload(event) {
  images = [];
  processedCount = 0;
  const files = event.target.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          images.push(img);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}

function applyWatermark() {
  const totalImages = images.length;
  const watermarkText = watermarkTextBox.value.trim();
  if (!watermarkText) {
    alert('Please enter watermark text.');
    return;
  }

  let currentIndex = 0;

  function processNextImage() {
    if (currentIndex >= totalImages) {
      // Clear the selected files from the input field
      imageInput.value = '';
      // Hide the canvas after watermarking
      canvas.style.display = 'none';
      return;
    }

    const image = images[currentIndex];
    const fontSize = 24;
    const x = 10; // X-coordinate of the watermark
    const y = image.height - 10; // Y-coordinate of the watermark

    canvas.width = image.width;
    canvas.height = image.height;

    // Draw the original image onto the canvas
    ctx.drawImage(image, 0, 0);

    ctx.font = `${fontSize}px Courier`; // Change the font to Courier
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText(watermarkText, x, y);

    // Save the image with watermark
    const fileName = getFileName(imageInput.files[currentIndex]);
    const extension = getFileExtension(imageInput.files[currentIndex]);
    const newFileName = fileName + '_wm.' + extension;
    saveImage(canvas.toDataURL(), newFileName);

    // Update progress bar
    const progress = ((currentIndex + 1) / totalImages) * 100;
    progressBar.style.width = progress + '%';
    progressText.textContent = `Processing image ${currentIndex + 1} of ${totalImages}`;

    currentIndex++;

    // Process next image after a short delay
    if (currentIndex < totalImages) {
      setTimeout(processNextImage, 10);
    }
  }

  // Show progress bar container
  progressBarContainer.style.display = 'block';

  // Start processing images
  processNextImage();
}

function saveImage(dataURL, fileName) {
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = fileName;

  // Trigger the download
  link.click();
}

function getFileName(file) {
  return file.name.split('.').slice(0, -1).join('.');
}

function getFileExtension(file) {
  return file.name.split('.').pop();
}
