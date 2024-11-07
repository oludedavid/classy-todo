// DOM Elements
let todoList = document.getElementById("todo-list");
let addTodoInputCell = document.getElementById("todo-input");
let alertMessage = document.getElementById("alert-message");

// Todo Class
class Todo {
  _alertMessage = "";
  _todo_list = [];

  constructor() {
    this._todo_list = this._fetchTodosFromStorage();
  }

  getTodoList() {
    return this._todo_list;
  }

  getAlertMessage() {
    return this._alertMessage;
  }

  _fetchTodosFromStorage() {
    return JSON.parse(localStorage.getItem("todos")) || [];
  }

  _saveTodosToStorage() {
    localStorage.setItem("todos", JSON.stringify(this._todo_list));
  }

  addTodo(title) {
    const newTodo = {
      id: crypto.randomUUID(),
      title,
      isCompleted: false,
    };
    const existingTodo = this._todo_list.some(
      (element) => element.title === newTodo.title
    );
    if (existingTodo) {
      this._alertMessage = "Todo already exists";
      return;
    }
    this._todo_list.push(newTodo);
    this._saveTodosToStorage();
    this._alertMessage = "Todo added successfully!";
    this.renderTodoList();
  }

  editTodo(id, newTitle) {
    const todoIndex = this._todo_list.findIndex((element) => element.id === id);
    if (todoIndex === -1) {
      this._alertMessage = "Todo not found!";
      return;
    }
    this._todo_list[todoIndex].title = newTitle;
    this._saveTodosToStorage();
    this._alertMessage = "Todo updated successfully!";
    this.renderTodoList();
  }

  deleteTodo(id) {
    this._todo_list = this._todo_list.filter((element) => element.id !== id);
    this._saveTodosToStorage();
    this._alertMessage = "Todo deleted successfully!";
    this.renderTodoList();
  }

  renderTodoList() {
    todoList.innerHTML = this._todo_list
      .map(
        (todo) => `
        <li class="rounded-md shadow todo-item w-full flex items-center justify-between gap-2 px-4 py-3" data-id="${todo.id}">
          <input 
            id="edit-todo-input-and-display"
            type="text" 
            readonly="true" 
            class="w-[90%] flex items-center justify-center border-none text-base sm:text-medium md:text-lg lg:text-xl font-normal text-gray-700  mb-2 outline-none" 
            value="${todo.title}"
          />
          <div class=" flex items-center justify-center gap-3">
            <button class="edit-todo text-red-500 dark:text-red-400" onclick="editTodoItem('${todo.id}')">
              <img class="w-5 h-5" src="assets/icons/edit.png" alt="Edit icon"/>
            </button> 
            <button class="delete-todo text-red-500 dark:text-red-400" onclick="deleteTodoItem('${todo.id}')">
              <img class="w-5 h-5" src="assets/icons/delete.png" alt="Delete icon"/>
            </button>
          </div>
        </li>`
      )
      .join("");
  }
}

// Initial Setup
const todoApp = new Todo();

// Function to Add Todo and Render
function addAndRenderTodo() {
  const title = addTodoInputCell.value.trim();
  if (title) {
    todoApp.addTodo(title);
    addTodoInputCell.value = "";
    alertMessage.textContent = todoApp.getAlertMessage();
  } else {
    alertMessage.textContent = "Please enter a valid todo!";
  }
  setTimeout(() => {
    alertMessage.textContent = "";
  }, 3000);
}

// Edit and Delete Handlers
function editTodoItem(id) {
  const todoItemInputCell = document.querySelector(`[data-id="${id}"] input`);

  if (!todoItemInputCell) {
    alertMessage.textContent = "Todo not found!";
    return;
  }

  todoItemInputCell.removeAttribute("readonly");
  todoItemInputCell.focus();

  // Save the new title when Enter is pressed or focus is lost
  const saveEdit = () => {
    const newTitle = todoItemInputCell.value.trim();
    if (newTitle) {
      todoApp.editTodo(id, newTitle);
      alertMessage.textContent = todoApp.getAlertMessage();
    } else {
      alertMessage.textContent = "Title cannot be empty!";
    }
    todoItemInputCell.setAttribute("readonly", true);
  };

  todoItemInputCell.addEventListener("blur", saveEdit, { once: true });
  todoItemInputCell.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      saveEdit();
    }
  });
  setTimeout(() => {
    alertMessage.textContent = "";
  }, 3000);
}

function deleteTodoItem(id) {
  if (confirm("Are you sure you want to delete this todo?")) {
    todoApp.deleteTodo(id);
    alertMessage.textContent = todoApp.getAlertMessage();
  }
  setTimeout(() => {
    alertMessage.textContent = "";
  }, 3000);
}

// Event Listener for Add Button
document
  .getElementById("add-todo-button")
  .addEventListener("click", addAndRenderTodo);

// Initial Render on Page Load
window.onload = () => todoApp.renderTodoList();
