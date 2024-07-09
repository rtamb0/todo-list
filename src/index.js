const checkLocalProjectList = () => {
    if (!localStorage.getItem("projects")) {
        const projects = [];
        projects[0] = createProject(projects.list);
        localStorage("set", projects);
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

const projectPointer = () => {
    // Gets the index value of the project that is selected
}

const createProject = (list) => {
    const project = [];
    list.push(project);
    return project;
}


const todo = (title, description, dueDate, priority, notes, checklist) => {
    return {title, description, dueDate, priority, notes, checklist};
}