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
// スマホ版
const modal = document.querySelector(".modal");
const closeModalBtn = document.querySelector(".close-modal-btn");
const editDate = document.querySelector(".edit-date");
const editTime = document.querySelector(".edit-time");
const editCategory = document.querySelector(".edit-category");
const editTitle = document.querySelector(".edit-title");
const editMemo = document.querySelector(".edit-memo");
const saveEditBtn = document.querySelector(".save-edit-btn");
const floatingAddBtn = document.querySelector(".floating-add-btn")
const modalTitle = document.querySelector(".modal-title");
let editingSchedule = null;

closeModalBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
});

saveEditBtn.addEventListener("click", () => {

    let categoryColor = "";

    if (editCategory.value === "仕事") {
        categoryColor = "red";
    }

    if (editCategory.value === "勉強") {
        categoryColor = "blue";
    }

    if (editCategory.value === "運動") {
        categoryColor = "green";
    }

    if (editCategory.value === "プライベート") {
        categoryColor = "purple";
    }

    if (editCategory.value === "その他") {
        categoryColor = "gray";
    }

    if (editingSchedule) {

        // 編集
        editingSchedule.date = editDate.value;
        editingSchedule.time = editTime.value;
        editingSchedule.category = editCategory.value;
        editingSchedule.title = editTitle.value;
        editingSchedule.memo = editMemo.value;
        editingSchedule.categoryColor = categoryColor;

    } else {

        // 新規追加
        schedules.push({
            date: editDate.value,
            time: editTime.value,
            category: editCategory.value,
            title: editTitle.value,
            memo: editMemo.value,
            categoryColor
        });

    }

    renderList();
    createCalendar();
    renderCalendarSchedules();
    renderHome();

    modal.classList.add("hidden");
});

modal.addEventListener("click", (e) => {

    if (e.target === modal) {
        modal.classList.add("hidden");
    }

});

floatingAddBtn.addEventListener("click", () => {
    editingSchedule = null;

    modalTitle.textContent = "予定追加";

    editDate.value = "";
    editTime.value = "";
    editCategory.value = "仕事";
    editTitle.value = "";
    editMemo.value = "";

    modal.classList.remove("hidden");

})

// 

let selectedDate = "";
let categoryColor = "";

const today = new Date();

let year = today.getFullYear();
let month = today.getMonth();

let schedules = [];
let tasks = [];


async function loadSchedules() {
    try {
        const response = await fetch("http://localhost:3000/schedules");

        const data = await response.json();

        schedules = data.map(schedule => {

    let categoryColor = "gray";

    if (schedule.category === "仕事") {
        categoryColor = "red";
    }

    if (schedule.category === "勉強") {
        categoryColor = "blue";
    }

    if (schedule.category === "運動") {
        categoryColor = "green";
    }

    if (schedule.category === "プライベート") {
        categoryColor = "purple";
    }

    const dateObj = new Date(schedule.date);

    return {
        ...schedule,
        date: `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`,
        categoryColor
    };
});

        createCalendar();
        renderCalendarSchedules();
        renderHome();

    } catch (error) {
        console.error("予定取得失敗", error);
    }
}


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

        document.querySelectorAll(".day").forEach(day => {

        day.addEventListener("click", () => {

            const dayNumber = day.getAttribute("date-day");

            const selectedDate =
                `${year}-${String(month + 1).padStart(2,"0")}-${String(dayNumber).padStart(2,"0")}`;

            renderSelectedDateSchedule(selectedDate);
            console.log(selectedDate);

        });

    });

};


const selectedDateTitle = document.querySelector(".selected-date-title");

function renderSelectedDateSchedule(date) {

    scheduleList.innerHTML = "";

    selectedDateTitle.textContent = `${date} の予定`;

    const filteredSchedules =
        schedules.filter(schedule => schedule.date === date);

    filteredSchedules.forEach(schedule => {

        const item = document.createElement("div");

        item.classList.add("schedule-card");

        item.innerHTML = `
            <h3>${schedule.title}</h3>
            <p>${schedule.time}</p>
        `;

        scheduleList.appendChild(item);

    });

}

addButton.addEventListener("click", async () => {


    const date = dateInput.value;
    const time = timeInput.value;
    const title = titleInput.value;
    const memo = memoInput.value;
    const category = categorySelect.value;
    let categoryColor = "";

        console.log({
        date,
        time,
        title,
        memo,
        category
    });

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

    // schedules.push({
    //     date,
    //     time,
    //     title,
    //     memo,
    //     category,
    //     categoryColor
    // });

    // createCalendar();
    // renderCalendarSchedules();

    // renderHome();

    try {
    const response = await fetch("http://localhost:3000/schedules", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            date,
            time,
            category,
            title,
            memo
        })
    });

    if (!response.ok) {
        throw new Error("保存失敗");
    }

    await loadSchedules();

    } catch (error) {
        console.error(error);
    }

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
    renderCalendarSchedules();
});

nextBtn.addEventListener("click", () => {
    month++;

    if (month > 11) {
        month = 0;
        year++;
    }

    createCalendar();
    renderCalendarSchedules();
});

function renderCalendarSchedules() {

    schedules.forEach(schedule => {

        const scheduleDate = new Date(schedule.date);

        console.log(schedule.date);
        console.log(scheduleDate);

        if (
            scheduleDate.getFullYear() === year &&
            scheduleDate.getMonth() === month
        ) {

            const day = scheduleDate.getDate();

            const targetDay =
                document.querySelector(`[date-day="${day}"]`);

            if (targetDay) {
                targetDay.innerHTML += `
                    <p class="schedule-item"
                    style="background-color:${schedule.categoryColor}">
                        ${schedule.title}
                    </p>
                `;
            }
        }
    });

}

loadSchedules();

const homeMenu = document.querySelector(".home-menu");
const scheduleMenu = document.querySelector(".schedule-menu");
const listMenu = document.querySelector(".list-menu");
const taskMenu = document.querySelector(".task-menu");

const homePage = document.querySelector(".home-page");
const schedulePage = document.querySelector(".schedule-page");
const listPage = document.querySelector(".list-page");
const taskPage = document.querySelector(".task-page");

// スマホ用

const menuBtn = document.querySelector(".menu-btn");
const sidebar = document.querySelector(".sideber");

menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
});

homeMenu.addEventListener("click", () => {

    hidePages();
    homePage.classList.remove("hidden");

    sidebar.classList.remove("active");
});

scheduleMenu.addEventListener("click", () => {

    hidePages();
    schedulePage.classList.remove("hidden");

    sidebar.classList.remove("active");
});

listMenu.addEventListener("click", () => {

    hidePages();
    listPage.classList.remove("hidden");

    sidebar.classList.remove("active");
});

taskMenu.addEventListener("click", () => {

    hidePages();
    taskPage.classList.remove("hidden");

    sidebar.classList.remove("active");
});

// 


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


        <button class="edit-btn">✏️</button>
        <button class="delete-btn">🗑️</button>
        `;

        const editBtn = item.querySelector(".edit-btn");
        const deleteBtn = item.querySelector(".delete-btn");

        editBtn.addEventListener("click", () => {
            editingSchedule = schedule;

            modalTitle.textContent = "予定編集";

            editDate.value = schedule.date;
            editTime.value = schedule.time;
            editCategory.value = schedule.category;
            editTitle.value = schedule.title;
            editMemo.value = schedule.memo;

            modal.classList.remove("hidden");
        });

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
    renderHome();
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
            renderHome();
        })

        const deleteBtn = item.querySelector(".delete-task-btn");

        deleteBtn.addEventListener("click", () => {
            tasks = tasks.filter(t => t !== task);

            renderTask();
            renderHome();
        })

        taskListContainer.appendChild(item);
    });
}


// ホーム
const todayScheduleList = document.querySelector(".today-schedule-list");
const todayTaskList = document.querySelector(".today-task-list");


function renderHome() {
    renderHomeSchedule();
    renderHomeTask();
    renderHomeStats();
    
}

function renderHomeSchedule() {
    todayScheduleList.innerHTML = "";

     const now = new Date();
    const today =`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const todaySchedules = schedules.filter(schedule => {
        return schedule.date === today;
    })

    todaySchedules.forEach(schedule => {
        const item = document.createElement("div");

        item.classList.add("schedule-card");

        item.innerHTML = `
            <h3>${schedule.title}</h3>

            <p>${schedule.time}</p>

            <span class="category-tag" style="background-color:${schedule.categoryColor}">
                ${schedule.category}</span>
        `;

        todayScheduleList.appendChild(item);
    });
}

function renderHomeTask() {
    todayTaskList.innerHTML = "";

    const unfinishedTasks = tasks.filter(task => {
    return !task.completed;
    })

    unfinishedTasks.forEach(task => {
        const item = document.createElement("div");

        item.classList.add("task-card");

        item.innerHTML = `
            <h3>${task.text}</h3>
            <span class="category-tag" style="background-color:${task.categoryColor}">
                ${task.category}</span>
        `;
        
        todayTaskList.appendChild(item);
    });
    
}

function renderHomeStats() {
    const totalTaskCount = document.querySelector(".total-task-count");
    totalTaskCount.textContent = tasks.length;

    const unfinishedTasksCount = document.querySelector(".unfinished-task-count");
    const unfinishedCount = tasks.filter(task => !task.completed).length;
    unfinishedTasksCount.textContent = unfinishedCount;

    const completedTaskCount = document.querySelector(".completed-task-count");
    const completedCount = tasks.filter(task => task.completed).length;
    completedTaskCount.textContent = completedCount;
    
    const now = new Date();
    const todayScheduleCount = document.querySelector(".today-schedule-count");
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const todayCount = schedules.filter(schedule => schedule.date === today).length;
    todayScheduleCount.textContent = todayCount;
}




