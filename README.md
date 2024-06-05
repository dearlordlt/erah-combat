# ERAH Combat Setup

ERAH Combat Setup is a turn-based combat management application built with Vue.js and Tailwind CSS. It allows users to simulate and manage combat scenarios with players and randomly generated opponents.

## Features

- **Add Players**: Add and manage players with custom names and speed values.
- **Generate Opponents**: Automatically generate opponents with random attributes and detailed information.
- **Combat Management**:
  - Start a new combat session.
  - Initiate new turns to reset combatants' speeds and actions.
  - Perform attack and defense actions with detailed roll results.
- **Combat Log**: View a comprehensive log of all combat actions and events.
- **Save and Load States**: Save the current state of the combat, including players, opponents, combat log, and turn number. Load and delete saved states from local storage.
- **Tooltips**: Hover over roll results to see detailed logs.
- **Responsive Design**: Clean and responsive UI built with Tailwind CSS.

## Installation

To run this application locally, follow these steps:

1. **Clone the repository**:
    ```sh
    git clone https://github.com/your-username/erah-combat-setup.git
    cd erah-combat-setup
    ```

2. **Open `index.html` in a browser**:
    Simply open the `index.html` file in your preferred web browser to start the application.

## Usage

1. **Add Players**:
   - Enter the player's name and speed.
   - Click "Add Player" to add them to the combatant list.

2. **Generate Opponents**:
   - Enter the number of opponents and click "Start Combat" to generate them.
   - Generated opponents will be displayed with their attributes.

3. **Combat Actions**:
   - Click "New Turn" to start a new turn, resetting speeds and clearing roll results.
   - Use the attack (⚔️) and defense (🛡️) buttons to perform actions for each combatant.
   - Hover over roll results to view detailed logs.

4. **Save/Load State**:
   - Enter a save name and click "Save" to save the current state.
   - Select a saved state from the dropdown and click "Load" to load it.
   - Click "Delete" to remove a specific saved state or "Delete All" to clear all saves.

5. **Combat Log**:
   - Click "View Combat Log" to open the combat log modal.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## Contact

For any questions or feedback, please contact [your-email@example.com].

