const querySelectors = (() => {
    const body = document.querySelector('body');

    const section = document.querySelector('section');

    const projectDiv = document.querySelector('.project');

    const startUpDialog = document.querySelector('#startupInput');

    const startUpInput = document.querySelector('#startup input[type="text"]');

    const startUpForm = document.querySelector('#startup');

    const todoCreate = document.querySelector('#makeTodo')

    const todoDialog = document.querySelector('#createTodo');

    const todoForm = document.querySelector('#todoForm');

    const todoCancel = document.querySelector('#cancelTodo');

    const sideBar = document.querySelector('#projectList');

    return {body, section, projectDiv, startUpDialog, startUpInput, startUpForm, todoCreate, todoDialog, todoForm, todoCancel, sideBar};
})();

const append = (() => {
    const list = (list) => {
        for (const project of list) {
            const projectName = document.createElement('li');
            projectName.innerHTML = project.name;
            querySelectors.sideBar.appendChild(projectName);
        };
    };

    const project = (project, changeCheck = 0) => {
        const todoList = document.createElement('ul');
        todoList.className = 'todo-list';
        querySelectors.projectDiv.appendChild(todoList);
        if (project.todos.length > 0) {
            for (const currentTodo of project.todos) {
                todo(currentTodo, project.todos, changeCheck);
            };
        };
    };

    const selectedProject = (list, selectedProject, changeCheck) => {
        for (const currentProject of list) {
            if (currentProject === selectedProject) {
                project(selectedProject, changeCheck);
            };
        };
    };

    const todo = (todo, project, changeCheck) => {
        const todoCard = document.createElement('li');
    
        const title = document.createElement('h3');
        title.innerHTML = todo.title;
        todoCard.appendChild(title);
    
        const description = document.createElement('p');
        description.innerHTML = todo.description;
        todoCard.appendChild(description);
    
        const dueDate = document.createElement('p');
        dueDate.innerHTML = todo.dueDate;
        todoCard.appendChild(dueDate);
    
        const priority = document.createElement('p');
        if (todo.priority === '0') {
            priority.innerHTML = "Low";
            todoCard.classList.add('low');
        } else if (todo.priority === '1') {
            priority.innerHTML = "Moderate";
            todoCard.classList.add('moderate');
        } else if (todo.priority === '2') {
            priority.innerHTML = "High";
            todoCard.classList.add('high');
        };
        todoCard.appendChild(priority);
    
        const notes = document.createElement('h5');
        notes.innerHTML = todo.notes;
        todoCard.appendChild(notes);
    
        const checklist = document.createElement('button');
        if (todo.checklist === 'off') {
            checklist.innerHTML = "Not done";
            todoCard.className = 'unfinished';
        } else if (todo.checklist === 'on') {
            checklist.innerHTML = "Done";
            todoCard.className = 'finished';
        };
        todoCard.appendChild(checklist);
        checklist.addEventListener('click', () => {
            changeCheck(todoCard.getAttribute('data-index'));
            if (todoCard.className === 'unfinished') {
                checklist.innerHTML = "Done";
                todoCard.className = 'finished';
            } else if (todoCard.className === 'finished') {
                checklist.innerHTML = "Not done";
                todoCard.className = 'unfinished';
            };
        });
    
        const todoList = document.querySelector('.todo-list');
        todoList.appendChild(todoCard);
    
        linkIndex(project, todo, todoCard);
    };

    return {project, selectedProject, list};
})();

const linkIndex = (arr, item, element) => {
    element.setAttribute('data-index', arr.indexOf(item));
};

const clearTodo = () => {
    const todoList = document.querySelector('.todo-list');
    while (todoList.firstElementChild)
        todoList.removeChild(todoList.firstElementChild);
};

const startUp = (() => {
    const dialog = querySelectors.startUpDialog;
    const input = querySelectors.startUpInput;
    const form = querySelectors.startUpForm;

    const show = (constructor, selector, list) => {
        dialog.showModal();
        formListener(constructor, selector, list);
    };

    const formListener = (constructor, selector, getList) => {
        form.addEventListener('submit', () => {
            const project = constructor(input.value)
            selector(project);
            append.project(project);
            append.list(getList());
        }, { once: true });
    };
    
    return {show};
})();

const todoForm = (() => {
    const dialog = querySelectors.todoDialog;
    const form = querySelectors.todoForm;
    const showButton = querySelectors.todoCreate;
    const cancelButton = querySelectors.todoCancel;

    const show = (constructor, project, changeCheck) => {
        showButton.addEventListener('click', () => {
            run(constructor, project, changeCheck);
        });
    };

    const run = (constructor, project, changeCheck) => {
        dialog.showModal();
        formListener(constructor, project, changeCheck);
    };

    const formListener = (constructor, project, changeCheck) => {
        const controller = new AbortController();
        const { signal } = controller;

        form.addEventListener('submit', () => {
            const currentProject = project();
            const inputs = document.querySelectorAll('#todoForm input');
            const textArea = document.querySelector('#todoForm textarea');
            const values = [];
            for (const input of inputs) {
                let value;
                if (input.value === '') {
                    value = '';
                } else if (input.type === 'checkbox' && input.checked === false) {
                    value = 'off';
                } else {
                    value = input.value;
                };
                values.push(value);
            };
            values.splice(1 ,0, textArea.value);
            clearTodo();
            constructor.apply(null, values);
            append.project(currentProject, changeCheck);
            closeDialog();
        }, { once: true, signal });

        cancelButton.addEventListener('click', () => {
            closeDialog();
            controller.abort();
        }, { once: true });
    };

    const closeDialog = () => {
        dialog.close();
        form.reset();
    };

    return {show};
})();

export {append, startUp, todoForm};
