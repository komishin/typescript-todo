/**
 * todoの型定義
 */

import { createElement, getElementById, getInputElementById } from './dom'

export type Todo = {
  id: number
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
  id: Date.now(),
  name: getInputElementById('new-todo-name').value,
  person: getInputElementById('new-person').value,
  deadline: getInputElementById('new-deadline').value,
})

/**
 * DOMにTODO一愛rンを表示する
 */

export const appendTodoList = (
  _todoList: Todo[],
  deleteTodo: (id: number) => void
) => {
  _todoList.forEach((todo) => {
    const nameTd = createElement('td', todo.name)
    const personTd = createElement('td', todo.person)
    const deadlineTd = createElement('td', todo.deadline)

    //削除ボタン
    const deleteButton = createElement('button', '削除')
    //                                   ここがコールバック関数
    //                                     ↓
    deleteButton.addEventListener('click', () => deleteTodo(todo.id))

    //以下は変数が見えないバグが出るコード

    // deleteButton.addEventListener("click", () => {
    //   //todoのidが一致しないものを新たな表にtodoListに入れる（一致した行はなくなる）
    //   _todoList = _todoList.filter(_todo => _todo.id !== todo.id)
    //   //一度もとの表を消す
    //   removeTodoListElement()
    //   //行を削除した後の表を再構築する
    //   appendTodoList(_todoList)
    // })
    const deleteButtonTd = createElement('td')
    deleteButtonTd.appendChild(deleteButton)

    const tr = createElement('tr')
    tr.appendChild(nameTd)
    tr.appendChild(personTd)
    tr.appendChild(deadlineTd)
    tr.appendChild(deleteButtonTd)

    const tBody = getElementById('todo-list')
    tBody.appendChild(tr)
  })
}

/**
 * DOM一覧をすべて削除する
 */
export const removeTodoListElement = () => {
  const tBody = getElementById('todo-list')
  while (tBody.firstChild) {
    //tBodyがなくなるまで
    tBody.firstChild.remove()
  }
}
