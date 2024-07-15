const querySelectors = (() => {
    const body = document.querySelector('body');

    const section = document.querySelector('section');

    const projectDiv = document.querySelector('.project');

    return {body, section, projectDiv};
})();

const linkIndex = (arr, item, element) => {
    element.setAttribute('data-index', arr.indexOf(item));
};

const appendProject= (project) => {
    const todoList = document.createElement('ul');
    todoList.className = 'todo-list';
    querySelectors.projectDiv.appendChild(todoList);
    if (project.length > 0) {
        for (todo in project) {
            appendTodo(project, todo);
        };
    };
};

// function that loops through all of the projects and if it matches the selector value then displays the selected project from previous session
const appendPreviousSelectedProject = (list, selectedProject) => {
    for (project in list) {
        if (project === selectedProject) {
            appendProject(selectedProject);
        };
    };
};



const todoInputs = {
    // Creates the placeholder text for the inputs
    placeholderText: function(text, input) {
        input.setAttribute('placeholder', text);
    },
    // Creates the inputs
    content: function(name, type) {
        let label;
        if (type !== 'submit') {
            label = document.createElement('label');
            label.innerHTML = name;
            label.setAttribute('for', name);
        };
        
        let input;
        if (type === 'textarea') {
            input = document.createElement('textarea');
            input.setAttribute('rows', "10");
            input.setAttribute('columns', "50");
        } else {
            input = document.createElement('input');
            input.setAttribute('type', type);
        };
        
        if (type === 'submit') {
            input.setAttribute('value', name);
        } else if (type !== 'textarea') {
            input.setAttribute('id', name);
            input.setAttribute('name', name);
            input.setAttribute('required', "");
        };

        let datalist;
        if (type === 'range') {
            input.setAttribute('list', 'priority');
            datalist = document.createElement('datalist');
            datalist.setAttribute('id', 'priority');
            
            const low = document.createElement('option');
            low.setAttribute('value', '0');
            low.innerHTML = 'Low';
            datalist.appendChild(low);

            const mid = document.createElement('option');
            mid.setAttribute('value', '1');
            mid.innerHTML = 'Mid';
            datalist.appendChild(mid);

            const high = document.createElement('option');
            high.setAttribute('value', '2');
            high.innerHTML = 'High';
            datalist.appendChild(high);
        };

        if (type === "text" && name === "Title") this.placeholderText("E.g. Taking the bin out, do my homeworks, etc", input);
        if (type === "textarea") this.placeholderText("Details of your to-dos (optional) ", input);
        if (type === "text" && name === "Notes") this.placeholderText("Add any additional information on here...", input);

        const section = document.createElement('div');
        if (type !== 'submit') section.appendChild(label);
        section.appendChild(input);
        if (type === 'range') section.appendChild(datalist);
        section.className = name.toLowerCase().split(" ").join("");
        
        return section;
    }
};

const appendTodo = (project, todo) => {
    const todoCard = document.createElement('li');

    const title = document.createElement('h3');
    title.innerHTML = todo.title;
    todoCard.appendChild(title);

    const description = document.createElement('p');
    description.innerHTML = todo.description;
    todoCard.appendChild(description);

    const dueDate = document.createElement('p');
    dueDate.innerHTML = todo.dueDate;
    todoCard.appendChild(dueDate);

    const notes = document.createElement('h5');
    notes.innerHTML = todo.notes;
    todoCard.appendChild(notes);

    const checklist = document.createElement('button');
    checklist.innerHTML = todo.checklist;
    todoCard.appendChild(checklist);

    const todoList = document.querySelector('.todo-list');
    todoList.appendChild(todoCard);

    linkIndex(project, todo, todoCard);
};

export {appendProject, appendPreviousSelectedProject};