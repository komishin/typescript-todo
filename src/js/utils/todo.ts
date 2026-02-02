/**
 * todoの型定義
 */

import { createElement, getElementById, getInputElementById } from './dom'

export type Todo = {
  name: string
  person: string
  deadline: string
}

/**
 * DOMのinput要素から新しいTODOの値を取得する
 * @returns Todo
 */

export const getNewTodo = (): Todo => ({
  //returnを使わないで書いている方法（）が決め手
  name: getInputElementById('new-todo-name').value,
  person: getInputElementById('new-person').value,
  deadline: getInputElementById('new-deadline').value,
})

/**
 * DOMにTODO一愛rンを表示する
 */

export const appendTodoList = (todoList: Todo[]) => {
  removeTodoListElement()
  todoList.forEach((todo) => {
    const nameTd = createElement('td', todo.name)
    const personTd = createElement('td', todo.person)
    const deadlineTd = createElement('td', todo.deadline)
    const tr = createElement('tr')
    tr.appendChild(nameTd)
    tr.appendChild(personTd)
    tr.appendChild(deadlineTd)
    const tBody = getElementById('todo-list')
    tBody.appendChild(tr)
  })
}

/**
 * DOM一覧をすべて削除する
 */
const removeTodoListElement = () => {
  const tBody = getElementById('todo-list')
  while (tBody.firstChild) {
    //tBodyがなくなるまで
    tBody.firstChild.remove()
  }
}
