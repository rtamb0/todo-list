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

const appendList = (list) => {
    for (const project of list) {
        const projectName = document.createElement('li');
        projectName.innerHTML = project.name;
        querySelectors.sideBar.appendChild(projectName);
    };
};

const appendProject = (project) => {
    const todoList = document.createElement('ul');
    todoList.className = 'todo-list';
    querySelectors.projectDiv.appendChild(todoList);
    if (project.todos.length > 0) {
        for (const todo of project.todos) {
            appendTodo(todo, project.todos);
        };
    };
};

const appendSelectedProject = (list, selectedProject) => {
    for (const project of list) {
        if (project === selectedProject) {
            appendProject(selectedProject);
        };
    };
};

const linkIndex = (arr, item, element) => {
    element.setAttribute('data-index', arr.indexOf(item));
};

const appendTodo = (todo, project) => {
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
    } else if (todo.priority === '1') {
        priority.innerHTML = "Moderate";
    } else if (todo.priority === '2') {
        priority.innerHTML - "High";
    };
    todoCard.appendChild(priority);

    const notes = document.createElement('h5');
    notes.innerHTML = todo.notes;
    todoCard.appendChild(notes);

    const checklist = document.createElement('button');
    checklist.innerHTML = todo.checklist;
    todoCard.appendChild(checklist);

    const todoList = document.querySelector('.todo-list');
    todoList.appendChild(todoCard);

    linkIndex(project, todo, todoCard);
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
            appendProject(project);
            appendList(getList());
        }, { once: true });
    };
    
    return {show};
})();

const todoForm = (() => {
    const dialog = querySelectors.todoDialog;
    const form = querySelectors.todoForm;
    const showButton = querySelectors.todoCreate;
    const cancelButton = querySelectors.todoCancel;

    const show = (constructor, project) => {
        showButton.addEventListener('click', () => {
            run(constructor, project);
        });
    };

    const run = (constructor, project) => {
        dialog.showModal();
        formListener(constructor, project);
    };

    const formListener = (constructor, project) => {
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
                } else {
                    value = input.value;
                };
                values.push(input.value);
            };
            values.splice(1 ,0, textArea.value);
            const todo = constructor.apply(null, values);
            appendTodo(todo, currentProject.todos);
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

export {appendProject, appendSelectedProject, startUp, appendList, todoForm};

// Perhaps separate the modules by todos and projects instead of doms and logics?