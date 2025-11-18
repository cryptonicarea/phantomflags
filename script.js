// script.js — certificate generator and UI logic
// Customize event details below:
const EVENT_TITLE = "Phantom Flags CTF";
const ORG = "Cryptonic Area";
const ISSUE_DATE = new Date().toLocaleDateString();

// Default participants (edit here or upload a file)
let participants = [
  "Aman Sharma",
  "Riya Verma",
  "Sahil Khan",
  "Priya Gupta",
  "Arjun Patel",
  "Neha Singh",
  "Vikram Joshi",
  "Sonal Rao",
  "Karan Mehta",
  "Maya Das"
];

// DOM refs
const listEl = document.getElementById('list');
const countEl = document.getElementById('count');
const miniName = document.getElementById('miniName');
const miniCert = document.getElementById('miniCert');
const searchInput = document.getElementById('search');
const downloadAllBtn = document.getElementById('downloadAll');
const fileInput = document.getElementById('fileInput');
const refreshBtn = document.getElementById('refresh');

function renderList(filter = "") {
  listEl.innerHTML = "";
  const names = participants.filter(n => n.toLowerCase().includes(filter.toLowerCase()));
  countEl.textContent = names.length;
  if(names.length === 0){
    listEl.innerHTML = '<div class="row"><div class="name muted">No participants</div></div>';
    return;
  }
  for(const name of names){
    const row = document.createElement('div'); row.className = "row";
    const left = document.createElement('div'); left.className = "name"; left.textContent = name;
    left.addEventListener('click', ()=> {
      miniName.textContent = name;
      // preview
    });
    const controls = document.createElement('div'); controls.className = "controls";
    const btn = document.createElement('button'); btn.className = "smallbtn primary"; btn.textContent = "Download Certificate";
    btn.addEventListener('click', ()=> generateCertificate(name));
    const copyBtn = document.createElement('button'); copyBtn.className = "smallbtn"; copyBtn.textContent = "Copy Name";
    copyBtn.addEventListener('click', ()=> { navigator.clipboard && navigator.clipboard.writeText(name); alert('Copied: ' + name); });
    controls.appendChild(copyBtn); controls.appendChild(btn);
    row.appendChild(left); row.appendChild(controls);
    listEl.appendChild(row);
  }
}

// Wire search and refresh
searchInput.addEventListener('input', ()=> renderList(searchInput.value));
refreshBtn && refreshBtn.addEventListener('click', ()=> renderList());

// File upload: accepts .txt or .csv (one name per line)
fileInput && fileInput.addEventListener('change', async (e)=>{
  const f = e.target.files[0];
  if(!f) return;
  const txt = await f.text();
  const lines = txt.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
  if(lines.length>0){
    participants = lines;
    renderList();
    alert('Participant list loaded: ' + participants.length + ' names');
  } else {
    alert('No valid names found in file.');
  }
  e.target.value = '';
});

// Generate certificate for a single name
async function generateCertificate(name, opts={}) {
  // set up template contents
  document.getElementById('certName').textContent = name;
  document.getElementById('certDate').textContent = ISSUE_DATE;
  document.querySelector('#certPaper .certMeta')?.remove?.(); // not necessary
  const certDiv = document.getElementById('certPaper');

  // ensure fonts/styles will apply by using html2canvas with scale
  try {
    const canvas = await html2canvas(certDiv, { scale: 2, useCORS: true, backgroundColor: null });
    const imgData = canvas.toDataURL('image/png', 1.0);

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgW = canvas.width;
    const imgH = canvas.height;
    const ratio = Math.min(pageWidth / imgW, pageHeight / imgH);
    const w = imgW * ratio;
    const h = imgH * ratio;
    const x = (pageWidth - w) / 2;
    const y = (pageHeight - h) / 2;

    pdf.addImage(imgData, 'PNG', x, y, w, h);

    const safeName = name.replace(/\s+/g,'_').replace(/[^\w\-]/g,'');
    const filename = `${safeName}_${EVENT_TITLE.replace(/\s+/g,'_')}.pdf`;
    pdf.save(filename);
    if(!opts.silent) {
      // small UI feedback
      console.log('Saved', filename);
    }
    return true;
  } catch (err) {
    console.error('Certificate error', err);
    alert('Error generating certificate. Try desktop browser.');
    return false;
  }
}

// Download all sequentially
downloadAllBtn.addEventListener('click', async ()=>{
  downloadAllBtn.disabled = true;
  for(let i=0;i<participants.length;i++){
    const name = participants[i];
    await generateCertificate(name,{silent:true});
    // small delay to avoid browser overload
    await new Promise(r=>setTimeout(r,650));
  }
  downloadAllBtn.disabled = false;
  alert('All certificates generated (check Downloads).');
});

// initial render
renderList();

// expose for console tweaks
window.__cert = { generateCertificate, participants, renderList };
