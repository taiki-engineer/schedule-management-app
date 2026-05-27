const calender = document.querySelector(".calender");
const scheduleList = document.querySelector(".schedule-list");
const monthTitle = document.querySelector(".month-title");
const input = document.querySelector(".task-input");
const addButton = document.querySelector(".add-btn");
const scheduleInput = document.querySelector(".task-input");
const dateInput = document.querySelector(".date-input");
const timeInput = document.querySelector(".time-input");
const categorySelect = document.querySelector(".category-select");
let selectedDate = "";
let categoryColor = "";


function createCalender() {
    // 今日の日付取得
    const today = new Date();

    const year = today.getFullYear();

    const month = today.getMonth() +1;

    const firstDay = new Date(year, month -1, 1).getDay();
    console.log(firstDay);

    const lastDate = new Date(year, month, 0).getDate();
    console.log(lastDate);

    // 月表示
    monthTitle.textContent = `${year}年${month}月`;

    // カレンダー生成

    for (let i = 0; i < firstDay; i++){
        calender.innerHTML += `
            <div class="empty"></div>
        `;
    };



    for (let i = 1; i <= lastDate; i++) {
        calender.innerHTML += `
            <div class="day" date-day="${i}">
                <span class="day-number">${i}</span>
            </div>
        `;
        
    };

    const days = document.querySelectorAll(".day")

    days.forEach(day => {
        day.addEventListener("click",() => {
            const clickedDay = day.querySelector(".day-number").textContent;
            selectedDate = clickedDay;

            scheduleList.innerHTML = `
            <h3>${clickedDay}日の予定</h3>
            `
        });
    });
    
};



createCalender();
