// === DOM Elements ===
const blueBansEl = document.getElementById('blue-bans');
const redBansEl = document.getElementById('red-bans');
const bluePicksEl = document.getElementById('blue-picks');
const redPicksEl = document.getElementById('red-picks');
const phaseIndicator = document.getElementById('phase-indicator');
const championGrid = document.getElementById('champion-grid');
const notificationEl = document.getElementById('notification');

// === State ===
let currentRoomId = null;
let champions = []; // будет загружено из JSON (предполагается, что вы уже парсите их)

// === Utility Functions ===
function showNotification(message, isError = false) {
    notificationEl.textContent = message;
    notificationEl.className = isError ? 'notification error' : 'notification success';
    notificationEl.style.display = 'block';
    setTimeout(() => {
        notificationEl.style.display = 'none';
    }, 3000);
}

function createEmptySlot(label = '') {
    const div = document.createElement('div');
    div.className = 'champion-slot empty';
    div.textContent = label;
    return div;
}

function createChampionCardByName(name) {
    const champ = champions.find(c => c.name === name);
    if (!champ) {
        const div = document.createElement('div');
        div.className = 'champion-slot unknown';
        div.textContent = name;
        return div;
    }

    const img = document.createElement('img');
    img.src = champ.icon;
    img.alt = champ.name;
    img.title = champ.name;

    const div = document.createElement('div');
    div.className = 'champion-slot';
    div.appendChild(img);
    return div;
}

function markUnavailableChampions(unavailableList) {
    const unavailableNames = new Set(unavailableList.map(a => a.champion_name));
    const allCards = championGrid.querySelectorAll('.champion-card');
    allCards.forEach(card => {
        const name = card.dataset.name;
        if (unavailableNames.has(name)) {
            card.classList.add('unavailable');
            card.style.pointerEvents = 'none';
            card.style.opacity = '0.5';
        }
    });
}

// === Core Functions ===

async function loadChampions() {
    try {
        const response = await fetch('/static/champions.json');
        if (!response.ok) throw new Error('Failed to load champions');
        const data = await response.json();
        // Предполагается формат: { "Ahri": { "name": "Ahri", "icon": "/static/icons/Ahri.png" }, ... }
        champions = Object.values(data);
        renderChampionGrid();
    } catch (error) {
        console.error('Error loading champions:', error);
        showNotification('Failed to load champion list', true);
    }
}

function renderChampionGrid() {
    championGrid.innerHTML = '';
    champions.forEach(champ => {
        const card = document.createElement('div');
        card.className = 'champion-card';
        card.dataset.name = champ.name;

        const img = document.createElement('img');
        img.src = champ.icon;
        img.alt = champ.name;
        img.loading = 'lazy';

        card.appendChild(img);
        card.addEventListener('click', () => handleChampionClick(champ.name));
        championGrid.appendChild(card);
    });
}

async function loadRoomState() {
    const pathParts = window.location.pathname.split('/');
    const roomIndex = pathParts.indexOf('room');
    currentRoomId = roomIndex !== -1 ? pathParts[roomIndex + 1] : null;

    if (!currentRoomId) {
        showNotification('Room ID not found in URL', true);
        return;
    }

    try {
        const res = await fetch(`/api/room/${currentRoomId}/status/`);
        if (!res.ok) throw new Error('Room not found or server error');
        const data = await res.json();

        renderBansAndPicks(data.actions);
        updatePhaseIndicator(data);
    } catch (err) {
        console.error('Failed to load room state:', err);
        showNotification('Failed to load room state', true);
    }
}

function renderBansAndPicks(actions) {
    const blueBans = actions.filter(a => a.side === 'blue' && a.action_type === 'ban');
    const redBans = actions.filter(a => a.side === 'red' && a.action_type === 'ban');
    const bluePicks = actions.filter(a => a.side === 'blue' && a.action_type === 'pick');
    const redPicks = actions.filter(a => a.side === 'red' && a.action_type === 'pick');

    // Clear
    blueBansEl.innerHTML = '';
    redBansEl.innerHTML = '';
    bluePicksEl.innerHTML = '';
    redPicksEl.innerHTML = '';

    // Render bans (5 slots)
    for (let i = 0; i < 5; i++) {
        if (i < blueBans.length) {
            blueBansEl.appendChild(createChampionCardByName(blueBans[i].champion_name));
        } else {
            blueBansEl.appendChild(createEmptySlot('Ban'));
        }

        if (i < redBans.length) {
            redBansEl.appendChild(createChampionCardByName(redBans[i].champion_name));
        } else {
            redBansEl.appendChild(createEmptySlot('Ban'));
        }
    }

    // Render picks (5 slots)
    for (let i = 0; i < 5; i++) {
        if (i < bluePicks.length) {
            bluePicksEl.appendChild(createChampionCardByName(bluePicks[i].champion_name));
        } else {
            bluePicksEl.appendChild(createEmptySlot('Pick'));
        }

        if (i < redPicks.length) {
            redPicksEl.appendChild(createChampionCardByName(redPicks[i].champion_name));
        } else {
            redPicksEl.appendChild(createEmptySlot('Pick'));
        }
    }

    // Disable unavailable champions
    markUnavailableChampions([...blueBans, ...redBans, ...bluePicks, ...redPicks]);
}

function updatePhaseIndicator(data) {
    const totalBans = data.actions.filter(a => a.action_type === 'ban').length;
    const totalPicks = data.actions.filter(a => a.action_type === 'pick').length;
    const isBlueTurn = data.current_turn === 'blue';

    let text = 'Draft Complete!';
    if (totalBans < 10) {
        const banNum = totalBans + 1;
        const team = isBlueTurn ? 'Blue' : 'Red';
        text = `Draft Phase: ${team} Team Ban (${banNum}/10)`;
    } else if (totalPicks < 10) {
        const pickNum = totalPicks + 1;
        const team = isBlueTurn ? 'Blue' : 'Red';
        text = `Draft Phase: ${team} Team Pick (${pickNum}/10)`;
    }

    if (phaseIndicator) {
        phaseIndicator.textContent = text;
    }
}

async function sendChampionSelection(champName, actionType) {
    const userUUID = localStorage.getItem('user_uid');
    if (!userUUID || !currentRoomId) {
        showNotification('User or room not found', true);
        return;
    }

    try {
        const response = await fetch(`/api/room/${currentRoomId}/draft/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_uuid: userUUID,
                champion: champName,
                action: actionType
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            showNotification(errorData.error || 'Action failed', true);
            return;
        }

        showNotification(`Champion ${actionType}ed successfully!`);
        await loadRoomState(); // refresh state
    } catch (error) {
        console.error('Error sending action:', error);
        showNotification('Network error', true);
    }
}

function handleChampionClick(champName) {
    // Determine if we are in ban or pick phase (simplified: check total bans)
    fetch(`/api/room/${currentRoomId}/status/`)
        .then(res => res.json())
        .then(data => {
            const totalBans = data.actions.filter(a => a.action_type === 'ban').length;
            const actionType = totalBans < 10 ? 'ban' : 'pick';
            sendChampionSelection(champName, actionType);
        })
        .catch(() => {
            showNotification('Could not determine draft phase', true);
        });
}

// === Initialization ===
document.addEventListener('DOMContentLoaded', async () => {
    if (!championGrid || !blueBansEl) return; // only run on draft page

    await loadChampions();
    await loadRoomState();

    // Optional: auto-refresh every 5 seconds (optional for multi-user sync)
    // setInterval(loadRoomState, 5000);
});