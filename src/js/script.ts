/**
 * アプリケーション・メインロジック
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

/** * ステータスごとの絞り込みワードを管理する
 * @type {Record<TodoStatus, string>}
 */
let filterWords: Record<TodoStatus, string> = {
  todo: '',
  doing: '',
  done: ''
}

/**
 * データの変更をDOMに反映させるための司令塔
 */
const render = () => {
  // filterWords（オブジェクト全体）を渡すように変更
  appendTodoList(todoList, filterWords, deleteTodo, moveTodo)
}

/**
 * 特定の列（ステータス）のソートを実行
 * @param {keyof Todo} key ソート対象の項目名
 * @param {'asc' | 'desc'} order 昇順または降順
 * @param {TodoStatus} status ソート対象のステージ
 */
const handleSort = (key: keyof Todo, order: 'asc' | 'desc', status: TodoStatus) => {
  todoList = sortTodoList(todoList, key, order, status)
  render()
}

/**
 * TODOの状態（ステージ）を更新
 * @param {number} id 更新対象のID
 * @param {TodoStatus} nextStatus 移動先のステータス
 */
const moveTodo = (id: number, nextStatus: TodoStatus) => {
  todoList = todoList.map((todo) =>
    todo.id === id ? { ...todo, status: nextStatus } : todo
  )
  render()
}

/**
 * TODOを削除
 * @param {number} id 削除対象のID
 */
const deleteTodo = (id: number) => {
  todoList = todoList.filter((todo) => todo.id !== id)
  render()
}

/**
 * アプリケーションの初期化
 */
document.addEventListener('DOMContentLoaded', () => {
  // --- 1. 新規登録 ---
  getElementById('register').addEventListener('click', () => {
    todoList = [...todoList, getNewTodo()]
    render()
  })

  // --- 2. 各列の絞り込みイベント ---
  // クラス「js-todo-filter」を持つすべての入力欄を対象にする
  document.querySelectorAll<HTMLInputElement>('.js-todo-filter').forEach((input) => {
    input.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement
      const status = target.dataset.status as TodoStatus // HTMLのdata-statusを取得
      
      // 該当するステータスのキーワードだけを更新
      filterWords[status] = target.value
      render()
    })
  })

  // --- 3. UI機能の初期化 ---
  initSortMenu()
  initSortButtons(handleSort)
  initOutsideClickCloser()
})