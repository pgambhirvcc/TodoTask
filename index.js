// This is where we store database
let db;

// Calling the SQL.js library 
// This function is written in the sql.js we imported in index.html
// this will help us setup a database and table in DB
initSqlJs({
    locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
}).then(function(SQL){
    db = new SQL.Database();

    db.run(`
        CREATE TABLE todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task TEXT
        )
    `);

    renderTodos();

});

function addTask() {
   const taskInput = document.getElementById('taskInput');
   const taskValue = taskInput.value;

   db.run("INSERT INTO todos (task) VALUES (?)", [taskValue]);

   taskInput.value = "";
   renderTodos();
}

function deleteTask(id) {
   db.run(
    "DELETE FROM todos WHERE id = ?", [id]
   );

   renderTodos();

   alert('Task Deleted Succesfully');
}

function updateTask(id) {
   const newTask = prompt('Enter new task:');

   if (!newTask) {
    return;
   }

   db.run('UPDATE todos SET task = ? WHERE id = ?', [newTask, id]);

   renderTodos();
}

function renderTodos() {
    const list = document.getElementById('taskList');

    // Clear the HTML first
    list.innerHTML = "";

    const response = db.exec('SELECT * FROM todos');

    if (response.length === 0) {
        return;
    }

    const tasks = response[0].values;

    tasks.forEach((task) => {
        const liTag = document.createElement("li");
        const markCompleteButton = document.createElement('button');
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.onclick = () => updateTask(task[0])


        markCompleteButton.textContent = 'Mark Complete';
        markCompleteButton.onclick = () => deleteTask(task[0]);
        liTag.textContent = task[1]; // [1, 'Do grocery']

        liTag.appendChild(updateButton);
        liTag.appendChild(markCompleteButton);
        list.appendChild(liTag);
    })
    console.log(tasks, 'response');

}