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
 * DOMにTODO一覧を表示する
 */

export const appendTodoList = (
  _todoList: Todo[],
  _filterWord: string,
  deleteTodo: (id: number) => void
) => {
  _todoList
    .filter(
      (todo) =>
        todo.name.includes(_filterWord) || todo.person.includes(_filterWord)
    )
    .forEach((todo) => {
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

      const deleteBtnInMenu = createElement('button', '削除')
      deleteBtnInMenu.addEventListener('click', () => deleteTodo(todo.id))
      menuCurtain.appendChild(deleteBtnInMenu)

      const updateBtnInMenu = createElement('button', '更新')
      menuCurtain.appendChild(updateBtnInMenu)

      const nextStageBtnInMenu = createElement('button', '次へ')
      menuCurtain.appendChild(nextStageBtnInMenu)

      //メニューを開閉する
      triggerBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        menuCurtain.classList.toggle('is-open')
      })

      //削除ボタン
      // const deleteButton = createElement('button', '削除')
      //                                   ここがコールバック関数
      //                                     ↓
      // deleteButton.addEventListener('click', () => deleteTodo(todo.id))

      //---------------------------------------------------------------------
      //以下は変数が見えないバグが出るコード

      // deleteButton.addEventListener("click", () => {
      //   //todoのidが一致しないものを新たな表にtodoListに入れる（一致した行はなくなる）
      //   _todoList = _todoList.filter(_todo => _todo.id !== todo.id)
      //   //一度もとの表を消す
      //   removeTodoListElement()
      //   //行を削除した後の表を再構築する
      //   appendTodoList(_todoList)
      // })
      //---------------------------------------------------------------------

      // const deleteButtonTd = createElement('td')
      // deleteButtonTd.appendChild(deleteButton)

      const tr = createElement('tr')
      tr.appendChild(nameTd)
      tr.appendChild(personTd)
      tr.appendChild(deadlineTd)
      tr.appendChild(tdMenu)

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

/**
 * ソートメニューの開閉機能
 * 画面内の全ての `.sort-trigger` ボタンを対象にクリックイベントを設定し、
 * 隣接するメニューの表示/非表示を切り替えます。
 * 他のメニューが開いている場合は、それを閉じてから対象のメニューを開きます。
 * * @example
 * // 他のファイルで呼び出す場合
 * initSortMenu();
 * * @returns {void} 返り値はありません
 */
export const initSortMenu = (): void => {
  document
    .querySelectorAll<HTMLButtonElement>('.sort-trigger')
    .forEach((btn) => {
      btn.addEventListener('click', (e: Event) => {
        e.stopPropagation()

        //もし、HTMLで次の要素になければ何もしない（null防止）
        const menu = btn.nextElementSibling as HTMLElement | null
        if (!menu) return

        //周りの開いているメニューを閉じる指示
        document
          .querySelectorAll<HTMLElement>('.sort-menu-curtain.is-open')
          .forEach((m) => {
            if (m !== menu) {
              m.classList.remove('is-open')
            }
          })

        menu.classList.toggle('is-open')
      })
    })
}

/**
 * 画面のどこかをクリックしたときに、開いているメニューをすべて閉じます。
 */
export const initOutsideClickCloser = (): void => {
  document.addEventListener('click', () => {
    document
      .querySelectorAll<HTMLElement>(
        '.menu-curtain.is-open, .sort-menu-curtain.is-open'
      )
      .forEach((c) => {
        c.classList.remove('is-open')
      })
  })
}
