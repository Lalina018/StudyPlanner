
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];

function saveTasks() {
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
}

function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function (task) {
        const taskItem = document.createElement("li");

        if (task.completed) {
            taskItem.classList.add("completed");
        }

        const dot = document.createElement("span");
        dot.className = "task-dot";

        const taskInfo = document.createElement("div");
        taskInfo.className = "task-info";

        const taskName = document.createElement("span");
        taskName.className = "task-name";
        taskName.textContent = task.text;

        const taskStatus = document.createElement("span");
        taskStatus.className = "task-status";
        taskStatus.textContent = task.completed
            ? "Terminée"
            : "En attente";

        if (task.completed) {
            taskName.style.textDecoration = "line-through";
        }

        taskInfo.appendChild(taskName);
        taskInfo.appendChild(taskStatus);

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
        deleteButton.textContent = "▤ Supprimer";

        deleteButton.addEventListener("click", function () {
            tasks = tasks.filter(function (item) {
                return item.id !== task.id;
            });

            saveTasks();
            displayTasks();
        });

        taskItem.appendChild(dot);
        taskItem.appendChild(taskInfo);
        taskItem.appendChild(pendingButton);
        taskItem.appendChild(completeButton);
        taskItem.appendChild(deleteButton);

        taskList.appendChild(taskItem);
    });
}

addTaskButton.addEventListener("click", function () {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Entre une tâche avant de l'ajouter !");
        return;
    }

    tasks.push({
        id: Date.now(),
        text: taskText,
        completed: false
    });

    saveTasks();
    displayTasks();
    taskInput.value = "";
});

displayTasks();
