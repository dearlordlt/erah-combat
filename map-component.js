Vue.component('combat-map', {
  template: '#combat-map-template',
  props: ['players', 'opponents'],
  data() {
    return {
      grid: [],
      rows: 7,
      columns: 11,
    };
  },
  mounted() {
    this.generateMap();
  },
  methods: {
    generateMap() {
      this.grid = Array.from({ length: this.rows }, () => Array(this.columns).fill(null));
      this.placeCombatants();
    },
    placeCombatants() {
      // Place opponents on the left side of the grid
      if (this.opponents) {
        this.opponents.forEach((opponent, index) => {
          let placed = false;
          while (!placed) {
            const row = Math.floor(Math.random() * this.rows);
            const col = Math.floor(Math.random() * Math.floor(this.columns / 2));
            if (!this.grid[row][col]) {
              this.grid[row][col] = {
                type: 'opponent',
                ...opponent,
                index: index + 1
              };
              placed = true;
            }
          }
        });
      }

      // Place players on the right side of the grid
      if (this.players) {
        this.players.forEach((player, index) => {
          let placed = false;
          while (!placed) {
            const row = Math.floor(Math.random() * this.rows);
            const col = Math.floor(Math.random() * Math.floor(this.columns / 2) + Math.ceil(this.columns / 2));
            if (!this.grid[row][col]) {
              this.grid[row][col] = {
                type: 'player',
                ...player
              };
              placed = true;
            }
          }
        });
      }

      // Ensure no gaps by re-arranging cells if necessary
      this.grid = this.grid.map(row => row.map(cell => cell || { empty: true }));
    },
    isDead(combatant) {
      return combatant && combatant.isDead;
    }
  },
  watch: {
    players: 'generateMap',
    opponents: 'generateMap',
  },
});
