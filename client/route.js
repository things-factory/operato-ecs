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
  }
}
