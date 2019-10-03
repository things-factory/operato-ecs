export default function route(page) {
  switch (page) {
    case '':
      return '/dashboard'

    case 'sheet':
      import('./pages/sheet')
      return page

    case 'show-board':
      import('./pages/board/board-viewer')
      return page

    case 'dashboard':
      import('./pages/board/dashboard')
      return page

    case 'users':
      import('./pages/system/system-user')
      return page
  }
}
