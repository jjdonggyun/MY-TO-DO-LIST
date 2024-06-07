document.addEventListener('DOMContentLoaded', () => {
    const addTaskButton = document.getElementById('add-task-button');
    const newTaskInput = document.getElementById('new-task');
    const taskList = document.getElementById('task-list');
    const calendarElement = document.getElementById('calendar');
    const selectedDateTitle = document.getElementById('selected-date-title');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');

    let selectedDate = null;
    let tasks = JSON.parse(localStorage.getItem('tasks')) || {};

    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    addTaskButton.addEventListener('click', () => {
        const taskText = newTaskInput.value.trim();
        if (taskText && selectedDate) {
            addTask(selectedDate, taskText);
            newTaskInput.value = '';
        }
    });

    function addTask(date, taskText) {
        if (!tasks[date]) {
            tasks[date] = [];
        }
        tasks[date].push({ text: taskText, completed: false });
        saveTasks();
        renderTasks(date);
        updateCalendar();
    }

    function renderTasks(date) {
        taskList.innerHTML = '';
        if (tasks[date]) {
            tasks[date].forEach((task, index) => {
                const li = document.createElement('li');
                const span = document.createElement('span');
                span.textContent = task.text;
                if (task.completed) {
                    li.classList.add('completed');
                }
                const completeButton = document.createElement('button');
                completeButton.textContent = '완료';
                completeButton.classList.add('complete-button');
                completeButton.addEventListener('click', () => {
                    tasks[date][index].completed = !tasks[date][index].completed;
                    saveTasks();
                    renderTasks(date);
                });
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '삭제';
                deleteButton.addEventListener('click', () => {
                    tasks[date].splice(index, 1);
                    saveTasks();
                    renderTasks(date);
                    updateCalendar();
                });
                li.appendChild(span);
                li.appendChild(completeButton);
                li.appendChild(deleteButton);
                taskList.appendChild(li);
            });
        }
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function generateCalendar(month, year) {
        calendarElement.innerHTML = '';
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let calendarHTML = '<div class="calendar-grid">';
        for (let i = 0; i < firstDay; i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const date = `${year}-${month + 1}-${day}`;
            let dayClass = 'calendar-day';
            if (tasks[date] && tasks[date].length > 0) {
                dayClass += ' has-tasks';
            }
            calendarHTML += `<div class="${dayClass}" data-date="${date}">${day}</div>`;
        }
        calendarHTML += '</div>';

        calendarElement.innerHTML = calendarHTML;

        document.querySelectorAll('.calendar-day').forEach(day => {
            day.addEventListener('click', (event) => {
                document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
                event.target.classList.add('selected');
                selectedDate = event.target.getAttribute('data-date');
                selectedDateTitle.textContent = `${selectedDate}의 할 일`;
                renderTasks(selectedDate);
            });
        });

        monthSelect.value = month;
        yearSelect.value = year;
    }

    function updateCalendar() {
        generateCalendar(currentMonth, currentYear);
    }

    function populateMonthSelect() {
        const months = [
            "1월", "2월", "3월", "4월", "5월", "6월",
            "7월", "8월", "9월", "10월", "11월", "12월"
        ];
        monthSelect.innerHTML = months.map((month, index) => `<option value="${index}">${month}</option>`).join('');
    }

    function populateYearSelect() {
        const startYear = 2000;
        const endYear = 2100;
        let yearOptions = '';
        for (let year = startYear; year <= endYear; year++) {
            yearOptions += `<option value="${year}">${year}</option>`;
        }
        yearSelect.innerHTML = yearOptions;
    }

    monthSelect.addEventListener('change', () => {
        currentMonth = parseInt(monthSelect.value);
        generateCalendar(currentMonth, currentYear);
    });

    yearSelect.addEventListener('change', () => {
        currentYear = parseInt(yearSelect.value);
        generateCalendar(currentMonth, currentYear);
    });

    prevMonthButton.addEventListener('click', () => {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        generateCalendar(currentMonth, currentYear);
    });

    nextMonthButton.addEventListener('click', () => {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        generateCalendar(currentMonth, currentYear);
    });

    populateMonthSelect();
    populateYearSelect();
    generateCalendar(currentMonth, currentYear);
});
