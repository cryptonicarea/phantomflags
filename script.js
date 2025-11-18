const participants = [
    { name: "Aarav", id: "CRT-001", file: "aarav.pdf" },
    { name: "Riya", id: "CRT-002", file: "riya.pdf" },
    { name: "Kabir", id: "CRT-003", file: "kabir.pdf" },
    { name: "Manya", id: "CRT-004", file: "manya.pdf" }
];

const listDiv = document.getElementById("certList");

participants.forEach(p => {
    listDiv.innerHTML += `
        <div class="card">
            <h3>${p.name}</h3>
            <p>ID: <b>${p.id}</b></p>
            <a href="certificates/${p.file}" download>
                <button>Download Certificate</button>
            </a>
        </div>
    `;
});
