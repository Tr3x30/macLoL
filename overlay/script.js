const body = document.body;

const bar = document.getElementById('scoreboard-bar');
if (bar) {
  bar.dataset.origWidth = bar.getAttribute('width');
  bar.dataset.origHeight = bar.getAttribute('height');
}

// Track whether background is visible
let bgVisible = false;

// Toggle background on pressing 'b' or 'B'
document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'b') {
    bgVisible = !bgVisible;
    body.style.background = bgVisible
      ? 'url("image.png") no-repeat top left / 1920px 1080px'
      : 'transparent';
    console.log('B pressed, bgVisible =', bgVisible);
  }
});

let editMode = false;
let bestOf = 3;
let maxWins = bestOf; // dynamic based on best-of
let blueWinsCount = 0;
let redWinsCount = 0;

document.addEventListener('keydown', e => {
  if (!e.ctrlKey) return;

  switch (e.key.toLowerCase()) {
    case 'e': // toggle edit mode
      e.preventDefault();
      editMode = !editMode;
      toggleEditMode(editMode);
      console.log(`Edit mode: ${editMode}`);
      break;

    case 's': // swap sides
      e.preventDefault();
      swapSides();
      break;

    case '1': // increment blue team wins
      e.preventDefault();
      blueWinsCount = (blueWinsCount + 1) % (maxWins + 1);
      updateWins('blue', blueWinsCount);
      break;

    case '2': // increment red team wins
      e.preventDefault();
      redWinsCount = (redWinsCount + 1) % (maxWins + 1);
      updateWins('red', redWinsCount);
      break;

    case '3': // set best-of 3
    case '5': // set best-of 5
      e.preventDefault();
      setBestOf(parseInt(e.key));
      break;
    
    case 'h':
      e.preventDefault();

    const bar = document.getElementById('scoreboard-bar');
    if (!bar) return;

    // Toggle visibility
    if (!bar.dataset.hidden) {
      bar.dataset.hidden = 'true';
      bar.setAttribute('width', 0);
      bar.setAttribute('height', 0);
      console.log('Scoreboard bar hidden');
    } else {
      bar.dataset.hidden = '';
      bar.setAttribute('width', bar.dataset.origWidth);
      bar.setAttribute('height', bar.dataset.origHeight);
      console.log('Scoreboard bar shown');
    }

        // Toggle the overlay text
    const barText = document.getElementById('bar-text');
    if (barText) {
      if (!barText.dataset.hidden) {
        barText.dataset.hidden = 'true';
        barText.style.display = 'none';
        console.log('Bar text hidden');
      } else {
        barText.dataset.hidden = '';
        barText.style.display = 'flex';
        console.log('Bar text shown');
      }
    }
  }
});

function toggleEditMode(on) {
  const editable = document.querySelectorAll('.team-name, #patch-text, #bar-text');
  editable.forEach(el => {
    el.contentEditable = on;
    el.style.outline = on ? '1px dashed yellow' : 'none';
  });
  console.log(`Edit mode ${on ? 'enabled' : 'disabled'}`);
}

function swapSides() {
  // swap team names
  const blueName = document.querySelector('.blue-team .team-name');
  const redName = document.querySelector('.red-team .team-name');
  const tempName = blueName.textContent;
  blueName.textContent = redName.textContent;
  redName.textContent = tempName;

  // swap wins count
  const tempWins = blueWinsCount;
  blueWinsCount = redWinsCount;
  redWinsCount = tempWins;

  // update displayed win boxes
  updateWins('blue', blueWinsCount);
  updateWins('red', redWinsCount);

  console.log('Sides swapped including wins');
}

function updateWins(team, count) {
  const wins = document.querySelectorAll(`.${team}-team .win`);
  wins.forEach((el, i) => {
    el.style.backgroundColor = i < count ? '#00ff00' : 'black'; // brighter green
  });
  console.log(`${team} wins set to ${count}`);
}

function setBestOf(n) {
  bestOf = n;
  maxWins = Math.ceil(n / 2);
  console.log(`Set to best of ${n}`);
  console.log(maxWins);
  const blueWins = document.querySelectorAll('.blue-team .win');
  const redWins = document.querySelectorAll('.red-team .win');

  blueWins.forEach((el, i) => el.style.display = (n === 3 ? i < 2 : i < 3) ? 'block' : 'none');
  redWins.forEach((el, i) => el.style.display = (n === 3 ? i < 2 : i < 3) ? 'block' : 'none');

  if (blueWinsCount > maxWins) blueWinsCount = maxWins;
  if (redWinsCount > maxWins) redWinsCount = maxWins;

  updateWins('blue', blueWinsCount);
  updateWins('red', redWinsCount);
}