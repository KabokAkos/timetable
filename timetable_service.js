const BASE_URL = "http://localhost:3000/timetable";

function loadTimetable() {
    fetch(BASE_URL)
        .then(res => res.json())
        .then(data => {
            renderTimetable(data);
        })
        .catch(err => {
            console.error("Error while loading the timetable", err);
        });
}

function renderTimetable(timetableData) {
    const tbody = document.querySelector("#timetable tbody");
    tbody.innerHTML = "";

    const lessons = {};
    timetableData.forEach(entry => {
        if (!lessons[entry.time_id]) {
            lessons[entry.time_id] = { id: entry.time_id, dayData: {}, start: entry.start, end: entry.end };
        }
        lessons[entry.time_id].dayData[entry.day_id] = entry.subject_name;
    });

    Object.values(lessons).forEach(lesson => {
        const tr = document.createElement("tr");

        const lessonNumber = document.createElement("td");
        lessonNumber.textContent = lesson.id;
        tr.appendChild(lessonNumber);

        const length = document.createElement("td");
        length.textContent = `${lesson.start} - ${lesson.end}`;
        tr.appendChild(length);

        for (let i = 1; i <= 5; i++) {
            const td = document.createElement("td");
            td.textContent = lesson.dayData[i] || "-";
            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    });
}

function deleteTimetableEntry(id) {
    fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        loadTimetable();
    })
    .catch(error => console.error('Error:', error));
}

