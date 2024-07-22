import { appendSelectedProject, startUp, appendList, todoForm } from "./dom";

const projectList = (() => {
    const list = [];

    const get = () => {
        return list.slice(0);
    };

    const getCurrentProject = () => {
        const currentProject = list[projectSelector.get()];
        return currentProject;
    };

    const addProject = (project) => {
        list.push(project);
        localSave.set('projects', list);
    };

    const addTodoToCurrentProject = (todo) => {
        const todoList = list[projectSelector.get()].todos;
        todoList.push(todo);
        sortTodos(todoList);
        console.log(todoList);
        localSave.set('projects', list);
    };

    return {get, getCurrentProject, addProject, addTodoToCurrentProject};
})();

const createProject = (name) => {
    const project = {};
    project.name = name;
    project.todos = [];
    projectList.addProject(project);
    const projectGet = project;
    return projectGet;
};

const localSave = (() => {
    const get = (key) => {
        const item = localStorage.getItem(key);
        return JSON.parse(item);
    };

    const set = (key, item) => {
        localStorage.setItem(key, JSON.stringify(item));
    };

    return {get, set};
})();

const projectSelector = (() => {
    let selector;

    const set = (project) => {
        selector = projectList.get().indexOf(project);
        localSave.set("selector", selector);
    };

    const retrieve = (savedSelector) => {
        selector = savedSelector;
    };

    const get = () => {
        const getSelector = selector;
        return getSelector;
    };

    return {set, retrieve, get};
})();

const checkLocalProjectList = (() => {
    if (localSave.get("projects") === null || localSave.get("projects") === undefined || localSave.get("selector") === null || localSave.get("selector") === undefined) {
        // Creates new default project and saves it locally
        startUp.show(createProject, projectSelector.set, projectList.get);
    } else {
        // Gets project list from local stroage
        const localList = localSave.get("projects");
        for (const project of localList) {
            projectList.addProject(project);
        };
        projectSelector.retrieve(localSave.get("selector"));
        appendList(projectList.get());
        appendSelectedProject(projectList.get(), projectList.getCurrentProject());
    };
})();

const createTodo = (title, description, dueDate, priority, notes, checklist) => {
    const todo = {title, description, dueDate, priority, notes, checklist}
    projectList.addTodoToCurrentProject(todo);
    return todo;
};

const sortTodos = (todos) => {
    for (let i = 0; i < todos.length; i++) {
        for (let j = 0; j < todos.length - i - 1; j++) {
            const year1 = todos[j].dueDate.slice(0, 4);
            const month1 = todos[j].dueDate.slice(5, 7);
            const day1 = todos[j].dueDate.slice(8, 10);
            
            const year2 = todos[j + 1].dueDate.slice(0, 4);
            const month2 = todos[j + 1].dueDate.slice(5, 7);
            const day2 = todos[j + 1].dueDate.slice(8, 10);

            const priority1 = todos[j].priority;
            
            const priority2 = todos[j + 1].priority;

            if (priority2 > priority1 || year1 > year2 || (year1 === year2 && month1 > month2) || (year1 === year2 && month1 === month2 && day1 > day2)) {
                const temp = todos[j];
                todos[j] = todos[j + 1];
                todos[j + 1] = temp;
            };
        };
    };
};

todoForm.show(createTodo, projectList.getCurrentProject);
