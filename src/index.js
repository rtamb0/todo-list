import 'normalize.css';
import './style.css'
import { projectList, todos, projectLogic, checkLocalProjectList } from "./logic";

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
        let projects = document.querySelector('.project-list');
        if (projects === null) {
            projects = document.createElement('ul');
            projects.className = 'project-list';
            querySelectors.sideBar.appendChild(projects);
        } else {
            clearElements.list();
        };

        for (const currentProject of list) {
            const project = document.createElement('li');
            const index = linkIndex(list, currentProject, project);

            const projectText = document.createElement('p');
            projectText.innerHTML = currentProject.name;
            project.appendChild(projectText);

            const deleteButton = document.createElement('button');
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const warning = confirm("Are you sure you want to delete this project?");
                if (warning) {
                    const listLength = projectList.get().length;
                    if (listLength === 1) alert("Please create another project before deleting this one.")
                        else {
                            projectLogic.selector.setAfterDeletion(currentProject);
                            projectList.removeProject(currentProject);
                            append.list(projectList.get());
                            append.project(projectList.getCurrentProject());
                        };
                };
            });
            
            if (index === projectLogic.selector.get()) {
                project.className = 'active';
                project.appendChild(deleteButton);
            };

            project.addEventListener('click', () => {
                projectLogic.selector.set(currentProject);
                const projectList = projects.querySelectorAll('li');
                for (const project of projectList) {
                    if (project.classList.contains('active')) {
                        project.className = '';
                        const deleteButton = project.querySelector('button')
                        project.removeChild(deleteButton);
                    };
                };
                project.className = 'active';
                project.appendChild(deleteButton);
                append.project(currentProject);
            });

            projects.appendChild(project);
        };
    };

    const project = (project) => {
        let todoList = document.querySelector('.todo-list');
        if (todoList === null) {
            todoList = document.createElement('ul');
            todoList.className = 'todo-list';
            querySelectors.projectDiv.appendChild(todoList);
        } else {
            clearElements.todos();
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
                append.project(selectedProject);
            };
        };
    };

    const todo = (todo, project) => {
        const todoCard = document.createElement('li');
        const index = linkIndex(project, todo, todoCard);
        const frontWrapper = document.createElement('div');
        const tooltipWrapper = document.createElement('div');
    
        const title = document.createElement('h3');
        title.innerHTML = todo.title;
        frontWrapper.appendChild(title);

        const dueDate = document.createElement('p');
        dueDate.innerHTML = todo.dueDate;
        frontWrapper.appendChild(dueDate);

        const checklist = document.createElement('button');
        if (todo.checklist === 'off') todoCard.classList.add('unfinished')
            else if (todo.checklist === 'on') todoCard.classList.add('finished');
        checklist.addEventListener('click', () => {
            todos.checklist(index);
            append.project(projectList.getCurrentProject());
        });
        frontWrapper.appendChild(checklist);
    
        const priorityLabel = document.createElement('p');
        priorityLabel.innerHTML = "Priority"
        const priorityText = document.createElement('p');
        if (todo.priority === '0') {
            priorityText.innerHTML = "Low";
            todoCard.classList.add('low');
        } else if (todo.priority === '1') {
            priorityText.innerHTML = "Moderate";
            todoCard.classList.add('moderate');
        } else if (todo.priority === '2') {
            priorityText.innerHTML = "High";
            todoCard.classList.add('high');
        };
        const priority = document.createElement('em');
        priority.appendChild(priorityText);
        priority.appendChild(priorityLabel);
        tooltipWrapper.appendChild(priority);

        const description = document.createElement('p');
        if (todo.description === "") {
            description.innerHTML = "(No description provided)"
            todoCard.classList.add("no-description");
        } else description.innerHTML = todo.description;
        tooltipWrapper.appendChild(description);
    
        const notes = document.createElement('h5');
        notes.innerHTML = todo.notes;
        if (todo.notes !== "") tooltipWrapper.appendChild(notes);

        const removeButton = document.createElement('button');
        removeButton.addEventListener('click', () => {
            const warning = confirm("Are you sure you want to delete this todo?");
            if (warning) {
                projectList.removeTodoFromCurrentProject(index);
                append.project(projectList.getCurrentProject());
            };
        });

        const editButton = document.createElement('button');
        editButton.addEventListener('click', () => {
            todoForm.run(index);
            const inputs = document.querySelectorAll('#todoForm input');
            const textArea = document.querySelector('#todoForm textarea');
            for (const input of inputs) {
                const inputType = input.getAttribute('name');
                switch (inputType) {
                    case 'title':
                        input.value = title.innerHTML;
                        break;
                    case 'duedate':
                        input.value = dueDate.innerHTML;
                        break;
                    case 'priority':
                        switch (priorityText.innerHTML) {
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

        const buttons = document.createElement('div');
        buttons.className = "todo-buttons";
        buttons.appendChild(editButton);
        buttons.appendChild(removeButton);
        tooltipWrapper.appendChild(buttons);

        todoCard.appendChild(frontWrapper);

        todoCard.addEventListener('mouseenter', () => {
            todoCard.appendChild(tooltipWrapper);
        });

        todoCard.addEventListener('mouseleave', () => {
            todoCard.removeChild(tooltipWrapper);
        });
    
        const todoList = document.querySelector('.todo-list');
        todoList.appendChild(todoCard);
    };

    return {project, selectedProject, list};
})();

const linkIndex = (arr, item, element) => {
    element.setAttribute('data-index', arr.indexOf(item));
    return parseInt(element.getAttribute('data-index'));
};

const clearElements = (() => {
    const todos = () => {
        const todoList = document.querySelector('.todo-list');
        while (todoList.firstElementChild)
            todoList.removeChild(todoList.firstElementChild);
    };

    const list = () => {
        const projectList = document.querySelector('.project-list');
        while (projectList.firstElementChild)
            projectList.removeChild(projectList.firstElementChild);
    };
    
    return {todos, list};
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
            const newProject = projectLogic.create(input.value);
            projectLogic.selector.set(newProject);
            append.list(projectList.get());
            append.project(newProject);
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