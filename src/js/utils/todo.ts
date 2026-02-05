/**
 * TODOアプリのデータ操作・UI描画ロジック
 */

import { createElement, getElementById, getInputElementById } from './dom'

/** 状態の定義 */
export type TodoStatus = 'todo' | 'doing' | 'done'

/** TODO1件のデータ定義 */
export type Todo = {
  id: number
  name: string
  person: string
  deadline: string
  status: TodoStatus
}

/**
 * DOMのinput要素から新しいTODOの値を取得する
 * @returns {Todo} 新しいTODOオブジェクト
 */
export const getNewTodo = (): Todo => ({
  id: Date.now(),
  name: getInputElementById('new-todo-name').value,
  person: getInputElementById('new-person').value,
  deadline: getInputElementById('new-deadline').value,
  status: 'todo',
})

/**
 * DOMにTODO一覧を表示する
 * * @param {Todo[]} _todoList 表示対象のTODO配列
 * @param {Record<TodoStatus, string>} _filterWords ステータスごとの絞り込みワード（←ここを修正）
 * @param {(id: number) => void} deleteTodo 削除処理のコールバック
 * @param {(id: number, nextStatus: TodoStatus) => void} moveTodo 移動処理のコールバック
 */
export const appendTodoList = (
  _todoList: Todo[],
  _filterWords: Record<TodoStatus, string>, // パラメーターの型を Record に変更
  deleteTodo: (id: number) => void,
  moveTodo: (id: number, nextStatus: TodoStatus) => void
) => {
  // すべてのtbodyをクリアする
  ;['todo-list', 'doing-list', 'done-list'].forEach((id) => {
    const tb = document.getElementById(id)
    if (tb) while (tb.firstChild) tb.firstChild.remove()
  })

  // データごとにループ処理
  _todoList.forEach((todo) => {
    // --- 修正ポイント：ステータスごとの絞り込み判定 ---
    // そのTODOのステータスに対応する検索ワードを取得
    const word = _filterWords[todo.status]
    
    // 名前にも担当者にも検索ワードが含まれていない場合は表示しない
    if (!todo.name.includes(word) && !todo.person.includes(word)) {
      return
    }

    const nameTd = createElement('td', todo.name)
    const personTd = createElement('td', todo.person)
    const deadlineTd = createElement('td', todo.deadline)

    // 操作メニューの作成
    const menuContainer = document.createElement('div')
    menuContainer.classList.add('todo-menu-container')
    const triggerBtn = document.createElement('button')
    triggerBtn.classList.add('remove-button')
    triggerBtn.textContent = '操作'
    const menuCurtain = document.createElement('div')
    menuCurtain.classList.add('menu-curtain')

    menuContainer.append(triggerBtn, menuCurtain)
    const tdMenu = document.createElement('td')
    tdMenu.appendChild(menuContainer)

    // 「次へ」ボタン
    if (todo.status !== 'done') {
      const btnText = todo.status === 'todo' ? 'Doingへ' : 'Doneへ'
      const nextStageBtnInMenu = createElement('button', btnText)
      nextStageBtnInMenu.addEventListener('click', () => {
        const next = todo.status === 'todo' ? 'doing' : 'done'
        moveTodo(todo.id, next)
      })
      menuCurtain.appendChild(nextStageBtnInMenu)
    }

    const updateBtnInMenu = createElement('button', '更新')
    menuCurtain.appendChild(updateBtnInMenu)

    const deleteBtnInMenu = createElement('button', '削除')
    deleteBtnInMenu.addEventListener('click', () => deleteTodo(todo.id))
    menuCurtain.appendChild(deleteBtnInMenu)

    triggerBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      menuCurtain.classList.toggle('is-open')
    })

    const tr = createElement('tr')
    tr.append(nameTd, personTd, deadlineTd, tdMenu)

    const tBodyId = `${todo.status}-list`
    const tBody = getElementById(tBodyId)
    tBody.appendChild(tr)
  })
}

/**
 * ソートメニューの開閉機能を初期化する
 */
export const initSortMenu = (): void => {
  document.querySelectorAll<HTMLButtonElement>('.sort-trigger').forEach((btn) => {
    btn.addEventListener('click', (e: Event) => {
      e.stopPropagation()
      const menu = btn.nextElementSibling as HTMLElement | null
      if (!menu) return
      document.querySelectorAll<HTMLElement>('.sort-menu-curtain.is-open').forEach((m) => {
        if (m !== menu) m.classList.remove('is-open')
      })
      menu.classList.toggle('is-open')
    })
  })
}

/**
 * 画面外クリックでメニューを閉じる
 */
export const initOutsideClickCloser = (): void => {
  document.addEventListener('click', () => {
    document
      .querySelectorAll<HTMLElement>('.menu-curtain.is-open, .sort-menu-curtain.is-open')
      .forEach((c) => c.classList.remove('is-open'))
  })
}

/**
 * 特定のステータスのデータのみを並び替えた新しい配列を返す
 */
export const sortTodoList = (
  list: Todo[],
  key: keyof Todo,
  order: 'asc' | 'desc',
  status: TodoStatus
): Todo[] => {
  const targetGroup = list.filter((t) => t.status === status).sort((a, b) => {
    const valA = a[key]
    const valB = b[key]
    if (valA < valB) return order === 'asc' ? -1 : 1
    if (valA > valB) return order === 'asc' ? 1 : -1
    return 0
  })
  const otherGroup = list.filter((t) => t.status !== status)
  return [...otherGroup, ...targetGroup]
}

/**
 * ソートボタンにイベントを設定する
 */
export const initSortButtons = (
  onSort: (key: keyof Todo, order: 'asc' | 'desc', status: TodoStatus) => void
): void => {
  const sortButtons = document.querySelectorAll('.js-apply-sort')
  sortButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLButtonElement
      const key = target.dataset.key as keyof Todo
      const order = target.dataset.order as 'asc' | 'desc'
      const status = target.dataset.status as TodoStatus
      onSort(key, order, status)
    })
  })
}
