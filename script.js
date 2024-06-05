Vue.component('opponent-details', {
  template: '#opponent-details-template',
  props: ['combatant'],
  methods: {
    markAsDead() {
      this.combatant.isDead = !this.combatant.isDead;
      if (this.combatant.isDead) {
        this.combatant.currentSpeed = 0; // Ensure they can't attack or defend
      } else {
        this.combatant.currentSpeed = this.combatant.speed; // Restore the original speed when un-killed
      }
    },
    updateEffect(location, { index, value }) {
      this.$emit('update-effect', { location, index, value });
    }
  }
});

Vue.component('damage-effect', {
  template: '#damage-effect-template',
  props: ['location', 'armor', 'effects'],
  methods: {
    updateEffect(event) {
      const index = this.effects.findIndex(effect => effect === event.target.value);
      this.$emit('update', { index, value: event.target.value });
    }
  }
});

new Vue({
  el: '#app',
  data: {
    opponentsCount: 3,
    newPlayer: { name: '', speed: null },
    players: [],
    opponents: [],
    saveName: '',
    selectedSave: '',
    savedStates: [],
    sortedCombatants: [],
    buttonsDisabled: false // New data property
  },
  mounted() {
    this.updateLoadSelect();
  },
  methods: {
    getRandomName(gender) {
      const maleNameStarts = ["Dax", "Corl", "Syl", "Ar", "Sar", "Tren", "Pike", "Vex", "Jov", "Drav", "Nex", "Bron", "Ver", "Or", "Mir", "Tav"];
      const maleNameEnds = ["en", "an", "as", "lo", "o", "n", "or", "is", "an", "en", "or", "ar", "ick", "in", "ek", "os"];
      const femaleNameStarts = ["Ny", "Ela", "Tes", "Syl", "Mir", "Lex", "Cyr", "Vi", "Pri", "Ly", "Tha", "Qo", "El", "Rin", "Ko"];
      const femaleNameEnds = ["ra", "ra", "sa", "vi", "elle", "a", "a", "na", "a", "sa", "lia", "ri", "sira", "na", "ra"];
      const lastNameStarts = ["Vir", "Math", "Kren", "Ven", "Kin", "Jav", "Mar", "Nal", "Ty", "Ky", "Lor", "Elg", "Dun", "Strat", "Hal", "Ard"];
      const lastNameEnds = ["e", "is", "t", "dis", "x", "or", "lo", "e", "ex", "yl", "or", "ar", "e", "t", "on", "en"];

      const nameStarts = gender === "male" ? maleNameStarts : femaleNameStarts;
      const nameEnds = gender === "male" ? maleNameEnds : femaleNameEnds;

      const firstName = nameStarts[Math.floor(Math.random() * nameStarts.length)] + nameEnds[Math.floor(Math.random() * nameEnds.length)];
      const lastName = lastNameStarts[Math.floor(Math.random() * lastNameStarts.length)] + lastNameEnds[Math.floor(Math.random() * lastNameEnds.length)];

      return `${firstName} ${lastName}`;
    },
    getRandomStat(min, max, outliers = false) {
      return outliers && Math.random() < 0.1
        ? min - 1 + Math.floor(Math.random() * (max - min + 3))
        : min + Math.floor(Math.random() * (max - min + 1));
    },
    startCombat() {
      if (confirm("Are you sure you want to start combat?")) {
        if (isNaN(this.opponentsCount) || this.opponentsCount < 0) {
          alert("Please enter a valid number of opponents.");
          return;
        }
        this.opponents = Array.from({ length: this.opponentsCount }, () => this.createOpponent());
        this.sortCombatants();
      }
    },
    newTurn() {
      if (confirm("Are you sure you want to start a new turn?")) {
        this.opponents.forEach(opponent => {
          opponent.currentSpeed = opponent.speed;
        });
        alert("A new turn has started.");
      }
    },
    createOpponent() {
      const gender = Math.random() < 0.5 ? 'male' : 'female';
      const name = this.getRandomName(gender);
      const attack = this.getRandomStat(3, 6, true);
      const defence = attack + [-1, 0, 1][Math.floor(Math.random() * 3)];
      const speed = this.getRandomStat(5, 10);
      const hp = this.getRandomStat(14, 22);
      const weapons = ["Pistol", "SMG", "Rifle"];
      const weapon = weapons[Math.floor(Math.random() * weapons.length)];
      const damage = this.calculateDamage(weapon);
      const armor = this.calculateArmor();
      const headArmor = Math.random() < 0.2 ? armor + 1 : armor;
      const bodyArmor = Math.random() < 0.2 ? armor + 1 : armor;

      return {
        type: 'opponent',
        id: this.generateUniqueId(),
        gender,
        name,
        attack,
        defence,
        speed,
        currentSpeed: speed,
        hp,
        weapon,
        damage,
        headArmor,
        bodyArmor,
        leftHandArmor: armor,
        rightHandArmor: armor,
        leftLegArmor: armor,
        rightLegArmor: armor,
        headEffect1: '',
        headEffect2: '',
        headEffect3: '',
        bodyEffect1: '',
        bodyEffect2: '',
        bodyEffect3: '',
        leftHandEffect1: '',
        leftHandEffect2: '',
        leftHandEffect3: '',
        rightHandEffect1: '',
        rightHandEffect2: '',
        rightHandEffect3: '',
        leftLegEffect1: '',
        leftLegEffect2: '',
        leftLegEffect3: '',
        rightLegEffect1: '',
        rightLegEffect2: '',
        rightLegEffect3: '',
        description: "",
        isCollapsed: true,
        isDead: false // New property to track if the opponent is dead
      };
    },
    calculateDamage(weapon) {
      switch (weapon) {
        case "Pistol":
          return this.getRandomStat(2, 4);
        case "SMG":
          return this.getRandomStat(3, 5);
        case "Rifle":
          return this.getRandomStat(4, 6);
      }
    },
    calculateArmor() {
      const baseArmor = Math.random() < 0.1 ? (Math.random() < 0.5 ? 2 : 6) : this.getRandomStat(3, 5);
      return baseArmor;
    },
    generateUniqueId() {
      return 'id-' + Math.random().toString(36).substr(2, 9);
    },
    addPlayer() {
      if (!this.newPlayer.name || isNaN(this.newPlayer.speed)) {
        alert('Please enter a valid name and speed.');
        return;
      }
      this.players.push({ type: 'player', id: this.generateUniqueId(), name: this.newPlayer.name, speed: this.newPlayer.speed });
      this.newPlayer.name = '';
      this.newPlayer.speed = null;
      this.sortCombatants(); // Sort combatants whenever a new player is added
    },
    removePlayer(id) {
      this.players = this.players.filter(player => player.id !== id);
      this.sortCombatants(); // Sort combatants whenever a player is removed
    },
    updatePlayerSpeed(id, speed) {
      const player = this.players.find(player => player.id === id);
      if (player) {
        player.speed = parseInt(speed, 10);
      }
      this.sortCombatants(); // Sort combatants whenever a player's speed is updated
    },
    sortCombatants() {
      const allCombatants = [...this.players, ...this.opponents];
      allCombatants.sort((a, b) => b.speed - a.speed);
      this.sortedCombatants = allCombatants;
    },
    saveState() {
      if (!this.saveName) {
        alert("Please enter a save name.");
        return;
      }

      const saveData = {
        players: this.players,
        opponents: this.opponents
      };

      localStorage.setItem(this.saveName, JSON.stringify(saveData));
      this.updateLoadSelect();
    },
    loadState() {
      if (!this.selectedSave) {
        alert("Please select a save to load.");
        return;
      }

      if (confirm("Loading a new save will lose the current state of the combat. Are you sure?")) {
        const saveData = JSON.parse(localStorage.getItem(this.selectedSave));
        this.players = saveData.players || [];
        this.opponents = saveData.opponents || [];
        this.saveName = this.selectedSave;
        this.sortCombatants(); // Sort combatants whenever the state is loaded
      }
    },
    deleteSave() {
      if (!this.selectedSave) {
        alert("Please select a save to delete.");
        return;
      }

      if (confirm(`Are you sure you want to delete the save "${this.selectedSave}"? This action cannot be undone.`)) {
        localStorage.removeItem(this.selectedSave);
        this.resetState();
      }
    },
    deleteAllSaves() {
      if (confirm("Are you sure you want to delete all saves? This action cannot be undone.")) {
        localStorage.clear();
        this.resetState();
      }
    },
    resetState() {
      this.players = [];
      this.opponents = [];
      this.saveName = '';
      this.selectedSave = '';
      this.updateLoadSelect();
    },
    attack(combatant) {
      this.disableButtons();
      const damageReduction = combatant.damage >= 4 ? 4 : combatant.damage >= 3 ? 3 : 2;
      combatant.currentSpeed = Math.max(0, combatant.currentSpeed - damageReduction);
    },
    defend(combatant) {
      this.disableButtons();
      const defenseReduction = this.getRandomStat(2, 3);
      combatant.currentSpeed = Math.max(0, combatant.currentSpeed - defenseReduction);
    },
    updateEffect({ location, index, value }) {
      this.combatants.forEach(combatant => {
        if (combatant[`${location}Effect${index + 1}`] !== undefined) {
          combatant[`${location}Effect${index + 1}`] = value;
        }
      });
    },
    disableButtons() {
      this.buttonsDisabled = true;
      setTimeout(() => {
        this.buttonsDisabled = false;
      }, 1000);
    },
    updateLoadSelect() {
      this.savedStates = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        this.savedStates.push(key);
      }
    }
  },
  computed: {
    combatants() {
      return this.sortedCombatants;
    }
  }
});
