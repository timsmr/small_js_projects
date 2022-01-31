(function() {
    // создаем и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    // создаем и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        button.disabled = 'disabled';

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        }
    }

    // создаем и возвращаем список элементов
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    // 
    function createTodoItem(name) {
        let item = document.createElement('li');
        // кнопки помещаем в элемент, который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        // устанавливаем стили для элемента списка, а также для размещения кнопок
        // в его правой части с помощью flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
        return {
            item,
            doneButton,
            deleteButton,
            name
        }
    }

    function createTodoApp(container, title = 'Список дел', storageKey, todoDefault = null) {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();
        let storageItemList = JSON.parse(localStorage.getItem(storageKey));

        // creating localStorage for the first time 
        if (todoDefault !== null && storageItemList === null) {
            localStorage.setItem(storageKey, JSON.stringify(todoDefault));
            storageItemList = [...todoDefault];
        }

        // adding items from the storage
        if (storageItemList !== null) {
            for (let storageItem of storageItemList) {
                let name = storageItem.name;
                let done = storageItem.done;
                let todoItem = createTodoItem(name);

                if (done) {
                    todoItem.item.classList.add('list-group-item-success');
                }
                todoList.append(todoItem.item);

                // добавляем обработчики на кнопки
                todoItem.doneButton.addEventListener('click', function() {
                    todoItem.item.classList.toggle('list-group-item-success');
                    let itemIndex = storageItemList.findIndex(o => o.name == todoItem.name);
                    console.log(storageItemList[itemIndex], itemIndex);
                    storageItemList[itemIndex].done = !(storageItemList[itemIndex].done);
                    localStorage.setItem(storageKey, JSON.stringify(storageItemList));
                });
                todoItem.deleteButton.addEventListener('click', function() {
                    if (confirm('Вы уверены?')) {
                        let itemIndex = storageItemList.findIndex(o => o.name == todoItem.name);
                        console.log(itemIndex)
                        storageItemList.splice(itemIndex, 1);
                        localStorage.setItem(storageKey, JSON.stringify(storageItemList));
                        todoItem.item.remove();
                    }
                });
            }
        }
        

        // disabling submit button if empty
        todoItemForm.input.addEventListener('input', () => {
            if (todoItemForm.input.value) {
                todoItemForm.button.removeAttribute("disabled");
            } else {
                todoItemForm.button.setAttribute("disabled", "disabled");
            }
        });

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        // браузер создает событие submit на форме по нажатию Enter или на кнопку создания дела
        todoItemForm.form.addEventListener('submit', function(e) {
            // эта строка необходима чтобы предотвратить стандартное поведение браузера
            // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
            e.preventDefault();
            
            let todoItem = createTodoItem(todoItemForm.input.value);
            
            storageItemList.push({name: todoItemForm.input.value, done: false});
            localStorage.setItem(storageKey, JSON.stringify(storageItemList));

            // добавляем обработчики на кнопки
            todoItem.doneButton.addEventListener('click', function() {
                todoItem.item.classList.toggle('list-group-item-success');
                let itemIndex = storageItemList.findIndex(o => o.name=== todoItem.name);
                storageItemList[itemIndex].done = storageItemList[itemIndex].done;
                localStorage.setItem(storageKey, JSON.stringify(storageItemList));
            });
            todoItem.deleteButton.addEventListener('click', function() {
                if (confirm('Вы уверены?')) {
                    let itemIndex = storageItemList.findIndex(o => o['name'] === todoItem['name']);
                    storageItemList.splice(itemIndex, 1);
                    localStorage.setItem(storageKey, JSON.stringify(storageItemList));
                    todoItem.item.remove();
                }
            });

            // создаем и добавляем в список новое дело с названием из поля для ввода
            todoList.append(todoItem.item);

            // обнуляем значение в поле, чтобы не пришлось стирать его вручную
            todoItemForm.input.value = '';
            todoItemForm.button.setAttribute("disabled", "disabled");
        });
    }

    window.createTodoApp = createTodoApp;
})();