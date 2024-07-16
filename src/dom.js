const querySelectors = (() => {
    const body = document.querySelector('body');

    const section = document.querySelector('section');

    const projectDiv = document.querySelector('.project');

    const dialog = document.querySelector('#createTodo');

    const form = document.querySelector('#todoForm');

    const sideBar = document.querySelector('#projectList');

    return {body, section, projectDiv, dialog, form, sideBar};
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

// function that loops through all of the projects and if it matches the selector value then displays the selected project from previous session
const appendPreviousSelectedProject = (list, selectedProject) => {
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
    let value;
    const start = () => {
        const startUpForm = document.createElement('form');
        startUpForm.className = "startup";
    
        const inputContainer = document.createElement('div');
        inputContainer.className = 'startupInput'
    
        const textLabel = document.createElement('label');
        textInput.setAttribute('for', 'firstproject');
        inputContainer.appendChild(textLabel);
    
        const textInput = document.createElement('input');
        textInput.setAttribute('type', 'text');
        textInput.setAttribute('name', 'firstproject');
        textInput.setAttribute('id', 'firstproject');
        textInput.setAttribute('required', '');
        inputContainer.appendChild(textInput);
    
        startUpForm.appendChild(inputContainer);
    
        const confirmButton = document.createElement('input');
        confirmButton.setAttribute('type', 'button');
        confirmButton.setAttribute('value', 'Create new project');
        confirmButton.setAttribute('onclick', `${() => {
            if (textInput.value !== "") {
                value = textInput.value;
                while (startUpForm.firstElementChild !== "") startUpForm.removeChild(startUpForm.firstElementChild);
            };
        }}`);
        startUpForm.appendChild(confirmButton);
    
        querySelectors.body.insertBefore(startUpForm, querySelectors.section);  
    }
    const get = () => {
        const getValue = value;
        return getValue;
    };

    return {start, get};
})();

export {appendProject, appendPreviousSelectedProject, startUp };

// Perhaps separate the modules by todos and projects instead of doms and logics?