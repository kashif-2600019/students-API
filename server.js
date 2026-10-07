const express = require("express");
const fs = require("fs");

const app = express();
const port = 3000;
const file = "students.json";

app.use(express.json());

function loadStudents()
{
    if (!fs.existsSync(file))
    {
        return [];
    }

    return JSON.parse(fs.readFileSync(file, "utf8"));
}

function saveStudents(students)
{
    fs.writeFileSync(file, JSON.stringify(students, null, 2));
}

app.get("/", (req, res) =>
{
    res.sendFile(__dirname + "/index.html");
});

app.get("/students", (req, res) =>
{
    let students = loadStudents();

    if (req.query.program)
    {
        students = students.filter(student => student.program === req.query.program);
    }

    res.status(200).json(students);
});

app.get("/students/:id", (req, res) =>
{
    const students = loadStudents();
    const id = Number(req.params.id);
    const student = students.find(x => x.id === id);

    if (!student)
    {
        return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
});

app.post("/students", (req, res) =>
{
    const { name, email, program } = req.body;

    if (!name || !email || !email.includes("@") || !program)
    {
        return res.status(400).json({ message: "name, valid email and program are required" });
    }

    const students = loadStudents();
    const id = students.length > 0 ? Math.max(...students.map(x => x.id)) + 1 : 1;

    const student = { id, name, email, program };
    students.push(student);
    saveStudents(students);

    res.status(201).json(student);
});

app.put("/students/:id", (req, res) =>
{
    const students = loadStudents();
    const id = Number(req.params.id);
    const student = students.find(x => x.id === id);

    if (!student)
    {
        return res.status(404).json({ message: "Student not found" });
    }

    const { name, email, program } = req.body;

    if (email !== undefined && !email.includes("@"))
    {
        return res.status(400).json({ message: "Invalid email" });
    }

    if (name !== undefined) student.name = name;
    if (email !== undefined) student.email = email;
    if (program !== undefined) student.program = program;

    saveStudents(students);
    res.status(200).json(student);
});

app.delete("/students/:id", (req, res) =>
{
    const students = loadStudents();
    const id = Number(req.params.id);
    const index = students.findIndex(x => x.id === id);

    if (index === -1)
    {
        return res.status(404).json({ message: "Student not found" });
    }

    students.splice(index, 1);
    saveStudents(students);

    res.status(200).json({ message: "Student deleted" });
});

app.use(express.static(__dirname));

app.listen(port, () =>
{
    console.log("Server running at http://localhost:" + port);
});
