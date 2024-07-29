const projectList = (() => {
    const list = [];

    const get = () => {
        return list.slice(0);
    };

    const getCurrentProject = () => {
        const currentProject = list[projectLogic.selector.get()];
        return currentProject;
    };

    const addProject = (project) => {
        list.push(project);
        console.log(list);
        localSave.set('projects', list);
    };

    const removeProject = (project) => {
        const index = list.indexOf(project);
        list.splice(index, 1);
        console.log(list);
        localSave.set('projects', list);
    };

    const addTodoToCurrentProject = (todo) => {
        const todoList = list[projectLogic.selector.get()].todos;
        todoList.push(todo);
        todos.sort(todoList);
        console.log(todoList);
        localSave.set('projects', list);
    };

    const removeTodoFromCurrentProject = (index) => {
        const todoList = list[projectLogic.selector.get()].todos;
        todoList.splice(index, 1);
        todos.sort(todoList);
        console.log(todoList);
        localSave.set('projects', list);
    };

    return {get, getCurrentProject, addProject, removeProject, addTodoToCurrentProject, removeTodoFromCurrentProject};
})();

const projectLogic = (() => {
    const create = (name) => {
        const project = {};
        project.name = name;
        project.todos = [];
        projectList.addProject(project);
        const projectGet = project;
        return projectGet;
    };

    const selector = (() => {
        let selector;

        const set = (project) => {
            selector = projectList.get().indexOf(project);
            localSave.set("selector", selector);
        };

        const setAfterDeletion = (project) => {
            selector = projectList.get().indexOf(project);
            if (selector === projectList.get().length - 1 && projectList.get().length !== 1) selector -= 1;
            console.log(selector);
            localSave.set("selector", selector);
        };
    
        const retrieve = (savedSelector) => {
            selector = savedSelector;
        };
    
        const get = () => {
            const getSelector = selector;
            return getSelector;
        };
    
        return {set, setAfterDeletion, retrieve, get};
    })();

    return {create, selector};
})();

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

const todos = (() => {
    const create = (title, description, dueDate, priority, notes, checklist) => {
        const todo = {title, description, dueDate, priority, notes, checklist}
        projectList.addTodoToCurrentProject(todo);
        return todo;
    };

    const sort = (todos) => {
        for (let i = 0; i < todos.length; i++) {
            for (let j = 0; j < todos.length - i - 1; j++) {
                const year1 = todos[j].dueDate.slice(0, 4);
                const month1 = todos[j].dueDate.slice(5, 7);
                const day1 = todos[j].dueDate.slice(8, 10);
                
                const year2 = todos[j + 1].dueDate.slice(0, 4);
                const month2 = todos[j + 1].dueDate.slice(5, 7);
                const day2 = todos[j + 1].dueDate.slice(8, 10);

                const checklist1 = todos[j].checklist;
                const checklist2 = todos[j + 1].checklist;
                
                const priority1 = todos[j].priority;       
                const priority2 = todos[j + 1].priority;
    
                if ((checklist1 === 'on' && checklist2 === 'off') || (checklist1 === checklist2) && priority2 > priority1 || ((checklist1 === checklist2) && (priority2 === priority1) && (year1 > year2 || (year1 === year2 && month1 > month2) || (year1 === year2 && month1 === month2 && day1 > day2)))) {
                    const temp = todos[j];
                    todos[j] = todos[j + 1];
                    todos[j + 1] = temp;
                };
            };
        };
    };

    const checklist = (index) => {
        const todo = projectList.getCurrentProject().todos[index];
        projectList.removeTodoFromCurrentProject(index);

        if (todo.checklist === 'on') {
            todo.checklist = 'off';
        } else if (todo.checklist === 'off') {
            todo.checklist = 'on';
        };

        projectList.addTodoToCurrentProject(todo);
    };
    
    return {create, sort, checklist};
})();

const checkLocalProjectList = (startUp, append) => {
    if (localSave.get("projects") === null || localSave.get("projects") === undefined || localSave.get("selector") === null || localSave.get("selector") === undefined) {
        // Creates new default project and saves it locally
        startUp.show();
    } else {
        // Gets project list from local stroage
        const localList = localSave.get("projects");
        for (const project of localList) {
            projectList.addProject(project);
        };
        projectLogic.selector.retrieve(localSave.get("selector"));
        append.list(projectList.get());
        append.selectedProject(projectList.get(), projectList.getCurrentProject());
    };
};

export {projectList, todos, projectLogic, checkLocalProjectList};