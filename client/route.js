export default function route(page) {
  switch (page) {
    case '':
      return '/home'

    case 'home':
      import('./pages/home')
      return page
  }
}
