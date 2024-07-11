import { appendProject } from "./dom";

const projectList = (() => {
    const list = [];

    const get = () => {
        return list.slice(0);
    };

    const addProject = (project) => {
        list.push(project);
    };

    const addTodoToCurrentProject = (todo) => {
        const currentProject = projectSelector.get();
        list[currentProject].push(todo);
    };

    return {get, addProject, addTodoToCurrentProject};
})();

const createProject = () => {
    const project = [];
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

    const set = (list, project) => {
        selector = list.indexOf(project);
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
        const project = createProject();
        localSave.set("projects", projectList.get());
        projectSelector.set(projectList.get(), project);
        localSave.set("selector", projectSelector.get());
        appendProject(projectList, project);
    } else {
        // Gets project list from local stroage
        const localList = localSave.get("projects");
        for (const project of localList) {
            projectList.addProject(project);
        };
        projectSelector.retrieve(localSave.get("selector"));
    };
})();

const todo = (title, description, dueDate, priority, notes, checklist) => {
    return {title, description, dueDate, priority, notes, checklist};
};

const createTodo = () => {
    const title = prompt("What do you want to call this to-do?");
    const description = prompt("What is it about?");
    const dueDate = prompt("When is it due?");
    const priority = prompt("How important is it?");
    const notes = prompt("Any notes to add?");
    const checklist = prompt("Is it done?");

    const todoList = todo(title, description, dueDate, priority, notes, checklist);

    projectList.addTodoToCurrentProject(todoList);

    // Need to make the code below simpler
    console.log(projectList.get()[projectSelector.get()].find((list) => list === todoList));
};

createTodo();