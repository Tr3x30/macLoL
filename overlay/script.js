const coords = document.getElementById('coords');

document.addEventListener('mousemove', e => {
  const x = e.pageX;
  const y = e.pageY;
  coords.textContent = `X: ${x}, Y: ${y}`;
});
