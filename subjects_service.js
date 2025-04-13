const BASE_URL = "http://localhost:3000/subjects/";

// Az összes tantárgy lekérése
function getAllSubject() {
    fetch(BASE_URL)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Hiba a válaszban");
            }
            return response.json();
        })
        .then((data) => {
            console.log("Subjects:", data);
            renderSubjects(data);
        })
        .catch((err) => console.error("Error while fetching subjects:", err));
}

// A tantárgyak renderelése
function renderSubjects(subjects) {
    const tbody = document.querySelector("#subject tbody");
    tbody.innerHTML = ""; // Töröljük a régi tantárgyakat

    subjects.forEach(subject => {
        const tr = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = subject.id;

        const nameCell = document.createElement("td");
        nameCell.textContent = subject.name;

        // Törlés gomb hozzáadása
        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function() {
            deleteSubject(subject.id);
        };

        actionCell.appendChild(deleteButton);
        tr.appendChild(idCell);
        tr.appendChild(nameCell);
        tr.appendChild(actionCell);
        tbody.appendChild(tr);
    });
}

// Tantárgy hozzáadása
function addSubject(name) {
    const subject = {
        name: name
    };

    fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(subject)
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Hiba a válasz küldésénél");
            }
            return response.json();
        })
        .then(() => {
            console.log("New subject added successfully");
            getAllSubject(); // Frissítjük a tantárgyak listáját
        })
        .catch((err) => console.error("Error while adding subject:", err));
}

// Tantárgy törlése
function deleteSubject(id) {
    fetch(BASE_URL + id, {
        method: "DELETE"
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Hiba a tantárgy törlésénél");
            }
            console.log("Subject deleted successfully");
            getAllSubject(); // Frissítjük a tantárgyak listáját
        })
        .catch((err) => console.error("Error while deleting subject:", err));
}

// Egyetlen tantárgy lekérése
function getSubjectById(id) {
    fetch(BASE_URL + id)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Hiba a válaszban");
            }
            return response.json();
        })
        .then((data) => {
            console.log("Egyetlen subject:", data);
            renderSubjects([data]);
        })
        .catch((err) => console.error("Error while fetching subject:", err));
}
