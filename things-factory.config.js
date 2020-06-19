import bootstrap from './client/bootstrap'
import route from './client/route'

export default {
  bootstrap,
  routes: [
    {
      tagname: 'home-dashboard',
      page: 'dashboard'
    },
    {
      tagname: 'lite-menu-page',
      page: 'lite-menu'
    },
    {
      tagname: 'system-user',
      page: 'users'
    },
    {
      tagname: 'connection-page',
      page: 'connection'
    },
    {
      tagname: 'scenario-page',
      page: 'scenario'
    },
    {
      tagname: 'ecs-board-viewer-page',
      page: 'board-viewer'
    }
  ],
  route
}
