const coords = document.getElementById('coords');
const body = document.body;

// Track whether background is visible
let bgVisible = true;

// Mouse coordinates display
document.addEventListener('mousemove', e => {
  const x = e.pageX;
  const y = e.pageY;
  coords.textContent = `X: ${x}, Y: ${y}`;
});

// Toggle background on pressing 'b' or 'B'
document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'b') {
    bgVisible = !bgVisible;
    if (bgVisible) {
      body.style.background = 'url("image.png") no-repeat top left / 1920px 1080px';
    } else {
      body.style.background = 'transparent';
    }
    console.log('B pressed, bgVisible =', bgVisible);
  }
});

