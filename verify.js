const validCerts = [
    "CRT-001",
    "CRT-002",
    "CRT-003",
    "CRT-004"
];

function checkCert() {
    const id = document.getElementById("certInput").value.trim().toUpperCase();
    const result = document.getElementById("verifyResult");

    if (validCerts.includes(id)) {
        result.innerHTML = "✅ Valid Certificate ID";
        result.style.color = "lightgreen";
    } else {
        result.innerHTML = "❌ Invalid Certificate ID";
        result.style.color = "red";
    }
}
