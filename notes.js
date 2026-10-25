
const notesList = document.getElementById("notesList");
const newNoteButton = document.getElementById("newNoteButton");
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const numberedButton = document.getElementById("numberedButton");
const checklistButton = document.getElementById("checklistButton");
const checklistEditor = document.getElementById("checklistEditor");
const checklistForm = document.getElementById("checklistForm");
const checklistInput = document.getElementById("checklistInput");
const checklistItems = document.getElementById("checklistItems");
const deleteNoteButton = document.getElementById("deleteNoteButton");
const saveStatus = document.getElementById("saveStatus");

const NOTES_KEY = "studyPlannerNotes";

function loadNotes() {
    try {
        const data = JSON.parse(localStorage.getItem(NOTES_KEY) || "[]");
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

let notes = loadNotes().filter(note =>
    note && typeof note.id === "string"
).map(note => ({
    id: note.id,
    title: typeof note.title === "string" ? note.title : "",
    content: typeof note.content === "string" ? note.content : "",
    checklist: Array.isArray(note.checklist)
        ? note.checklist.filter(item => item && typeof item.text === "string")
            .map(item => ({
                text: item.text,
                checked: item.checked === true
            }))
        : [],
    updatedAt: note.updatedAt || Date.now()
}));

let selectedNoteId = null;

function saveNotes() {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    saveStatus.textContent = "Enregistré automatiquement ✓";
}

function currentNote() {
    return notes.find(note => note.id === selectedNoteId);
}

function createNote() {
    const note = {
        id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
        title: "",
        content: "",
        checklist: [],
        updatedAt: Date.now()
    };

    notes.unshift(note);
    selectedNoteId = note.id;
    saveNotes();
    renderAll();
    noteTitle.focus();
}

function renderNotesList() {
    notesList.innerHTML = "";

    if (notes.length === 0) {
        const empty = document.createElement("p");
        empty.className = "muted";
        empty.textContent = "Aucune note pour le moment.";
        notesList.appendChild(empty);
        return;
    }

    notes.forEach(note => {
        const button = document.createElement("button");
        button.className = "note-item";

        if (note.id === selectedNoteId) {
            button.classList.add("active");
        }

        button.textContent = note.title.trim() || "Nouvelle note";

        button.addEventListener("click", function () {
            selectedNoteId = note.id;
            renderAll();
        });

        notesList.appendChild(button);
    });
}

function renderChecklist() {
    const note = currentNote();
    checklistItems.innerHTML = "";

    if (!note) return;

    note.checklist.forEach(function (entry, index) {
        const item = document.createElement("li");

        if (entry.checked) {
            item.classList.add("checked");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = entry.checked;
        checkbox.setAttribute("aria-label", "Marquer comme terminé");

        checkbox.addEventListener("change", function () {
            entry.checked = checkbox.checked;
            saveNotes();
            renderChecklist();
        });

        const text = document.createElement("span");
        text.textContent = entry.text;

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "×";
        removeButton.setAttribute("aria-label", "Supprimer cet élément");

        removeButton.addEventListener("click", function () {
            note.checklist.splice(index, 1);
            saveNotes();
            renderChecklist();
        });

        item.append(checkbox, text, removeButton);
        checklistItems.appendChild(item);
    });
}

function renderAll() {
    const note = currentNote();
    renderNotesList();

    const hasNote = Boolean(note);

    noteTitle.disabled = !hasNote;
    noteContent.disabled = !hasNote;
    numberedButton.disabled = !hasNote;
    checklistButton.disabled = !hasNote;
    deleteNoteButton.disabled = !hasNote;

    noteTitle.value = note ? note.title : "";
    noteContent.value = note ? note.content : "";

    checklistEditor.hidden = !hasNote;
    checklistInput.disabled = !hasNote;

    if (note) {
        renderChecklist();
        saveStatus.textContent = "Tes modifications sont sauvegardées automatiquement.";
    } else {
        checklistItems.innerHTML = "";
        saveStatus.textContent = "Crée une note pour commencer.";
    }
}

function updateCurrentNote() {
    const note = currentNote();

    if (!note) return;

    note.title = noteTitle.value;
    note.content = noteContent.value;
    note.updatedAt = Date.now();

    saveNotes();
    renderNotesList();
}

newNoteButton.addEventListener("click", createNote);

noteTitle.addEventListener("input", updateCurrentNote);
noteContent.addEventListener("input", updateCurrentNote);

numberedButton.addEventListener("click", function () {
    const note = currentNote();
    if (!note) return;

    const start = noteContent.selectionStart;
    const end = noteContent.selectionEnd;
    const before = noteContent.value.slice(0, start);
    const selected = noteContent.value.slice(start, end);
    const after = noteContent.value.slice(end);

    const lines = (selected || "").split("\n");
    const numbered = lines.map((line, index) =>
        `${index + 1}. ${line}`
    ).join("\n");

    const insertion = numbered || "1. ";

    noteContent.value = before + insertion + after;
    noteContent.focus();

    const cursor = before.length + insertion.length;
    noteContent.setSelectionRange(cursor, cursor);

    updateCurrentNote();
});

checklistButton.addEventListener("click", function () {
    const note = currentNote();
    if (!note) return;

    checklistEditor.hidden = false;
    checklistInput.focus();
});

checklistForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const note = currentNote();
    const text = checklistInput.value.trim();

    if (!note || !text) return;

    note.checklist.push({
        text: text,
        checked: false
    });

    checklistInput.value = "";
    saveNotes();
    renderChecklist();
    checklistInput.focus();
});

deleteNoteButton.addEventListener("click", function () {
    const note = currentNote();
    if (!note) return;

    const confirmed = confirm("Supprimer cette note définitivement ?");

    if (!confirmed) return;

    notes = notes.filter(item => item.id !== selectedNoteId);
    selectedNoteId = notes.length ? notes[0].id : null;

    saveNotes();
    renderAll();
});

if (notes.length > 0) {
    selectedNoteId = notes[0].id;
}

renderAll();
