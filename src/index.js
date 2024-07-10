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


const checkLocalProjectList = () => {
    if (!localStorage.getItem("projects")) {
        projects.addToList(createProject());
        localStorage("set", "projects", projects.getList());
        projects.changeSelector(0);
    } else {
        //Gets the projects from the local storage and then append it to the pag
        
    }

}

const localStorage = (mode, key, item) => {
    if (mode === "get") {
        const get = localStorage.getItem(key);
        return JSON.parse(get);
    } else if (mode === "set") {
        localStorage.setItem(key, JSON.stringify(item));
    }
}

const createProject = () => {
    const project = [];
    return project;
}


const todo = (title, description, dueDate, priority, notes, checklist) => {
    return {title, description, dueDate, priority, notes, checklist};
}