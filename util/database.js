import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./data/database.sqlite');

export function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

export function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

export function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
};

export async function initializeDatabase() {
    await dbRun("DROP TABLE IF EXISTS timetable;");
    await dbRun("DROP TABLE IF EXISTS days;");
    await dbRun("DROP TABLE IF EXISTS timeslots;");
    await dbRun("DROP TABLE IF EXISTS subjects;");

    await dbRun("CREATE TABLE days (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE);");
    await dbRun("CREATE TABLE timeslots (id INTEGER PRIMARY KEY AUTOINCREMENT, lesson_number INTEGER, start TEXT, end TEXT);");
    await dbRun("CREATE TABLE subjects (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE);");
    await dbRun(`CREATE TABLE timetable (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        day_id INTEGER,
        time_id INTEGER,
        subject_id INTEGER,
        FOREIGN KEY (day_id) REFERENCES days(id),
        FOREIGN KEY (time_id) REFERENCES timeslots(id),
        FOREIGN KEY (subject_id) REFERENCES subjects(id)
    );`);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    for (const day of days) {
        await dbRun("INSERT INTO days (name) VALUES (?);", [day]);
    }

    const timeslots = [
        { lesson_number: 1, start: "08:00", end: "08:45" },
        { lesson_number: 2, start: "08:55", end: "09:40" },
        { lesson_number: 3, start: "09:55", end: "10:40" },
        { lesson_number: 4, start: "10:50", end: "11:35" },
        { lesson_number: 5, start: "11:45", end: "12:30" },
        { lesson_number: 6, start: "12:45", end: "13:30" },
        { lesson_number: 7, start: "13:40", end: "14:25" },
        { lesson_number: 8, start: "14:30", end: "15:15" },
        { lesson_number: 9, start: "15:20", end: "16:00" },
        { lesson_number: 10, start: "16:06", end: "16:45" },
        { lesson_number: 11, start: "16:50", end: "17:30" },
        { lesson_number: 12, start: "17:35", end: "18:10" }
    ];
    for (const slot of timeslots) {
        await dbRun("INSERT INTO timeslots (lesson_number, start, end) VALUES (?, ?, ?);", [slot.lesson_number, slot.start, slot.end]);
    }

    const subjects = [
        "Emelt angol", "Angol", "Osztályfőnöki", "Testnevelés", "Matematika", "Érettségi felkészítő(magyar)",
        "PHP", "Javascript", "Német", "C#", "Nyelvtan", "Szakmai angol", "CMS+WD", "Szoftvertesztelés",
        "Történelem", "Irodalom", "Állampolgári ismeret", "Érettségi felkészítő(matematika)"
    ];

    for (const subject of subjects) {
        await dbRun("INSERT INTO subjects (name) VALUES (?);", [subject]);
    }

    const timetable = [
        ["Monday", 1, "Emelt angol"], ["Monday", 2, "Emelt angol"], ["Monday", 3, "Angol"], ["Monday", 4, "Osztályfőnöki"], ["Monday", 5, "Testnevelés"],
        ["Monday", 6, "Testnevelés"], ["Monday", 7, "Matematika"], ["Monday", 8, "Érettségi felkészítő(magyar)"],
        ["Tuesday", 1, "PHP"], ["Tuesday", 2, "Javascript"], ["Tuesday", 3, "Német"], ["Tuesday", 4, "C#"], ["Tuesday", 5, "Nyelvtan"], ["Tuesday", 6, "Szakmai angol"], ["Tuesday", 7, "CMS+WD"], ["Tuesday", 8, "C#"], ["Tuesday", 9, "C#"], ["Tuesday", 10, "Szoftvertesztelés"], ["Tuesday", 11, "Szoftvertesztelés"], ["Tuesday", 12, "Szoftvertesztelés"],
        ["Wednesday", 1, "C#"], ["Wednesday", 2, "Matematika"], ["Wednesday", 3, "Angol"], ["Wednesday", 4, "Szakmai angol"], ["Wednesday", 5, "Történelem"], ["Wednesday", 6, "Érettségi felkészítő(matematika)"],
        ["Thursday", 1, "Történelem"], ["Thursday", 2, "Irodalom"], ["Thursday", 3, "Matematika"], ["Thursday", 4, "Szakmai angol"], ["Thursday", 5, "Német"], ["Thursday", 6, "Angol"],
        ["Friday", 1, "Állampolgári ismeret"], ["Friday", 2, "Történelem"], ["Friday", 3, "Irodalom"], ["Friday", 4, "Javascript"], ["Friday", 5, "Testnevelés"], ["Friday", 6, "Angol"], ["Friday", 7, "C#"]
    ];


    for (const entry of timetable) {
        await dbRun(`INSERT INTO timetable (day_id, time_id, subject_id)
            VALUES (
                (SELECT id FROM days WHERE name = ?),
                (SELECT id FROM timeslots WHERE lesson_number = ?),
                (SELECT id FROM subjects WHERE name = ?)
            );`, entry);
    }
}
