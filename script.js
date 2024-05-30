function startCombat() {
    const opponentsCount = document.getElementById('opponentsCount').value;
    const opponentsList = document.getElementById('opponentsList');
    opponentsList.innerHTML = ''; // Clear previous opponents

    for (let i = 0; i < opponentsCount; i++) {
        const opponentDiv = document.createElement('div');
        opponentDiv.classList.add('opponent');

        opponentDiv.innerHTML = `
            <h3>Opponent ${i + 1}</h3>
            <label for="name${i}">Name:</label>
            <input type="text" id="name${i}" value="Opponent ${i + 1}">
            <label for="size${i}">Size:</label>
            <input type="text" id="size${i}" value="Medium">
            <label for="hp${i}">HP:</label>
            <input type="number" id="hp${i}" value="100">
            <label for="weapon${i}">Weapon:</label>
            <input type="text" id="weapon${i}" value="Sword">
            <label for="damage${i}">Damage:</label>
            <input type="number" id="damage${i}" value="10">
        `;

        opponentsList.appendChild(opponentDiv);
    }
}
