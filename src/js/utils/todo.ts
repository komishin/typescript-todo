/**
 * TODOアプリのデータ操作・UI描画ロジック (utils/todo.ts)
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
 */
export const appendTodoList = (
  _todoList: Todo[],
  _filterWords: Record<TodoStatus, string>,
  deleteTodo: (id: number) => void,
  moveTodo: (id: number, nextStatus: TodoStatus) => void,
  /**
   * 【変更箇所】第5引数を changeTodo ではなく onSave（render関数）に変更
   * 【理由】描画関数が編集関数を直接抱え込むより、完了後の通知（コールバック）を受け取る方が
   * script.ts との連携がスムーズになるためです。
   */
  onSave: () => void
) => {
  ;['todo-list', 'doing-list', 'done-list'].forEach((id) => {
    const tb = document.getElementById(id)
    if (tb) while (tb.firstChild) tb.firstChild.remove()
  })

  _todoList.forEach((todo) => {
    const word = _filterWords[todo.status]
    if (!todo.name.includes(word) && !todo.person.includes(word)) return

    const nameTd = createElement('td', todo.name)
    const personTd = createElement('td', todo.person)
    const deadlineTd = createElement('td', todo.deadline)

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

    if (todo.status !== 'done') {
      const btnText = todo.status === 'todo' ? 'Doingへ' : 'Doneへ'
      const nextStageBtnInMenu = createElement('button', btnText)
      nextStageBtnInMenu.addEventListener('click', () => {
        const next = todo.status === 'todo' ? 'doing' : 'done'
        moveTodo(todo.id, next)
      })
      menuCurtain.appendChild(nextStageBtnInMenu)
    }

    /**
     * 【変更箇所】「更新」ボタンにクリックイベントを追加
     * 【理由】これまではボタンを作っただけで、押しても編集モードに切り替わらなかったためです。
     */
    const updateBtnInMenu = createElement('button', '更新')
    updateBtnInMenu.addEventListener('click', () => {
      // 編集に必要な「リスト本体」と「保存後の再描画関数」を渡して実行
      changeTodo(todo.id, tr, _todoList, onSave)
    })
    menuCurtain.appendChild(updateBtnInMenu)

    const deleteBtnInMenu = createElement('button', '削除')
    deleteBtnInMenu.addEventListener('click', () => deleteTodo(todo.id))
    menuCurtain.appendChild(deleteBtnInMenu)

    triggerBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      menuCurtain.classList.toggle('is-open')
    })

    const tr = createElement('tr') as HTMLTableRowElement
    tr.append(nameTd, personTd, deadlineTd, tdMenu)

    const tBodyId = `${todo.status}-list`
    const tBody = getElementById(tBodyId)
    tBody.appendChild(tr)
  })
}

/**
 * 編集モードへの切り替えと保存処理
 */
export const changeTodo = (
  id: number,
  trElem: HTMLTableRowElement,
  /**
   * 【変更箇所】引数に _todoList と onSave を追加
   * 【理由】todo.ts内の「data.todoList」は空なので、main.tsから渡された「本物のデータ」を
   * 操作対象にする必要があるからです。
   */
  _todoList: Todo[],
  onSave: () => void
): void => {
  if (trElem.classList.contains('editing')) return
  trElem.classList.add('editing')

  // 本物のリスト（_todoList）から対象を探す
  const task = _todoList.find((t) => t.id === id)
  if (!task) return

  const tds = trElem.querySelectorAll('td')

  const nameInput = document.createElement('input')
  nameInput.value = task.name
  const personInput = document.createElement('input')
  personInput.value = task.person
  const deadlineInput = document.createElement('input')
  deadlineInput.type = 'date'
  deadlineInput.value = task.deadline

  tds[0].textContent = ''
  tds[0].appendChild(nameInput)
  tds[1].textContent = ''
  tds[1].appendChild(personInput)
  tds[2].textContent = ''
  tds[2].appendChild(deadlineInput)

  const menuTd = tds[3] as HTMLTableCellElement
  menuTd.innerHTML = ''

  /**
   * 【変更箇所】createElement('deleteBtnInMenu') を 'button' に修正
   * 【理由】HTMLに存在しないタグ名が指定されており、ボタンが表示されなかったためです。
   */
  const saveBtn = document.createElement('button')
  saveBtn.textContent = '保存'
  saveBtn.classList.add('save-button')

  saveBtn.addEventListener('click', (): void => {
    task.name = nameInput.value
    task.person = personInput.value
    task.deadline = deadlineInput.value

    trElem.classList.remove('editing')

    /**
     * 【変更箇所】完了後に onSave() を実行するように変更
     * 【理由】データの書き換えが終わったことを main.ts に知らせて再描画させるためです。
     */
    onSave()
  })
  menuTd.appendChild(saveBtn)
}

/**
 * その他UI機能（ここから下は変更ありません）
 */
export const initSortMenu = (): void => {
  document
    .querySelectorAll<HTMLButtonElement>('.sort-trigger')
    .forEach((btn) => {
      btn.addEventListener('click', (e: Event) => {
        e.stopPropagation()
        const menu = btn.nextElementSibling as HTMLElement | null
        if (!menu) return
        document
          .querySelectorAll<HTMLElement>('.sort-menu-curtain.is-open')
          .forEach((m) => {
            if (m !== menu) m.classList.remove('is-open')
          })
        menu.classList.toggle('is-open')
      })
    })
}

export const initOutsideClickCloser = (): void => {
  document.addEventListener('click', () => {
    document
      .querySelectorAll<HTMLElement>(
        '.menu-curtain.is-open, .sort-menu-curtain.is-open'
      )
      .forEach((c) => c.classList.remove('is-open'))
  })
}

export const sortTodoList = (
  list: Todo[],
  key: keyof Todo,
  order: 'asc' | 'desc',
  status: TodoStatus
): Todo[] => {
  const targetGroup = list
    .filter((t) => t.status === status)
    .sort((a, b) => {
      const valA = a[key]
      const valB = b[key]
      if (valA < valB) return order === 'asc' ? -1 : 1
      if (valA > valB) return order === 'asc' ? 1 : -1
      return 0
    })
  const otherGroup = list.filter((t) => t.status !== status)
  return [...otherGroup, ...targetGroup]
}

export const initSortButtons = (
  onSort: (key: keyof Todo, order: 'asc' | 'desc', status: TodoStatus) => void
): void => {
  document.querySelectorAll('.js-apply-sort').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLButtonElement
      onSort(
        target.dataset.key as keyof Todo,
        target.dataset.order as 'asc' | 'desc',
        target.dataset.status as TodoStatus
      )
    })
  })
}

/**
 * 【変更箇所】ファイル末尾の deleteTodo, moveTodo のスタブ（未実装関数）を削除しました
 * 【理由】main.ts 側で定義された正しい関数を引数経由で使っているため、これらは不要だからです。
 */
