const querySelectors = (() => {
    const body = document.querySelector('body');

    const section = document.querySelector('section');

    const projectDiv = document.querySelector('.project');

    return (body, section, projectDiv);
})();

const linkIndex = (list, item, element) => {
    element.setAttribute('data-index', list.indexOf(item));
};

const appendProject= (list, project) => {
    const todoList = document.createElement('ul');
    todoList.className = 'todo-list';
    querySelectors.projectDiv.appendChild(todoList);
    linkIndex(list, project, todoList);
};

// function that loops through all of the projects and if it does not match the selector value then it would hide it

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