
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const taskForm = document.getElementById("taskForm");

let tasks = [];

try {
    const savedTasks = JSON.parse(localStorage.getItem("studyTasks") || "[]");

    if (Array.isArray(savedTasks)) {
        tasks = savedTasks.filter(task =>
            task && typeof task.text === "string"
        ).map((task, index) => ({
            id: task.id ?? Date.now() + index,
            text: task.text,
            completed: task.completed === true
        }));
    }
} catch (error) {
    tasks = [];
}

function saveTasks() {
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
}

function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function (task) {
        const item = document.createElement("li");

        if (task.completed) {
            item.classList.add("completed");
        }

        const dot = document.createElement("span");
        dot.className = "task-dot";

        const info = document.createElement("div");
        info.className = "task-info";

        const name = document.createElement("span");
        name.className = "task-name";
        name.textContent = task.text;

        if (task.completed) {
            name.style.textDecoration = "line-through";
        }

        const status = document.createElement("span");
        status.className = "task-status";
        status.textContent = task.completed ? "Terminée" : "En attente";

        info.append(name, status);

        const pendingButton = document.createElement("button");
        pendingButton.className = "pending-button";
        pendingButton.textContent = "Ⅱ En attente";

        pendingButton.addEventListener("click", function () {
            task.completed = false;
            saveTasks();
            displayTasks();
        });

        const completeButton = document.createElement("button");
        completeButton.className = "complete-button";
        completeButton.textContent = "✓ Terminer";

        completeButton.addEventListener("click", function () {
            task.completed = true;
            saveTasks();
            displayTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Supprimer";

        deleteButton.addEventListener("click", function () {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            displayTasks();
        });

        item.append(dot, info, pendingButton, completeButton, deleteButton);
        taskList.appendChild(item);
    });

    const remaining = tasks.filter(task => !task.completed).length;
    taskCount.textContent =
        `${tasks.length} tâche(s) · ${remaining} en attente`;
}

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (!text) {
        alert("Entre une tâche avant de l'ajouter !");
        return;
    }

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    saveTasks();
    displayTasks();
    taskInput.value = "";
    taskInput.focus();
});

displayTasks();
