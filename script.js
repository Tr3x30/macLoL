const SCROLL_LOCK_TIME = 250;
const DELTA_GROWTH_EPSILON = 8;

let scrollLocked = false;
let currentIndex = 0;
let lastDeltaMagnitude = 0;


function updateMenuBar() {
    const svg = document.getElementById('menu-bar-background');
    const path = document.getElementById('menu-path');
    const pageInfo = document.getElementById('content-info');
    const pageMenu = document.getElementById('page-menu');
    const contentGrid = document.getElementById('content-grid');

    const w = window.innerWidth;
    const h = Math.ceil(window.innerHeight / 3);
    const drop = h / 2;

    const infoWidth = pageInfo.offsetWidth;
    let segment = w / 4;
    let middleFlat = 2 * segment - 2 * drop;

    if (middleFlat < infoWidth) {
        segment = (w - infoWidth - 2 * drop)/2;
        middleFlat = infoWidth;
    }

    // Build path
    const d = `
    M 0 0
    l ${Math.ceil(segment)} 0
    c ${drop / 2} 0, ${drop / 2} ${drop}, ${drop} ${drop}
    l ${Math.ceil(middleFlat)} 0
    c ${drop / 2} 0, ${drop / 2} ${-drop}, ${drop} ${-drop}
    l ${Math.ceil(segment)} 0
    l 0 ${h}
    L 0 ${h} z
    `.replace(/\s+/g, ' ').trim();

    path.setAttribute('d', d);
    svg.setAttribute('height', `${h}px`);

    if (pageInfo) {
        pageInfo.style.height = `${h / 2}px`;
    }

    if (pageMenu && contentGrid) {
        var spaceAvailable = ((w - contentGrid.offsetWidth) / 2);
        if (spaceAvailable > pageMenu.offsetWidth) {
            console.log(`Value:${spaceAvailable}`);
        }
        pageMenu.style.left = `${w - spaceAvailable / 2}px`;
    }   
}

function goToIndex(index) {
    const items = document.querySelectorAll('.menu-text');
    const title = document.getElementById('menu-title');

    // Clamp index (important for scroll input)
    currentIndex = Math.max(0, Math.min(index, items.length - 1));

    // ---- UPDATE MENU STATE ----
    items.forEach(i => i.classList.remove('active'));

    const activeItem = items[currentIndex];
    activeItem.classList.add('active');

    if (title) {
        title.textContent = activeItem.textContent;
    }

    // ---- SCROLL GRID ----
    const grid = document.getElementById('content-grid');
    const block = document.querySelector('.content-block');

    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    const blockHeight = block.offsetHeight;
    const gridMargin = 0.05 * windowHeight;
    const cellPadding = (currentIndex / 50) * windowWidth;
    const cellSize = 2 * blockHeight * currentIndex;
    const idealTop = gridMargin - cellPadding - cellSize;
    const maxTop = windowHeight / 2 - grid.offsetHeight;
    const tooWide = 0.62 * windowHeight < 0.02 * windowWidth + 2 * blockHeight;
    if (tooWide) {
        console.log(`Max: ${0.62*windowHeight}\tCurrent: ${0.02*windowWidth + 2*blockHeight}`);
    }

    grid.style.top = `${Math.max(idealTop, maxTop)}px`;
}


document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.content-block-grid');

  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.content-block');
    if (!card) return;
    scrollLocked = true;
    openCard(card);
  });

  function openCard(card) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'card-overlay';

    // Clone card
    const clone = card.cloneNode(true);

    overlay.appendChild(clone);
    document.body.appendChild(overlay);

    // Close on click outside
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
        scrollLocked = false;
      }
    });

    // ESC to close
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') {
        scrollLocked = false;
        overlay.remove();
        document.removeEventListener('keydown', esc);
      }
    });
  }
});


window.addEventListener('wheel', (e) => {
    e.preventDefault();

    const delta = e.deltaY;
    const magnitude = Math.abs(delta);

    // Reject momentum (delta magnitude shrinking)
    if (magnitude <= lastDeltaMagnitude + DELTA_GROWTH_EPSILON) {
        lastDeltaMagnitude = magnitude;
        return;
    }

    lastDeltaMagnitude = magnitude;

    if (scrollLocked) return;
    scrollLocked = true;

    goToIndex(
        currentIndex + (delta > 0 ? 1 : -1)
    );

    setTimeout(() => {
        scrollLocked = false;
    }, SCROLL_LOCK_TIME);

}, { passive: false });


window.addEventListener('resize', () => {
    updateMenuBar();
    goToIndex(currentIndex);
});

// Handle menu-text click state
window.addEventListener('load', () => {
    updateMenuBar();
    const items = document.querySelectorAll('.menu-text');

    items.forEach((item, index) => {
        item.addEventListener('click', () => {
            items.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            goToIndex(index);
        });
    });
});

