const calender = document.querySelector(".calender");
const scheduleList = document.querySelector(".schedule-list");
const monthTitle = document.querySelector(".month-title");
const input = document.querySelector(".memo-input");
const addButton = document.querySelector(".add-btn");
const dateInput = document.querySelector(".date-input");
const timeInput = document.querySelector(".time-input");
const categorySelect = document.querySelector(".category-select");
const titleInput = document.querySelector(".title-input");
const memoInput = document.querySelector(".memo-input");
const taskListContainer = document.querySelector(".task-list-container");
const taskAddBtn = document.querySelector(".task-add-btn");
const taskInput = document.querySelector(".task-input");
const taskCategory = document.querySelector(".task-category");
let selectedDate = "";
let categoryColor = "";

const today = new Date();

let year = today.getFullYear();
let month = today.getMonth();

let schedules = [];
let tasks = [];


function createCalendar() {
    // 今日の日付取得

    calender.innerHTML = "";

    const date = new Date(year, month +1);

    const firstDay = new Date(year, month , 1).getDay();
    console.log(firstDay);

    const lastDate = new Date(year, month +1, 0).getDate();
    console.log(lastDate);

    // 月表示
    monthTitle.textContent = `${year}年${month +1}月`;

    // カレンダー生成

    for (let i = 0; i < firstDay; i++){
        calender.innerHTML += `
            <div class="empty"></div>
        `;
    };

    //今日判定
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();


    for (let i = 1; i <= lastDate; i++) {

        let todayClass = "";

        if (
            year === todayYear &&
            month === todayMonth &&
            i === todayDate
        ) {
            todayClass = "today";
        }

        calender.innerHTML += `
            <div class="day ${todayClass}" date-day="${i}">
                <span class="day-number">${i}</span>
            </div>
        `;
        
    };

    const totalCells = firstDay + lastDate;

    const remainingCalls = 7 - (totalCells % 7);

    if (remainingCalls < 7) {

        for (let i = 0; i < remainingCalls; i++) {

            calender.innerHTML += `
            <div class="empty"></div>
            `;
            
        }

        
    }

};

addButton.addEventListener("click", () => {
    const date = dateInput.value;
    const time = timeInput.value;
    const title = titleInput.value;
    const memo = memoInput.value;
    const dayNumber = Number(date.split("-")[2]);
    const targetDay = document.querySelector(`[date-day="${dayNumber}"]`);
    const category = categorySelect.value;
    let categoryColor = "";

    

    if (category === "仕事") {
        categoryColor = "red";
    }

    if (category === "勉強") {
        categoryColor = "blue";
    }
    if (category === "運動") {
        categoryColor = "green";
    }
    if (category === "プライベート") {
        categoryColor = "purple";
    }
    if (category === "その他") {
        categoryColor = "gray";
    }

    schedules.push({
        date,
        time,
        title,
        memo,
        category,
        categoryColor
    });

    

    targetDay.innerHTML += `
        <p class="schedule-item" style="background-color:${categoryColor}">${title}</p>
    `;

    console.log(category);
    console.log(categoryColor);
    console.log(schedules);
});


const prevBtn = document.querySelector(".prevBtn");
const nextBtn = document.querySelector(".nextBtn");

prevBtn.addEventListener("click", () => {
    month--;

    if (month < 0) {
        month = 11;
        year--;
    }

    createCalendar();
});

nextBtn.addEventListener("click", () => {
    month++;

    if (month > 11) {
        month = 0;
        year++;
    }

    createCalendar();
});

createCalendar();

const homeMenu = document.querySelector(".home-menu");
const scheduleMenu = document.querySelector(".schedule-menu");
const listMenu = document.querySelector(".list-menu");
const taskMenu = document.querySelector(".task-menu");

const homePage = document.querySelector(".home-page");
const schedulePage = document.querySelector(".schedule-page");
const listPage = document.querySelector(".list-page");
const taskPage = document.querySelector(".task-page");
console.log(listPage);

function hidePages() {
    homePage.classList.add("hidden");
    schedulePage.classList.add("hidden");
    listPage.classList.add("hidden");
    taskPage.classList.add("hidden");
}

homeMenu.addEventListener("click", () => {
    hidePages();
    homePage.classList.remove("hidden");
});

scheduleMenu.addEventListener("click", () => {
    hidePages();
    schedulePage.classList.remove("hidden");
});

listMenu.addEventListener("click", () => {
    hidePages();
    listPage.classList.remove("hidden");
    renderList();
});

taskMenu.addEventListener("click", () => {
    hidePages();
    taskPage.classList.remove("hidden");
});


const scheduleListContainer = document.querySelector(".schedule-list-container");

function renderList() {
    scheduleListContainer.innerHTML = "";

    // 日付・時間の並び替え
    schedules.sort((a, b) => {
        const dateTimeA = new Date(`${a.date} ${a.time}`)
        const dateTimeB = new Date(`${b.date} ${b.time}`)

        return dateTimeA - dateTimeB;
    });

    let currentDate = "";

    schedules.forEach(schedule => {

        if (currentDate !== schedule.date) {
            const dateTitle = document.createElement("h2");

            dateTitle.textContent = schedule.date;

            scheduleListContainer.appendChild(dateTitle);

            currentDate = schedule.date;
        }

        const item = document.createElement("div")

        item.classList.add("schedule-card");

        item.innerHTML = `
        <div class="schedule-header">
            <span>${schedule.time}</span>
            <span 
            class="category-tag" style="background-color:${schedule.categoryColor}">
                ${schedule.category}</span>
        </div>

        <h3>${schedule.title}</h3>

        <p>${schedule.memo}</p>

        <button class="delete-btn">🗑️</button>
        `;

        const deleteBtn = item.querySelector(".delete-btn");

        deleteBtn.addEventListener("click", () => {
            schedules = schedules.filter(s => s !== schedule);

            renderList();
            createCalendar(year, month);
        })

        scheduleListContainer.appendChild(item);
    });
}

taskAddBtn.addEventListener("click", () => {

    const category = taskCategory.value;

    if (category === "仕事") {
        categoryColor = "red";
    }

    if (category === "勉強") {
        categoryColor = "blue";
    }
    if (category === "運動") {
        categoryColor = "green";
    }
    if (category === "プライベート") {
        categoryColor = "purple";
    }
    if (category === "その他") {
        categoryColor = "gray";
    }

    const task = {
        text: taskInput.value,
        category,
        categoryColor,
        completed: false
    };

    tasks.push(task);
    console.log(task);
    renderTask();
})

function renderTask() {
    
    taskListContainer.innerHTML = "";

    tasks.sort((a, b) => a.completed - b.completed);

    tasks.forEach(task => {
        const item = document.createElement("div");

        item.classList.add("task-card")

        item.innerHTML = `
            <div class="task-header">
                <input type="checkbox" class="task-check">
                <h3 class="${task.completed ? "completed" : ""}">${task.text}</h3>
                <span class="category-tag" style="background-color:${task.categoryColor}">
                ${task.category}</span>
            </div>
            <button class="delete-task-btn">🗑️</button>
        `;

        const checkbox = item.querySelector(".task-check");

        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;

            renderTask();
        })

        const deleteBtn = item.querySelector(".delete-task-btn");

        deleteBtn.addEventListener("click", () => {
            tasks = tasks.filter(t => t !== task);

            renderTask();
        })

        taskListContainer.appendChild(item);
    });
}
