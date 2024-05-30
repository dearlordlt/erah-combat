const maleNameStarts = ["Dax", "Corl", "Syl", "Ar", "Sar", "Tren", "Pike", "Vex", "Jov", "Drav", "Nex", "Bron", "Ver", "Or", "Mir", "Tav"];
const maleNameEnds = ["en", "an", "as", "lo", "o", "n", "or", "is", "an", "en", "or", "ar", "ick", "in", "ek", "os"];

const femaleNameStarts = ["Ny", "Ela", "Tes", "Syl", "Mir", "Lex", "Cyr", "Vi", "Pri", "Ly", "Tha", "Qo", "El", "Rin", "Ko"];
const femaleNameEnds = ["ra", "ra", "sa", "vi", "elle", "a", "a", "na", "a", "sa", "lia", "ri", "sira", "na", "ra"];

const lastNameStarts = ["Vir", "Math", "Kren", "Ven", "Kin", "Jav", "Mar", "Nal", "Ty", "Ky", "Lor", "Elg", "Dun", "Strat", "Hal", "Ard"];
const lastNameEnds = ["e", "is", "t", "dis", "x", "or", "lo", "e", "ex", "yl", "or", "ar", "e", "t", "on", "en"];

const weapons = ["Pistol", "SMG", "Rifle"];

let players = [];
let opponents = [];

function getRandomName(gender) {
  let firstNameStart, firstNameEnd;
  if (gender === "male") {
    firstNameStart = maleNameStarts[Math.floor(Math.random() * maleNameStarts.length)];
    firstNameEnd = maleNameEnds[Math.floor(Math.random() * maleNameEnds.length)];
  } else if (gender === "female") {
    firstNameStart = femaleNameStarts[Math.floor(Math.random() * femaleNameStarts.length)];
    firstNameEnd = femaleNameEnds[Math.floor(Math.random() * femaleNameEnds.length)];
  }
  const lastNameStart = lastNameStarts[Math.floor(Math.random() * lastNameStarts.length)];
  const lastNameEnd = lastNameEnds[Math.floor(Math.random() * lastNameEnds.length)];

  const firstName = firstNameStart + firstNameEnd;
  const lastName = lastNameStart + lastNameEnd;
  return `${firstName} ${lastName}`;
}

function getRandomStat(min, max, outliers = false) {
  if (outliers && Math.random() < 0.1) {
    return min - 1 + Math.floor(Math.random() * (max - min + 3));
  }
  return min + Math.floor(Math.random() * (max - min + 1));
}

function startCombat() {
  const opponentsCount = document.getElementById('opponentsCount').value;
  opponents = [];

  for (let i = 0; i < opponentsCount; i++) {
    const gender = Math.random() < 0.5 ? 'male' : 'female';
    const name = getRandomName(gender);
    const attack = getRandomStat(3, 6, true);
    const defence = attack + [-1, 0, 1][Math.floor(Math.random() * 3)];
    const speed = getRandomStat(5, 10);
    const hp = getRandomStat(14, 22);
    const weapon = weapons[Math.floor(Math.random() * weapons.length)];
    let damage;
    switch (weapon) {
      case "Pistol":
        damage = getRandomStat(2, 4);
        break;
      case "SMG":
        damage = getRandomStat(3, 5);
        break;
      case "Rifle":
        damage = getRandomStat(4, 6);
        break;
    }
    const armor = getRandomStat(1, 4);
    const headArmor = Math.random() < 0.2 ? armor + 1 : armor;
    const bodyArmor = Math.random() < 0.2 ? armor + 1 : armor;
    const description = "";

    opponents.push({ type: 'opponent', id: generateUniqueId(), gender, name, attack, defence, speed, hp, weapon, damage, headArmor, bodyArmor, armor, description });
  }

  sortCombatants();
  renderCombatants([...players, ...opponents]);
}

function generateUniqueId() {
  return 'id-' + Math.random().toString(36).substr(2, 9);
}

function renderCombatants(combatants) {
  const combatantsList = document.getElementById('combatantsList');
  combatantsList.innerHTML = '';

  combatants.forEach(combatant => {
    const combatantDiv = document.createElement('div');
    combatantDiv.classList.add(combatant.type === 'player' ? 'player' : 'opponent');
    combatantDiv.id = combatant.id;
    combatantDiv.innerHTML = combatant.type === 'player' ? `
      <div class="player-details">
        <span><strong>Player: ${combatant.name}</strong></span>
        <input type="number" value="${combatant.speed}" onchange="updatePlayerSpeed('${combatant.id}', this.value)">
        <button class="remove-button" onclick="removePlayer('${combatant.id}')">Remove</button>
      </div>
    ` : `
      <button type="button" class="collapsible">Opponent: ${combatant.name} (Speed: ${combatant.speed})</button>
      <div class="content">
        <div class="stats-grid">
          <div>
            <label for="gender${combatant.id}">Gender:</label>
            <input type="text" id="gender${combatant.id}" value="${combatant.gender}" readonly>
          </div>
          <div>
            <label for="name${combatant.id}">Name:</label>
            <input type="text" id="name${combatant.id}" value="${combatant.name}" readonly>
          </div>
          <div>
            <label for="attack${combatant.id}">Attack:</label>
            <input type="number" id="attack${combatant.id}" value="${combatant.attack}" readonly>
          </div>
          <div>
            <label for="defence${combatant.id}">Defence:</label>
            <input type="number" id="defence${combatant.id}" value="${combatant.defence}" readonly>
          </div>
          <div>
            <label for="speed${combatant.id}">Speed:</label>
            <input type="number" id="speed${combatant.id}" value="${combatant.speed}" readonly>
          </div>
          <div>
            <label for="hp${combatant.id}">HP:</label>
            <input type="number" id="hp${combatant.id}" value="${combatant.hp}" readonly>
          </div>
          <div>
            <label for="weapon${combatant.id}">Weapon:</label>
            <input type="text" id="weapon${combatant.id}" value="${combatant.weapon}" readonly>
          </div>
          <div>
            <label for="damage${combatant.id}">Damage:</label>
            <input type="number" id="damage${combatant.id}" value="${combatant.damage}" readonly>
          </div>
        </div>
        <h4>Damage Effects</h4>
        ${generateLocationHTML('Head', combatant.headArmor, combatant.id)}
        ${generateLocationHTML('Body', combatant.bodyArmor, combatant.id)}
        ${generateLocationHTML('Left Hand', combatant.armor, combatant.id)}
        ${generateLocationHTML('Right Hand', combatant.armor, combatant.id)}
        ${generateLocationHTML('Left Leg', combatant.armor, combatant.id)}
        ${generateLocationHTML('Right Leg', combatant.armor, combatant.id)}
        <h4>Description</h4>
        <textarea id="description${combatant.id}" rows="2">${combatant.description}</textarea>
      </div>
    `;
    combatantsList.appendChild(combatantDiv);

    if (combatant.type === 'opponent') {
      const collapsibleButton = combatantDiv.querySelector('.collapsible');
      const contentDiv = combatantDiv.querySelector('.content');
      collapsibleButton.addEventListener('click', function () {
        this.classList.toggle('active');
        contentDiv.style.display = contentDiv.style.display === 'block' ? 'none' : 'block';
      });
    }
  });

  // Collapse all opponents by default
  document.querySelectorAll('.collapsible').forEach(button => {
    button.classList.remove('active');
    button.nextElementSibling.style.display = 'none';
  });
}

function generateLocationHTML(location, armor, id) {
  return `
    <label for="${location.toLowerCase().replace(' ', '')}${id}">${location}:</label>
    <input type="number" id="${location.toLowerCase().replace(' ', '')}${id}" value="${armor}" readonly>
    <div class="damage-effects">
      ${generateDamageEffectSelect(`${location.toLowerCase().replace(' ', '')}Effect1${id}`)}
      ${generateDamageEffectSelect(`${location.toLowerCase().replace(' ', '')}Effect2${id}`)}
      ${generateDamageEffectSelect(`${location.toLowerCase().replace(' ', '')}Effect3${id}`)}
    </div>
  `;
}

function generateDamageEffectSelect(id) {
  return `
    <select id="${id}">
      <option value=""></option>
      <option value="B">B</option>
      <option value="C">C</option>
      <option value="T">T</option>
    </select>
  `;
}

function addPlayer() {
  const playerName = document.getElementById('playerName').value.trim();
  const playerSpeed = parseInt(document.getElementById('playerSpeed').value, 10);

  if (playerName === '' || isNaN(playerSpeed)) {
    alert('Please enter a valid name and speed.');
    return;
  }

  players.push({ type: 'player', id: generateUniqueId(), name: playerName, speed: playerSpeed });
  renderCombatants([...players, ...opponents]);
}

function removePlayer(id) {
  players = players.filter(player => player.id !== id);
  renderCombatants([...players, ...opponents]);
}

function updatePlayerSpeed(id, speed) {
  const player = players.find(player => player.id === id);
  if (player) {
    player.speed = parseInt(speed, 10);
    renderCombatants([...players, ...opponents]);
  }
}

function getOpponentsFromDOM() {
  return opponents.map(opponent => {
    const id = opponent.id;
    const genderElem = document.getElementById(`gender${id}`);
    const nameElem = document.getElementById(`name${id}`);
    const attackElem = document.getElementById(`attack${id}`);
    const defenceElem = document.getElementById(`defence${id}`);
    const speedElem = document.getElementById(`speed${id}`);
    const hpElem = document.getElementById(`hp${id}`);
    const weaponElem = document.getElementById(`weapon${id}`);
    const damageElem = document.getElementById(`damage${id}`);
    const headElem = document.getElementById(`head${id}`);
    const bodyElem = document.getElementById(`body${id}`);
    const leftHandElem = document.getElementById(`lefthand${id}`);
    const rightHandElem = document.getElementById(`righthand${id}`);
    const leftLegElem = document.getElementById(`leftleg${id}`);
    const rightLegElem = document.getElementById(`rightleg${id}`);

    return {
      type: 'opponent',
      id,
      gender: genderElem ? genderElem.value : '',
      name: nameElem ? nameElem.value : '',
      attack: attackElem ? parseInt(attackElem.value, 10) : 0,
      defence: defenceElem ? parseInt(defenceElem.value, 10) : 0,
      speed: speedElem ? parseInt(speedElem.value, 10) : 0,
      hp: hpElem ? parseInt(hpElem.value, 10) : 0,
      weapon: weaponElem ? weaponElem.value : '',
      damage: damageElem ? parseInt(damageElem.value, 10) : 0,
      headArmor: headElem ? parseInt(headElem.value, 10) : 0,
      bodyArmor: bodyElem ? parseInt(bodyElem.value, 10) : 0,
      leftHandArmor: leftHandElem ? parseInt(leftHandElem.value, 10) : 0,
      rightHandArmor: rightHandElem ? parseInt(rightHandElem.value, 10) : 0,
      leftLegArmor: leftLegElem ? parseInt(leftLegElem.value, 10) : 0,
      rightLegArmor: rightLegElem ? parseInt(rightLegElem.value, 10) : 0,
      headEffect1: document.getElementById(`headEffect1${id}`) ? document.getElementById(`headEffect1${id}`).value : '',
      headEffect2: document.getElementById(`headEffect2${id}`) ? document.getElementById(`headEffect2${id}`).value : '',
      headEffect3: document.getElementById(`headEffect3${id}`) ? document.getElementById(`headEffect3${id}`).value : '',
      bodyEffect1: document.getElementById(`bodyEffect1${id}`) ? document.getElementById(`bodyEffect1${id}`).value : '',
      bodyEffect2: document.getElementById(`bodyEffect2${id}`) ? document.getElementById(`bodyEffect2${id}`).value : '',
      bodyEffect3: document.getElementById(`bodyEffect3${id}`) ? document.getElementById(`bodyEffect3${id}`).value : '',
      leftHandEffect1: document.getElementById(`lefthandEffect1${id}`) ? document.getElementById(`lefthandEffect1${id}`).value : '',
      leftHandEffect2: document.getElementById(`lefthandEffect2${id}`) ? document.getElementById(`lefthandEffect2${id}`).value : '',
      leftHandEffect3: document.getElementById(`lefthandEffect3${id}`) ? document.getElementById(`lefthandEffect3${id}`).value : '',
      rightHandEffect1: document.getElementById(`righthandEffect1${id}`) ? document.getElementById(`righthandEffect1${id}`).value : '',
      rightHandEffect2: document.getElementById(`righthandEffect2${id}`) ? document.getElementById(`righthandEffect2${id}`).value : '',
      rightHandEffect3: document.getElementById(`righthandEffect3${id}`) ? document.getElementById(`righthandEffect3${id}`).value : '',
      leftLegEffect1: document.getElementById(`leftlegEffect1${id}`) ? document.getElementById(`leftlegEffect1${id}`).value : '',
      leftLegEffect2: document.getElementById(`leftlegEffect2${id}`) ? document.getElementById(`leftlegEffect2${id}`).value : '',
      leftLegEffect3: document.getElementById(`leftlegEffect3${id}`) ? document.getElementById(`leftlegEffect3${id}`).value : '',
      rightLegEffect1: document.getElementById(`rightlegEffect1${id}`) ? document.getElementById(`rightlegEffect1${id}`).value : '',
      rightLegEffect2: document.getElementById(`rightlegEffect2${id}`) ? document.getElementById(`rightlegEffect2${id}`).value : '',
      rightLegEffect3: document.getElementById(`rightlegEffect3${id}`) ? document.getElementById(`rightlegEffect3${id}`).value : '',
      description: document.getElementById(`description${id}`) ? document.getElementById(`description${id}`).value : '',
      isCollapsed: document.getElementById(id) ? document.getElementById(id).querySelector('.content').style.display !== 'block' : false
    };
  });
}

function saveState() {
  const saveName = document.getElementById('saveName').value.trim();
  if (!saveName) {
    alert("Please enter a save name.");
    return;
  }

  const saveData = {
    players,
    opponents: getOpponentsFromDOM()
  };

  localStorage.setItem(saveName, JSON.stringify(saveData));
  updateLoadSelect();
}

function loadState() {
  const saveName = document.getElementById('loadSelect').value;
  if (!saveName) {
    alert("Please select a save to load.");
    return;
  }

  const saveData = JSON.parse(localStorage.getItem(saveName));
  players = saveData.players;
  opponents = saveData.opponents;

  renderCombatants([...players, ...opponents]);
}

function updateLoadSelect() {
  const loadSelect = document.getElementById('loadSelect');
  loadSelect.innerHTML = '<option value="">Select Save</option>';

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    loadSelect.innerHTML += `<option value="${key}">${key}</option>`;
  }
}

function sortCombatants() {
  const allCombatants = [...players, ...getOpponentsFromDOM()];
  allCombatants.sort((a, b) => b.speed - a.speed);
  renderCombatants(allCombatants);
}

// Initialize the load select with existing saves on page load
document.addEventListener('DOMContentLoaded', () => {
  updateLoadSelect();
});
