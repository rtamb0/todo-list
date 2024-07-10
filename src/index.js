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
        projects.changeSelector(0);
        localStorage("set", projects.getList());
    } else {
        //Gets the projects from the local storage and then append it to the page
    }

}

const localStorage = (mode, item) => {
    if (mode === "get") {
        return localStorage.getItem(item, JSON.parse(item));
    } else if (mode === "set") {
        localStorage.setItem(item, JSON.stringify(item));
    }
}

const createProject = () => {
    const project = [];
    return project;
}


const todo = (title, description, dueDate, priority, notes, checklist) => {
    return {title, description, dueDate, priority, notes, checklist};
}