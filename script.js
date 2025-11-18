// ------------------------------
// ADD PARTICIPANTS BELOW
// NAME + CERTIFICATE FILE NAME
// ------------------------------
const participants = [
    { name: "Aryan Singh", file: "aryan_singh.pdf" },
    { name: "Riya Sharma", file: "riya_sharma.pdf" },
    { name: "Rohan Verma", file: "rohan_verma.pdf" },
    { name: "Aditya Raj", file: "aditya_raj.pdf" },
    { name: "Vaibhav Khanna", file: "vaibhav_khanna.pdf" }
];

// ------------------------------
const listBox = document.getElementById("participantsList");

function renderList(filterText = "") {
    listBox.innerHTML = "";

    participants
        .filter(p => p.name.toLowerCase().includes(filterText.toLowerCase()))
        .forEach(p => {
            const row = document.createElement("div");
            row.className = "participant";

            row.innerHTML = `
                <span>${p.name}</span>
                <button class="download-btn" onclick="downloadCert('${p.file}')">Download</button>
            `;

            listBox.appendChild(row);
        });
}

document.getElementById("searchBar").addEventListener("input", (e) => {
    renderList(e.target.value);
});

function downloadCert(fileName) {
    const link = document.createElement("a");
    link.href = "certificates/" + fileName;
    link.download = fileName;
    link.click();
}

renderList();
