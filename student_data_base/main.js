(function() {
    // создание формы сортировки
    function createSortingForm() {
        let row = document.createElement('div');
        let heading = document.createElement('h2');
        let ids = ['name', 'fac', 'ed-year', 'ed-year-end'];
        let phs = ['По ФИО', 'По факультету', 'По году начала обучения', 'По году окончания обучения'];
 
        row.classList.add('row', 'mt-5', 'mb-2');
        heading.textContent = 'сортировка )';
        row.append(heading);

        for (let i = 0; i < 4; i++) {
            let div = document.createElement('div');
            let input = document.createElement('input');

            div.classList.add('col');
            input.classList.add('form-control', 'filter-input');
            input.placeholder = phs[i];
            input.id = ids[i];
            
            div.append(input);
            row.append(div);
        }

        return row;
    }

    // создание формы добавления студента
    function createAddingForm() {
        let form = document.createElement('form');
        let button = document.createElement('button');
        let ids = ['name', 'fac', 'birth', 'ed-year'];
        let phs = ['ФИО', 'Факультет', 'Дата рождения', 'Дата начала обучения'];

        form.classList.add('input-group', 'mb-3');
        button.classList.add('btn', 'btn-primary');
        button.type = 'submit';
        button.textContent = 'Добавить'

        for (let i = 0; i < 4; i++) {
            let input = document.createElement('input');
            
            input.classList.add('form-control');
            input.required = true;
            input.placeholder = phs[i];
            input.id = ids[i];

            if (i == 2) {
                input.type = 'date';
            }

            form.append(input);
        }
        
        form.append(button);

        return {
            form, 
            button
        }
    }

    // создание таблицы студентов
    function createTable() {
        let table = document.createElement('table');
        let thead = document.createElement('thead');
        let tr = document.createElement('tr');
        let ids = ['id', 'name', 'fac', 'birth', 'ed-year'];
        let texts = ['№', 'ФИО студента', 'Факультет', 'Дата рождения', 'Годы обучения'];

        table.classList.add('table', 'table-dark', 'table-bordered', 'table-hover');

        for (let i = 0; i < 5; i++) {
            let th = document.createElement('th');
            
            th.classList.add('table-heading');
            th.id = ids[i];
            th.textContent = texts[i];

            tr.append(th);
        }

        thead.append(tr)
        table.append(thead);

        return {
            table, 
            thead,
            tr,
        };
    }

    function agetostr(age) {
        var txt;
        count = age % 100;
        if (count >= 5 && count <= 20) {
            txt = 'лет';
        } else {
            count = count % 10;
            if (count == 1) {
                txt = 'год';
            } else if (count >= 2 && count <= 4) {
                txt = 'года';
            } else {
                txt = 'лет';
            }
        }
        return `${age} ${txt}`;
    }

    // age
    function getAge(date) {
        var now = new Date(); //Текущя дата
        var today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); //Текущя дата без времени
        // var dob = date; //Дата рождения
        var dobnow = new Date(today.getFullYear(), date.getMonth(), date.getDate()); //ДР в текущем году
        var age; //Возраст
        
        //Возраст = текущий год - год рождения
        age = today.getFullYear() - date.getFullYear();

        //Если ДР в этом году ещё предстоит, то вычитаем из age один год
        if (today < dobnow) {
            age = age-1;
        }
        
        return agetostr(age);
    }

    function formatDate(date) {
        var dd = date.getDate();
        if (dd < 10) dd = '0' + dd;

        var mm = date.getMonth() + 1;
        if (mm < 10) mm = '0' + mm;

        var yy = date.getFullYear();

        return dd + '.' + mm + '.' + yy;
    }

    // создания поля для студента
    function createTableRow(data) {
        let tr = document.createElement('tr');
        let values = Object.values(data);

        for (let i = 0; i < 5; i++) {
            let td = document.createElement('td');
            let tdate = new Date();
        
            if (i == 3) {
                td.textContent = `${formatDate(values[i])} (${getAge(values[i])})`;
            } else if (i == 4) {
                td.textContent = `${values[i]}-${Number(values[i]) + 4} (${(tdate.getFullYear() - Number(values[i]) > 4) || tdate.getFullYear - Number(values[i]) == 4 && (tdate.getMonth() >= 8) ? 'закончил': String(tdate.getFullYear() - Number(values[i])) + ' курс'})`
            } else {
                td.textContent = values[i];
            }

            tr.append(td);
        }

        return tr;
    }

    // создание данных для таблицы
    function createTableContent(students) {
        let tbody = document.createElement('tbody');

        for (let student of students) {
            let tr = createTableRow(student);

            tbody.append(tr);
        }

        return tbody;
    }

    // объединяем и создаем приложение
    document.addEventListener('DOMContentLoaded', () => {
        // добавляем все на страницу
        let container = document.querySelector('.container');
        let sortForm = createSortingForm();
        let tableHeading = document.createElement('h2');
        let addingForm = createAddingForm();
        let table = createTable();
        let students = [
            {
                id: 1,
                name: 'Тимур',
                fac: 'икт',
                birth: new Date(2002, 8, 17),
                'ed-year': '2020'
            },
            {
                id: 2,
                name: 'Анюта',
                fac: 'икт',
                birth: new Date('2002-04-18'),
                'ed-year': '2020'
            }
        ]
        
        tableHeading.textContent = 'табличка )';

        container.append(sortForm);
        container.append(tableHeading);
        container.append(addingForm.form);
        container.append(table.table);
        
        // добавляем в таблицу начальные данные если имеются
        let tbody = createTableContent(students);
        table.table.append(tbody);

        // обработка события submit в форме добавления студента
        addingForm.form.addEventListener('submit', function(e) {
            e.preventDefault();

            let inputs = addingForm.form.querySelectorAll('input')
            let data = {};
            let correct = true;

            data.id = Math.max(...students.map(o => Number(o.id))) + 1

            inputs.forEach(input => {
                // валидация периода обучения
                if (input.id == 'ed-year') {
                    let todayYear = new Date();
                    todayYear = todayYear.getFullYear();

                    if (Number(input.value) < 2000 || Number(input.value) > todayYear) {
                        correct = false;
                        input.value = '';
                        input.classList.add('is-invalid')
                    } else {
                        data[input.id] = input.value.trim();
                        input.classList.remove('is-invalid');
                    }
                // валидация даты рождения
                } else if (input.id == 'birth') {
                    let date = new Date(input.value);
            
                    if (date > new Date(1900, 1, 1) && date < new Date()) {
                        data[input.id] = date;
                        input.classList.remove('is-invalid');
                    } else {
                        correct = false;
                        input.value = '';
                        input.classList.add('is-invalid');
                    }
                } else if (correct) {
                    data[input.id] = input.value.trim();
                }
                
            });
            // если все поля заполнены правильно, добавить в таблицу
            if (correct) {
                inputs.forEach(input => input.value = '')
                students.push(data);
                tbody.remove();
                tbody = createTableContent(students);
                table.table.append(tbody);
            }
        });

        // сортировка при нажатии на заголовки
        let headings = document.querySelectorAll('.table-heading');

        headings.forEach(heading => {
            heading.addEventListener('click', () => {
                students.sort((a, b) => a[heading.id] > b[heading.id] ? 1: -1);
                tbody.remove();
                tbody = createTableContent(students);
                table.table.append(tbody);
            });
        });
        

        // фильтрация по заданным значениям
        let fInputs = document.querySelectorAll('.filter-input');

        fInputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value) {
                    let fStudents;

                    if (input.id == 'name' || input.id == 'fac') {
                        fStudents = [...students.filter(student => student[input.id].includes(input.value))];
                    } else if (input.id == 'ed-year'){
                        fStudents = [...students.filter(student => student[input.id] == input.value)]
                    } else {
                        fStudents = [...students.filter(student => Number(student['ed-year']) + 4 == input.value)]
                    }

                    tbody.remove();
                    tbody = createTableContent(fStudents);
                    table.table.append(tbody);        
                } else {
                    tbody.remove();
                    tbody = createTableContent(students);
                    table.table.append(tbody);
                }
            });
        });

    });



})();