import { html } from 'lit-html'

import { appendViewpart, VIEWPART_POSITION } from '@things-factory/layout-base'
import './viewparts/menu'

export default function bootstrap() {
  appendViewpart({
    name: 'menu-part',
    viewpart: {
      show: true,
      template: html`
        <menu-part></menu-part>
      `
    },
    position: VIEWPART_POSITION.NAVBAR
  })
}
