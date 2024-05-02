interface ToDo {
  id: number,
  title: string,
  isCompleted: boolean
};

const form = document.querySelector<HTMLFormElement>('#form')!;
const Todoinput = document.querySelector<HTMLInputElement>('#add-todo')!;
const todoList = document.querySelector<HTMLUListElement>('#todoList')!;
let Todos: ToDo[] = loadTodoLocalStorage();
Todos.forEach(RenderingToDo);


function whenNoTodo() {
  if (todoList.childElementCount === 0) {
    const h1 = document.createElement('h1');
    h1.classList.add('noTodo');
    h1.textContent = "Enter Some ToDos...";
    todoList.append(h1);
  } else {
    const noTodoElement = todoList.querySelector('.noTodo');
    if (noTodoElement) {
      todoList.removeChild(noTodoElement);
    }
  }
}
whenNoTodo();


function saveTodoLocalStorage() {
  localStorage.setItem(`ToDo's`, JSON.stringify(Todos))
}

function loadTodoLocalStorage() {
  const localStorageTodos = localStorage.getItem(`ToDo's`);
  if(localStorageTodos == null) return[];
  return JSON.parse(localStorageTodos) as ToDo[];
}


form.addEventListener('submit', e => {
  e.preventDefault();

  const todoVal = Todoinput.value;
  if (todoVal === "") return;

  const newTodo: ToDo = {
    id: Math.floor(Date.now() + Math.random()),
    title: todoVal,
    isCompleted: false
  };

  Todos.push(newTodo);
  RenderingToDo(newTodo);
  Todoinput.value = "";
})


function RenderingToDo(todo: ToDo) {
  const li = document.createElement('li');
  li.classList.add('mb-2', 'todoLi');
  if (todo.isCompleted) {
    li.classList.add('completed');
  }

  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('accent-[#8B322C]', 'mr-1');
  checkbox.checked = todo.isCompleted;
  checkbox.addEventListener('change', () => {
    todo.isCompleted = checkbox.checked;
    if (todo.isCompleted) {
      li.classList.add('completed');
    } else {
      li.classList.remove('completed');
    }
    saveTodoLocalStorage();
  });

  const TodoTitle = document.createElement('span');
  TodoTitle.classList.add('cursor-pointer');
  TodoTitle.innerText = todo.title;

  const DeleteButton = document.createElement('button');
  DeleteButton.classList.add('bg-[#4793AF]', 'py-1', 'px-1', 'rounded-md', 'hover:bg-[#377288]', 'ml-2', 'text-[#FFC470]');
  DeleteButton.innerText = '🗑️';
  DeleteButton.addEventListener('click', () => {
    li.remove();
    Todos = Todos.filter(t => t.id !== todo.id);
    whenNoTodo();
    saveTodoLocalStorage();
  });

  li.append(label, DeleteButton);
  label.append(checkbox, TodoTitle);
  todoList.append(li);
  whenNoTodo();
  saveTodoLocalStorage();
}