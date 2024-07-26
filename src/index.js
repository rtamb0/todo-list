import { projectList, todos, project, checkLocalProjectList } from "./logic";

const querySelectors = (() => {
    const body = document.querySelector('body');

    const section = document.querySelector('section');

    const projectDiv = document.querySelector('.project');

    const newProject = document.querySelector('#createProject');

    const newProjectButton = document.querySelector('#createNewProject');

    const newProjectInput = document.querySelector('#newProject');

    const newProjectForm = document.querySelector('#projectForm');

    const newProjectCancel = document.querySelector('#cancelNewProject');

    const todoCreate = document.querySelector('#makeTodo');

    const todoDialog = document.querySelector('#createTodo');

    const todoForm = document.querySelector('#todoForm');

    const todoCancel = document.querySelector('#cancelTodo');

    const sideBar = document.querySelector('#projectList');

    return {body, section, projectDiv, newProject, newProjectButton, newProjectInput, newProjectForm, newProjectCancel, todoCreate, todoDialog, todoForm, todoCancel, sideBar};
})();

const append = (() => {
    const list = (list) => {
        const projectList = document.createElement('ul');
        projectList.className = 'project-list';
        querySelectors.sideBar.appendChild(projectList);

        for (const project of list) {
            const projectName = document.createElement('li');
            projectName.innerHTML = project.name;
            projectList.appendChild(projectName);
        };
    };

    const project = (project) => {
        let todoList;
        if (document.querySelector('.todo-list') === null) {
            todoList = document.createElement('ul');
            todoList.className = 'todo-list';
            querySelectors.projectDiv.appendChild(todoList);
        } else {
            todoList = document.querySelector('.todo-list');
            while (todoList.firstElementChild) todoList.removeChild(todoList.firstElementChild);
        };

        if (project.todos.length > 0) {
            for (const currentTodo of project.todos) {
                todo(currentTodo, project.todos);
            };
        };
    };

    const selectedProject = (list, selectedProject) => {
        for (const currentProject of list) {
            if (currentProject === selectedProject) {
                project(selectedProject);
            };
        };
    };

    const todo = (todo, project) => {
        const todoCard = document.createElement('li');
        const index = linkIndex(project, todo, todoCard);

        const removeButton = document.createElement('button');
        removeButton.addEventListener('click', () => {
            const warning = confirm("Are you sure you want to delete this todo?");
            if (warning) {
                projectList.removeTodoFromCurrentProject(index);
                clearElements.todos();
                append.project(projectList.getCurrentProject());
            };
        });
        todoCard.appendChild(removeButton);

        const editButton = document.createElement('button');
        editButton.addEventListener('click', () => {
            todoForm.run(index);
            const inputs = document.querySelectorAll('#todoForm input');
            const textArea = document.querySelector('#todoForm textarea');
            for (const input of inputs) {
                const inputType = input.getAttribute('name');
                console.log(inputType)
                switch (inputType) {
                    case 'title':
                        input.value = title.innerHTML;
                        break;
                    case 'duedate':
                        input.value = dueDate.innerHTML;
                        break;
                    case 'priority':
                        switch (priority.innerHTML) {
                            case 'Low':
                                input.value = '0';
                                break;
                            case 'Moderate':
                                input.value = '1';
                                break;
                            case 'High':
                                input.value = '2';
                                break;
                        };
                        break;
                    case 'notes':
                        input.value = notes.innerHTML;
                        break;
                    case 'checklist':
                        switch (checklist.innerHTML) {
                            case 'Not done':
                                input.checked = false;
                                break;
                            case 'Done':
                                input.checked = true;
                                break;
                        };
                        break;
                };
            };
            textArea.value = description.innerHTML;
        });
        todoCard.appendChild(editButton);
    
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
            todos.checklist(index);
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
    };

    return {project, selectedProject, list};
})();

const linkIndex = (arr, item, element) => {
    element.setAttribute('data-index', arr.indexOf(item));
    return element.getAttribute('data-index');
};

const clearElements = (() => {
    const todos = () => {
        const todoList = document.querySelector('.todo-list');
        while (todoList.firstElementChild)
            todoList.removeChild(todoList.firstElementChild);
    };

    const projects = () => {
        const projectList = document.querySelector('.project-list');
        while (projectList.firstElementChild)
            projectList.removeChild(projectList.firstElementChild);
    };
    
    return {todos, projects};
})();

const newProjectForm = (() => {
    const dialog = querySelectors.newProject;
    const input = querySelectors.newProjectInput;
    const form = querySelectors.newProjectForm;
    const createButton = querySelectors.newProjectButton;
    const cancelButton = querySelectors.newProjectCancel;

    const show = () => {
        dialog.showModal();
        cancelButton.setAttribute('hidden', '');
        formListener();
    };

    createButton.addEventListener('click', () => {
        dialog.showModal();
        formListener();
    });

    const formListener = () => {
        const controller = new AbortController();
        const { signal } = controller;

        form.addEventListener('submit', () => {
            const newProject = project.create(input.value)
            project.selector.set(newProject);
            clearElements.projects();
            append.project(newProject);
            append.list(projectList.get());
            closeDialog();
            if (cancelButton.getAttribute('hidden') !== null) cancelButton.removeAttribute('hidden');
        }, { once: true, signal });
        

        if (cancelButton.getAttribute('hidden') === null) {
            cancelButton.addEventListener('click', () => {
                closeDialog();
                controller.abort();
            }, { once: true });
        }
    };

    const closeDialog = () => {
        dialog.close();
        form.reset();
    };

    return {show};
})();

const todoForm = (() => {
    const dialog = querySelectors.todoDialog;
    const form = querySelectors.todoForm;
    const showButton = querySelectors.todoCreate;
    const cancelButton = querySelectors.todoCancel;

    showButton.addEventListener('click', () => {
        run();
    });  

    const run = (editTodo = false) => {
        const formTitle = dialog.querySelector('h3');
        const confirmButton = form.querySelector('input[type="submit"]');
        if (editTodo !== false) {
            formTitle.innerHTML = "What would you like to edit?"
            confirmButton.value = "Change";
        } else {
            formTitle.innerHTML = "Create your to-do here!"
            confirmButton.value = "Create";
        }
        dialog.showModal();
        formListener(editTodo);
    };

    const formListener = (editTodo = false) => {
        const controller = new AbortController();
        const { signal } = controller;

        form.addEventListener('submit', () => {
            const currentProject = projectList.getCurrentProject();
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
            if (editTodo !== false) {
                const index = editTodo;
                projectList.removeTodoFromCurrentProject(index);
            };
            clearElements.todos();
            todos.create.apply(null, values);
            append.project(currentProject);
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

    return {run};
})();

checkLocalProjectList(newProjectForm, append);