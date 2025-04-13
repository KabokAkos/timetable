import express from 'express';
import { dbAll, dbRun, dbGet, initializeDatabase } from './util/database.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/subjects', async (req, res) => {
    const subjects = await dbAll("SELECT * FROM subjects;");
    res.status(200).json(subjects);
});

app.get('/subjects/:id', async (req, res) => {
    const id = req.params.id;
    const subject = await dbGet("SELECT * FROM subjects WHERE id = ?;", [id]);
    if (!subject) {
        return res.status(404)  .json({ message: 'Subject not found' });
    };
    res.status(200).json(subject);
});

app.post('/subjects', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Missing data' });
    };
    const result = await dbRun("INSERT INTO subjects (name) VALUES (?);", [name]);
    res.status(201).json({ id: result.lastID, name });
});

app.put('/subjects/:id', async (req, res) => {
    const id = req.params.id;
    const subject = await dbGet("SELECT * FROM subjects WHERE id = ?;", [id]);
    if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
    }
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Missing data' });
    }
    await dbRun("UPDATE subjects SET name = ? WHERE id = ?;", [name, id]);
    res.status(200).json({ id, name });
});

app.delete('/subjects/:id', async (req, res) => {
    const id = req.params.id;
    const subject = await dbGet("SELECT * FROM subjects WHERE id = ?;", [id]);
    if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
    }
    await dbRun("DELETE FROM subjects WHERE id = ?;", [id]);
    res.status(200).json({ message: "Delete successful" });
});


app.get('/timetable', async (req, res) => {
    const timetable = await dbAll(`
        SELECT t.id, t.time_id, t.day_id, s.name AS subject_name, ts.start, ts.end
        FROM timetable t
        JOIN subjects s ON t.subject_id = s.id
        JOIN timeslots ts ON t.time_id = ts.id
        ORDER BY t.day_id, t.time_id;
    `);
    res.status(200).json(timetable);
});



app.put('/timetable/:id', async (req, res) => {
    const id = req.params.id;
    const timetable = await dbGet("SELECT * FROM timetable WHERE id = ?;", [id]);
    if (!timetable) {
        return res.status(404).json({ message: 'Timetable not found' });
    }
    const { subject_id } = req.body;
    if (!subject_id) {
        return res.status(400).json({ message: 'Missing data' });
    }
    await dbRun("UPDATE timetable SET subject_id = ? WHERE id = ?;", [subject_id, id]);
    res.status(200).json({ subject_id });
});

app.get('/days', async (req, res) => {
    const days = await dbAll(`
        SELECT *
        FROM days 
        ORDER BY id;`);
    res.status(200).json(timetable);
});

app.get('/days/:id', async (req, res) => {
    const id = req.params.id;
    const day = await dbGet("SELECT * FROM days WHERE id = ?;", [id]);
    if (!day) {
        return res.status(404).json({ message: 'Day not found' });
    };
    res.status(200).json(day);
});

app.get('/timeslots', async (req, res) => {
    const timeslots = await dbAll(`
        SELECT *
        FROM timeslots 
        ORDER BY lesson_number;`);
    res.status(200).json(timeslots);
});

app.get('/timeslots/:id', async (req, res) => {
    const id = req.params.id;
    const timeslot = await dbGet("SELECT * FROM timeslots WHERE id = ?;", [id]);
    if (!timeslot) {
        return res.status(404).json({ message: 'Timeslot not found' });
    };
    res.status(200).json(timeslot);
});

app.put('/timetable/:id', async (req, res) => {
    const id = req.params.id;
    const { day_id, time_id, subject_id } = req.body;
    const timetable = await dbGet("SELECT * FROM timetable WHERE id = ?;", [id]);
    if (!timetable) {
        return res.status(404).json({ message: 'Timetable entry not found' });
    }
    await dbRun("UPDATE timetable SET day_id = ?, time_id = ?, subject_id = ? WHERE id = ?;", [day_id, time_id, subject_id, id]);
    res.status(200).json({ id, day_id, time_id, subject_id });
});

app.post('/timetable', async (req, res) => {
    const { day_id, time_id, subject_id } = req.body;
    const result = await dbRun("INSERT INTO timetable (day_id, time_id, subject_id) VALUES (?, ?, ?);", [day_id, time_id, subject_id]);
    res.status(201).json({ id: result.lastID, day_id, time_id, subject_id });
});

app.delete('/timetable/:id', async (req, res) => {
    const id = req.params.id;
    const timetable = await dbGet("SELECT * FROM timetable WHERE id = ?;", [id]);
    if (!timetable) {
        return res.status(404).json({ message: 'Timetable entry not found' });
    }
    await dbRun("DELETE FROM timetable WHERE id = ?;", [id]);
    res.status(200).json({ message: "Timetable entry deleted successfully" });
});

async function startServer() {
    await initializeDatabase();
    app.listen(3000, () => {
        console.log("Server runs on port 3000");
    });
};

startServer();