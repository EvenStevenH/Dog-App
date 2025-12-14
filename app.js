const header = document.querySelector("#header")

window.addEventListener('load', function () {
    header.innerHTML = `
        <h1>Dog API</h1>
        <nav>
            <li><a href="index.html">Images</a></li>
            <li><a href="dogBreed.html">Breeds</a></li>
            <li><a href="dogPurpose.html">Purpose</a></li>
            <li><a href="https://github.com/EvenStevenH/Dog-App" target="_blank">Github</a></li>
        </nav>`
})

var input = document.getElementById("dogBreedInput");
input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        getDogPurpose();
    }
})

function getDogImage() {
    fetch("https://api.thedogapi.com/v1/images/search?limit=1")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Could not fetch resource. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const dogImage = data[0].url;
            const imgElement = document.getElementById("dogImage");

            if (imgElement) {
                imgElement.src = dogImage;
                imgElement.style.display = "block";
            } else {
                console.log('Image element not found.');
            }
        })
        .catch(error => console.error("Error:", error.message));
}

function listDogBreed() {
    const dogBreedInput = document.getElementById("dogBreed-select").value;

    fetch(`https://api.thedogapi.com/v1/breeds?breed_groups=${dogBreedInput}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Could not fetch resource. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const dogBreedList = document.getElementById("dogBreedList");
            dogBreedList.innerHTML = '';

            data.forEach(breed => {
                const li = document.createElement('li');
                li.textContent = breed.name;
                dogBreedList.appendChild(li);
            });
        })
        .catch(error => console.error("Error:", error.message));
}

function getDogPurpose() {
    const dogBreedInput = document.getElementById("dogBreedInput").value.toLowerCase();

    if (dogBreedInput !== "") {

        fetch(`https://api.thedogapi.com/v1/breeds`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Could not fetch resource. Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const dogBreedPurpose = document.getElementById("dogBreedPurpose");
                dogBreedPurpose.innerHTML = '';

                const matchingBreeds = data.filter(breed =>
                    breed.name.toLowerCase().includes(dogBreedInput)
                );

                if (matchingBreeds.length === 0) {
                    dogBreedPurpose.textContent = 'Not a valid breed!';
                } else {
                    matchingBreeds.forEach(breed => {
                        const li = document.createElement('li');
                        if (!breed.bred_for || breed.bred_for.trim() === '') {
                            li.textContent = `${breed.name}: purpose unknown`;
                        } else {
                            li.textContent = `${breed.name}: ${breed.bred_for.toLowerCase()}`;
                        }
                        dogBreedPurpose.appendChild(li);
                    });
                }
            })
            .catch(error => {
                console.error("Error:", error.message);
                document.getElementById("dogBreedPurpose").textContent = 'Invalid breed, or breed does not have a known purpose.';
            });
    }
    else {
        document.getElementById("dogBreedPurpose").textContent = ''
    }
}