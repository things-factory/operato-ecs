export default function route(page) {
  switch (page) {
    case '':
      return '/dashboard'

    case 'lite-menu':
      import('./pages/lite-menu')
      return page

    case 'dashboard':
      import('./pages/board/dashboard')
      return page

    case 'users':
      import('./pages/system/system-user')
      return page

    case 'board-viewer':
      import('./pages/board/ecs-board-viewer-page')
      return page

    case 'printable-board-viewer':
      import('./pages/board/printable-board-viewer-page')
      return page
  }
}
