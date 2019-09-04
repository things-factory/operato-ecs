import bootstrap from './client/bootstrap'
import route from './client/route'

export default {
  bootstrap,
  routes: [
    {
      tagname: 'home-page',
      page: 'home'
    },
    {
      tagname: 'sheet-page',
      page: 'sheet'
    },
    {
      tagname: 'show-board',
      page: 'show-board'
    },
    {
      tagname: 'system-user',
      page: 'users'
    }
  ],
  route
}
