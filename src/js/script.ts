import '../css/style.css'
import { getElementById, getInputElementById } from './utils/dom'
import {
  appendTodoList,
  getNewTodo,
  initOutsideClickCloser,
  initSortMenu,
  removeTodoListElement,
  Todo,
} from './utils/todo'

let todoList: Todo[] = []
let filterWord: string = ""

document.addEventListener('DOMContentLoaded', () => {
  //登録ボタン押下時の処理
  const registerButton = getElementById('register')
  registerButton.addEventListener('click', () => {
    //新しいTODOをDOM空取得して、todoListに追加する
    todoList = [...todoList, getNewTodo()]
    //TODO一覧を表示する
    removeTodoListElement()

    appendTodoList(todoList, filterWord, deleteTodo)
  })

  //絞り込み入力時の処理
  const filterInput = getInputElementById('todo-filter')
  filterInput.addEventListener('input', () => {
    filterWord = filterInput.value
        //TODO一覧を表示する
    removeTodoListElement()

    appendTodoList(todoList, filterWord, deleteTodo)
  })

  initSortMenu();

  initOutsideClickCloser();
})

/**
 *TODOを削除する
 *この処理は、このfileでしかできない
 *スコープのため、ここでしかtodoListの変数が見えない
 * @param id
 */
const deleteTodo = (id: number) => {
  todoList = todoList.filter((todo) => todo.id !== id)
  removeTodoListElement()

  appendTodoList(todoList, filterWord, deleteTodo)
}
