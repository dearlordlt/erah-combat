const maleNameStarts = ["Dax", "Corl", "Syl", "Ar", "Sar", "Tren", "Pike", "Vex", "Jov", "Drav", "Nex", "Bron", "Ver", "Or", "Mir", "Tav"];
const maleNameEnds = ["en", "an", "as", "lo", "o", "n", "or", "is", "an", "en", "or", "ar", "ick", "in", "ek", "os"];

const femaleNameStarts = ["Ny", "Ela", "Tes", "Syl", "Mir", "Lex", "Cyr", "Vi", "Pri", "Ly", "Tha", "Qo", "El", "Rin", "Ko"];
const femaleNameEnds = ["ra", "ra", "sa", "vi", "elle", "a", "a", "na", "a", "sa", "lia", "ri", "sira", "na", "ra"];

const lastNameStarts = ["Vir", "Math", "Kren", "Ven", "Kin", "Jav", "Mar", "Nal", "Ty", "Ky", "Lor", "Elg", "Dun", "Strat", "Hal", "Ard"];
const lastNameEnds = ["e", "is", "t", "dis", "x", "or", "lo", "e", "ex", "yl", "or", "ar", "e", "t", "on", "en"];

const weapons = ["Pistol", "SMG", "Rifle"];

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
  const opponentsList = document.getElementById('opponentsList');
  opponentsList.innerHTML = ''; // Clear previous opponents

  for (let i = 0; i < opponentsCount; i++) {
    const opponentDiv = document.createElement('div');
    opponentDiv.classList.add('opponent');

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

    opponentDiv.innerHTML = `
            <h3>Opponent ${i + 1}</h3>
            <div class="stats-grid">
                <div>
                    <label for="gender${i}">Gender:</label>
                    <input type="text" id="gender${i}" value="${gender}" >
                </div>
                <div>
                    <label for="name${i}">Name:</label>
                    <input type="text" id="name${i}" value="${name}" >
                </div>
                <div>
                    <label for="attack${i}">Attack:</label>
                    <input type="number" id="attack${i}" value="${attack}" >
                </div>
                <div>
                    <label for="defence${i}">Defence:</label>
                    <input type="number" id="defence${i}" value="${defence}" >
                </div>
                <div>
                    <label for="speed${i}">Speed:</label>
                    <input type="number" id="speed${i}" value="${speed}" >
                </div>
                <div>
                    <label for="hp${i}">HP:</label>
                    <input type="number" id="hp${i}" value="${hp}" >
                </div>
                <div>
                    <label for="weapon${i}">Weapon:</label>
                    <input type="text" id="weapon${i}" value="${weapon}" >
                </div>
                <div>
                    <label for="damage${i}">Damage:</label>
                    <input type="number" id="damage${i}" value="${damage}" >
                </div>
            </div>
            <h4>Damage Effects</h4>
            ${generateLocationHTML('Head', headArmor, i)}
            ${generateLocationHTML('Body', bodyArmor, i)}
            ${generateLocationHTML('Left Hand', armor, i)}
            ${generateLocationHTML('Right Hand', armor, i)}
            ${generateLocationHTML('Left Leg', armor, i)}
            ${generateLocationHTML('Right Leg', armor, i)}
        `;

    opponentsList.appendChild(opponentDiv);
  }
}

function generateLocationHTML(location, armor, index) {
  return `
        <label for="${location.toLowerCase().replace(' ', '')}${index}">${location}:</label>
        <input type="number" id="${location.toLowerCase().replace(' ', '')}${index}" value="${armor}" >
        <div class="damage-effects">
            ${generateDamageEffectSelect(`${location.toLowerCase().replace(' ', '')}Effect1${index}`)}
            ${generateDamageEffectSelect(`${location.toLowerCase().replace(' ', '')}Effect2${index}`)}
            ${generateDamageEffectSelect(`${location.toLowerCase().replace(' ', '')}Effect3${index}`)}
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

function saveState() {
  const saveName = document.getElementById('saveName').value.trim();
  if (!saveName) {
    alert("Please enter a save name.");
    return;
  }

  const opponents = document.querySelectorAll('.opponent');
  const saveData = Array.from(opponents).map((opponent, index) => {
    return {
      gender: document.getElementById(`gender${index}`).value,
      name: document.getElementById(`name${index}`).value,
      attack: document.getElementById(`attack${index}`).value,
      defence: document.getElementById(`defence${index}`).value,
      speed: document.getElementById(`speed${index}`).value,
      hp: document.getElementById(`hp${index}`).value,
      weapon: document.getElementById(`weapon${index}`).value,
      damage: document.getElementById(`damage${index}`).value,
      headArmor: document.getElementById(`head${index}`).value,
      bodyArmor: document.getElementById(`body${index}`).value,
      leftHandArmor: document.getElementById(`lefthand${index}`).value,
      rightHandArmor: document.getElementById(`righthand${index}`).value,
      leftLegArmor: document.getElementById(`leftleg${index}`).value,
      rightLegArmor: document.getElementById(`rightleg${index}`).value,
      headEffect1: document.getElementById(`headEffect1${index}`).value,
      headEffect2: document.getElementById(`headEffect2${index}`).value,
      headEffect3: document.getElementById(`headEffect3${index}`).value,
      bodyEffect1: document.getElementById(`bodyEffect1${index}`).value,
      bodyEffect2: document.getElementById(`bodyEffect2${index}`).value,
      bodyEffect3: document.getElementById(`bodyEffect3${index}`).value,
      leftHandEffect1: document.getElementById(`lefthandEffect1${index}`).value,
      leftHandEffect2: document.getElementById(`lefthandEffect2${index}`).value,
      leftHandEffect3: document.getElementById(`lefthandEffect3${index}`).value,
      rightHandEffect1: document.getElementById(`righthandEffect1${index}`).value,
      rightHandEffect2: document.getElementById(`righthandEffect2${index}`).value,
      rightHandEffect3: document.getElementById(`righthandEffect3${index}`).value,
      leftLegEffect1: document.getElementById(`leftlegEffect1${index}`).value,
      leftLegEffect2: document.getElementById(`leftlegEffect2${index}`).value,
      leftLegEffect3: document.getElementById(`leftlegEffect3${index}`).value,
      rightLegEffect1: document.getElementById(`rightlegEffect1${index}`).value,
      rightLegEffect2: document.getElementById(`rightlegEffect2${index}`).value,
      rightLegEffect3: document.getElementById(`rightlegEffect3${index}`).value,
    };
  });

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
  const opponentsList = document.getElementById('opponentsList');
  opponentsList.innerHTML = '';

  saveData.forEach((opponent, index) => {
    const opponentDiv = document.createElement('div');
    opponentDiv.classList.add('opponent');

    opponentDiv.innerHTML = `
            <h3>Opponent ${index + 1}</h3>
            <div class="stats-grid">
                <div>
                    <label for="gender${index}">Gender:</label>
                    <input type="text" id="gender${index}" value="${opponent.gender}" >
                </div>
                <div>
                    <label for="name${index}">Name:</label>
                    <input type="text" id="name${index}" value="${opponent.name}" >
                </div>
                <div>
                    <label for="attack${index}">Attack:</label>
                    <input type="number" id="attack${index}" value="${opponent.attack}" >
                </div>
                <div>
                    <label for="defence${index}">Defence:</label>
                    <input type="number" id="defence${index}" value="${opponent.defence}" >
                </div>
                <div>
                    <label for="speed${index}">Speed:</label>
                    <input type="number" id="speed${index}" value="${opponent.speed}" >
                </div>
                <div>
                    <label for="hp${index}">HP:</label>
                    <input type="number" id="hp${index}" value="${opponent.hp}" >
                </div>
                <div>
                    <label for="weapon${index}">Weapon:</label>
                    <input type="text" id="weapon${index}" value="${opponent.weapon}" >
                </div>
                <div>
                    <label for="damage${index}">Damage:</label>
                    <input type="number" id="damage${index}" value="${opponent.damage}" >
                </div>
            </div>
            <h4>Damage Effects</h4>
            ${generateLocationHTML('Head', opponent.headArmor, index)}
            ${generateLocationHTML('Body', opponent.bodyArmor, index)}
            ${generateLocationHTML('Left Hand', opponent.leftHandArmor, index)}
            ${generateLocationHTML('Right Hand', opponent.rightHandArmor, index)}
            ${generateLocationHTML('Left Leg', opponent.leftLegArmor, index)}
            ${generateLocationHTML('Right Leg', opponent.rightLegArmor, index)}
        `;

    opponentsList.appendChild(opponentDiv);

    document.getElementById(`headEffect1${index}`).value = opponent.headEffect1;
    document.getElementById(`headEffect2${index}`).value = opponent.headEffect2;
    document.getElementById(`headEffect3${index}`).value = opponent.headEffect3;
    document.getElementById(`bodyEffect1${index}`).value = opponent.bodyEffect1;
    document.getElementById(`bodyEffect2${index}`).value = opponent.bodyEffect2;
    document.getElementById(`bodyEffect3${index}`).value = opponent.bodyEffect3;
    document.getElementById(`lefthandEffect1${index}`).value = opponent.leftHandEffect1;
    document.getElementById(`lefthandEffect2${index}`).value = opponent.leftHandEffect2;
    document.getElementById(`lefthandEffect3${index}`).value = opponent.leftHandEffect3;
    document.getElementById(`righthandEffect1${index}`).value = opponent.rightHandEffect1;
    document.getElementById(`righthandEffect2${index}`).value = opponent.rightHandEffect2;
    document.getElementById(`righthandEffect3${index}`).value = opponent.rightHandEffect3;
    document.getElementById(`leftlegEffect1${index}`).value = opponent.leftLegEffect1;
    document.getElementById(`leftlegEffect2${index}`).value = opponent.leftLegEffect2;
    document.getElementById(`leftlegEffect3${index}`).value = opponent.leftLegEffect3;
    document.getElementById(`rightlegEffect1${index}`).value = opponent.rightLegEffect1;
    document.getElementById(`rightlegEffect2${index}`).value = opponent.rightLegEffect2;
    document.getElementById(`rightlegEffect3${index}`).value = opponent.rightLegEffect3;
  });
}

function updateLoadSelect() {
  const loadSelect = document.getElementById('loadSelect');
  loadSelect.innerHTML = '<option value="">Select Save</option>';

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    loadSelect.innerHTML += `<option value="${key}">${key}</option>`;
  }
}

// Initialize the load select with existing saves on page load
document.addEventListener('DOMContentLoaded', updateLoadSelect);
