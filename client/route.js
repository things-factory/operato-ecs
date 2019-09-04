export default function route(page) {
  switch (page) {
    case '':
      return '/home'

    case 'home':
      import('./pages/home')
      return page

    case 'sheet':
      import('./pages/sheet')
      return page

    case 'show-board':
      import('./pages/board-viewer')
      return page

    case 'users':
      import('./pages/system/system-user')
      return page
  }
}
