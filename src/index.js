import { appendSelectedProject, startUp } from "./dom";

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
        const currentProject = projectSelector.get();
        list[currentProject].push(todo);
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
        startUp.show(createProject, projectSelector.set);
    } else {
        // Gets project list from local stroage
        const localList = localSave.get("projects");
        for (const project of localList) {
            projectList.addProject(project);
        };
        projectSelector.retrieve(localSave.get("selector"));
        appendSelectedProject(projectList.get(), projectList.getCurrentProject());
    };
})();

const todo = (title, description, dueDate, priority, notes, checklist) => {
    return {title, description, dueDate, priority, notes, checklist};
};
