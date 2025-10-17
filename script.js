// Example: pulse APM value and show notification
let apm = 0;

function updateAPM() {
  apm = Math.floor(Math.random() * 300);
  document.getElementById('apmValue').textContent = apm;
}

function showNotification(msg) {
  const el = document.getElementById('notification');
  el.textContent = msg;
  el.classList.remove('hidden');
  el.classList.add('visible');
  setTimeout(() => {
    el.classList.remove('visible');
    el.classList.add('hidden');
  }, 3000);
}

setInterval(updateAPM, 2000);
setTimeout(() => showNotification('New Follower!'), 4000);
