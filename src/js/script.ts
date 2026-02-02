import '../css/style.css'
import { getElementById } from './utils/dom'
import {
  appendTodoList,
  getNewTodo,
  removeTodoListElement,
  Todo,
} from './utils/todo'

let todoList: Todo[] = []

document.addEventListener('DOMContentLoaded', () => {
  console.log('HELLO')
  const registerButton = getElementById('register')
  registerButton.addEventListener('click', () => {
    //新しいTODOをDOM空取得して、todoListに追加する
    todoList = [...todoList, getNewTodo()]
    //TODO一覧を表示する
    removeTodoListElement()

    appendTodoList(todoList)
  })
})
