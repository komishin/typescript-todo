/**
 * アプリケーション・メインロジック (main.ts)
 */

import '../css/style.css'
import { getElementById } from './utils/dom'
import {
  appendTodoList,
  getNewTodo,
  initOutsideClickCloser,
  initSortButtons,
  initSortMenu,
  sortTodoList,
  Todo,
  TodoStatus,
} from './utils/todo'

/** アプリ全体で管理するデータ */
let todoList: Todo[] = []

/** ステータスごとの絞り込みワードを管理 */
let filterWords: Record<TodoStatus, string> = {
  todo: '',
  doing: '',
  done: ''
}

/**
 * データの変更をDOMに反映させるための司令塔
 */
const render = () => {
  /**
   * 【変更箇所】第5引数に render 関数自体を渡すようにしました
   * 【理由】todo.ts 側で編集・保存が終わった直後に、この render() を実行させて
   * 最新の状態を画面に反映させる必要があるためです。
   */
  appendTodoList(todoList, filterWords, deleteTodo, moveTodo, render)
}

/**
 * 特定の列（ステータス）のソートを実行
 */
const handleSort = (key: keyof Todo, order: 'asc' | 'desc', status: TodoStatus) => {
  todoList = sortTodoList(todoList, key, order, status)
  render()
}

/**
 * TODOの状態（ステージ）を更新
 */
const moveTodo = (id: number, nextStatus: TodoStatus) => {
  todoList = todoList.map((todo) =>
    todo.id === id ? { ...todo, status: nextStatus } : todo
  )
  render()
}

/**
 * TODOを削除
 */
const deleteTodo = (id: number) => {
  todoList = todoList.filter((todo) => todo.id !== id)
  render()
}

/**
 * アプリケーションの初期化
 */
document.addEventListener('DOMContentLoaded', () => {
  getElementById('register').addEventListener('click', () => {
    todoList = [...todoList, getNewTodo()]
    render()
  })

  document.querySelectorAll<HTMLInputElement>('.js-todo-filter').forEach((input) => {
    input.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement
      const status = target.dataset.status as TodoStatus
      filterWords[status] = target.value
      render()
    })
  })

  initSortMenu()
  initSortButtons(handleSort)
  initOutsideClickCloser()
})