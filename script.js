async function loadStudents(url = "/students")
{
    const response = await fetch(url);
    const students = await response.json();

    const container = document.getElementById("students");
    container.innerHTML = "";

    students.forEach(student =>
    {
        const div = document.createElement("div");
        div.className = "student";
        div.textContent = student.id + " - " + student.name + " - " + student.email + " - " + student.program;
        container.appendChild(div);
    });

    document.getElementById("message").textContent = "Students loaded.";
}

async function addStudent()
{
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const program = document.getElementById("program").value;

    const response = await fetch("/students",
    {
        method: "POST",
        headers:
        {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, program })
    });

    const data = await response.json();
    document.getElementById("message").textContent = data.message || "Student added.";

    if (response.ok)
    {
        loadStudents();
    }
}

function filterStudents()
{
    const program = document.getElementById("filter").value.trim();

    if (program)
    {
        loadStudents("/students?program=" + encodeURIComponent(program));
    }
    else
    {
        loadStudents();
    }
}

loadStudents();
