export default function route(page) {
  switch (page) {
    case '':
      return '/dashboard'

    case 'sheet':
      import('./pages/sheet')
      return page

    case 'dashboard':
      import('./pages/board/dashboard')
      return page

    case 'users':
      import('./pages/system/system-user')
      return page

    case 'connection':
      import('./pages/connection')
      return page

    case 'scenario':
      import('./pages/scenario')
      return page

    case 'step':
      import('./pages/step')
      return page
  }
}
