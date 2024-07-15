const querySelectors = (() => {
    const body = document.querySelector('body');

    const section = document.querySelector('section');

    const projectDiv = document.querySelector('.project');

    return {body, section, projectDiv};
})();

const linkIndex = (arr, item, element) => {
    element.setAttribute('data-index', arr.indexOf(item));
};

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

export {appendProject};