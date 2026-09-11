let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [];
let currentFilter = "all";

const taskInput = document.getElementById("taskInput");

function saveTasks() {
    localStorage.setItem("taskflowTasks", JSON.stringify(tasks));
}

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    taskInput.value = "";

    saveTasks();
    displayTasks();
}

taskInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    displayTasks();
}

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    displayTasks();
}

function setFilter(filter, button) {

    currentFilter = filter;

    document.querySelectorAll(".filter").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    displayTasks();
}

function displayTasks() {

    const taskList = document.getElementById("taskList");
    const emptyState = document.getElementById("emptyState");
    const search = document.getElementById("searchInput").value.toLowerCase();

    let filteredTasks = tasks.filter(task => {

        const matchesSearch =
            task.text.toLowerCase().includes(search);

        if (currentFilter === "active") {
            return !task.completed && matchesSearch;
        }

        if (currentFilter === "completed") {
            return task.completed && matchesSearch;
        }

        return matchesSearch;
    });

    taskList.innerHTML = "";

    if (filteredTasks.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }

    filteredTasks.forEach(task => {

        const taskElement = document.createElement("div");

        taskElement.className = "task";

        taskElement.innerHTML = `
            <div class="task-left">

                <input
                    type="checkbox"
                    class="check"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id})"
                >

                <span class="task-name ${
                    task.completed ? "completed" : ""
                }">
                    ${escapeHTML(task.text)}
                </span>

            </div>

            <button
                class="delete"
                onclick="deleteTask(${task.id})">
                🗑 Delete
            </button>
        `;

        taskList.appendChild(taskElement);
    });

    updateStats();
}

function updateStats() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    const pending = total - completed;

    const percentage =
        total === 0 ? 0 : Math.round((completed / total) * 100);

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;

    document.getElementById("progressBar").style.width =
        percentage + "%";

    document.getElementById("progressText").textContent =
        percentage + "% Complete";
}

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}

function showDate() {

    const today = new Date();

    const options = {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
    };

    document.getElementById("date").textContent =
        today.toLocaleDateString("en-IN", options);
}

showDate();
displayTasks();