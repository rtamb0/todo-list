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
});

const createProject = () => {
    const project = [];
    return project;
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

const checkLocalProjectList = (() => {
    if (!localSave.get("projects")) {
        // Creates new default project and saves it locally
        projectList.add(createProject());
        localSave.set("projects", projectList.get());
        projectSelector.set(0);
        localSave.set("selector", 0);
    } else {
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