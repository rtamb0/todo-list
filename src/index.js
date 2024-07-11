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

    const get = () => {
        const getSelector = selector;
        return getSelector;
    };

    return {set, get};
});

const checkLocalProjectList = (() => {
    if (!localSave.get("projects")) {
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
            projectList.add(project);
        };
        projectSelector.set(localSave.get("selector"));
    };
})();

const todo = (title, description, dueDate, priority, notes, checklist) => {
    return {title, description, dueDate, priority, notes, checklist};
};
