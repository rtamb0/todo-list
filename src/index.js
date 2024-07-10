const projectList = (() => {
    const list = [];

    const get = () => {
        return list.slice(0);
    };

    const add = (project) => {
        list.push(project);
    };

    return {get, add};
})();

const projectSelector = (() => {
    let selector;

    const set = (n) => {
        selector = n;
    };

    const get = () => {
        const getSelector = selector;
        return getSelector;
    };

    return (set, get);
})

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
        localStorage("set", "projects", projectList.get());
        projectSelector.get(0);
        localStorage('set', 'selector', 0);
    } else {
        const localList = localStorage('get', 'projects');
        for (const project of localList) {
            projectList.add(project);
        };
    };
}

const todo = (title, description, dueDate, priority, notes, checklist) => {
    return {title, description, dueDate, priority, notes, checklist};
}