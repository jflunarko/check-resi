function fetchCharacterByName() {
    const characterName = document.querySelector('#characterNameTextbox').value;
    const url = `/track?name=${encodeURIComponent(characterName)}`;

    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        displayCharacter(data);
    })
    .catch(error => {
        console.error('Error:', error);
        document.querySelector('#result').innerHTML = '<p>Terjadi kesalahan, silakan coba lagi.</p>';
    });
}

function displayCharacter(character) {
    let result = '';

    if (character) {
        result = `
            <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
                <img src="${character.image}" alt="${character.name}" style="width: 100px; height: 100px;">
                <p><strong>Name:</strong> ${character.name}</p>
                <p><strong>Gender:</strong> ${character.gender}</p>
                <p><strong>Status:</strong> ${character.status}</p>
            </div>
        `;
    } else {
        result = '<p>Karakter tidak ditemukan.</p>';
    }

    document.querySelector('#result').innerHTML = result;
}