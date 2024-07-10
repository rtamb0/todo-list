const projects = (() => {
    const list = [];

    const getList = () => {
        return list.slice(0);
    };

    const addToList = (project) => {
        list.push(project);
    };

    let selector;
    const changeSelector = (n) => {
        selector = n;
    };

    return {getList, addToList, changeSelector};
})();

const createProject = () => {
    const project = [];
    return project;
}

const localStorage = (mode, key, item) => {
    if (mode === "get") {
        const get = localStorage.getItem(key);
        return JSON.parse(get);
    } else if (mode === "set") {
        localStorage.setItem(key, JSON.stringify(item));
    }
}

const checkLocalProjectList = () => {
    if (!localStorage.getItem("projects")) {
        // Creates new default project and saves it locally
        projects.addToList(createProject());
        localStorage("set", "projects", projects.getList());
        projects.changeSelector(0);
        localStorage('set', 'selector', 0);
    } else {
        const localList = localStorage('get', 'projects');
        for (const project of localList) {
            projects.addToList(project);
        };
    };
}

const todo = (title, description, dueDate, priority, notes, checklist) => {
    return {title, description, dueDate, priority, notes, checklist};
}