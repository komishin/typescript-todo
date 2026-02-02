import '../css/style.css'
import { getElementById } from './utils/dom'
import { appendTodoList, getNewTodo, Todo } from './utils/todo'

let todoList: Todo[] = []

document.addEventListener('DOMContentLoaded', () => {
  console.log('HELLO')
  const registerButton = getElementById('register')
  registerButton.addEventListener('click', () => {
    //新しいTODOをDOMから取得する
    todoList.push(getNewTodo())
    console.log(todoList)
    //TODO一覧を表示する
    appendTodoList(todoList)
  })
})
