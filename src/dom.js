const querySelectors = (() => {
    const body = document.querySelector('body');

    const section = document.querySelector('section');

    const projectDiv = document.querySelector('.project');

    const startUpDialog = document.querySelector('#startupInput');

    const startUpInput = document.querySelector('#startup input[type="text"]');

    const startUpButton = document.querySelector('#startup input[type="button"]');

    const todoDialog = document.querySelector('#createTodo');

    const todoForm = document.querySelector('#todoForm');

    const sideBar = document.querySelector('#projectList');

    return {body, section, projectDiv, startUpDialog, startUpInput, startUpButton, todoDialog, todoForm, sideBar};
})();

const appendProject= (project) => {
    const todoList = document.createElement('ul');
    todoList.className = 'todo-list';
    querySelectors.projectDiv.appendChild(todoList);
    if (project.length > 0) {
        for (todo in project) {
            appendTodo(project, todo);
        };
    };
};

const appendSelectedProject = (list, selectedProject) => {
    for (project in list) {
        if (project === selectedProject) {
            appendProject(selectedProject);
        };
    };
};

const linkIndex = (arr, item, element) => {
    element.setAttribute('data-index', arr.indexOf(item));
};

const appendTodo = (project, todo) => {
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
    const dialog = querySelectors.todoDialog;
    const input = querySelectors.startUpInput;
    const button = querySelectors.startUpButton;

    const show = (constructor, selector) => {
        dialog.show();
        buttonListener(constructor, selector, append);
    };

    const buttonListener = (constructor, selector) => {
        button.addEventListener('click', () => {
            if (input.checkValidity() === true){
                dialog.close();
                const project = constructor(input.value)
                selector(project);
                appendProject(project);
            };
        });
    };
    
    return {show, buttonListener};
})();

export {appendProject, appendSelectedProject, startUp};

// Perhaps separate the modules by todos and projects instead of doms and logics?