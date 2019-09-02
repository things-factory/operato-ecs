import { html } from 'lit-html'
import { store, navigate } from '@things-factory/shell'
import { appendViewpart, VIEWPART_POSITION } from '@things-factory/layout-base'
import { ADD_MORENDA } from '@things-factory/more-base'

import './viewparts/menu'
import sheets from './reducers/sheets'

export default function bootstrap() {
  store.addReducers({
    sheets
  })

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

  appendViewpart({
    name: 'popup-part',
    viewpart: {
      show: false,
      hovering: 'edge',
      backdrop: true
    },
    position: VIEWPART_POSITION.NAVBAR
  })

  /* add sheet management page morenda */
  store.dispatch({
    type: ADD_MORENDA,
    morenda: {
      icon: html`
        <mwc-icon>view_list</mwc-icon>
      `,
      name: html`
        <i18n-msg msgid="text.sheet management"></i18n-msg>
      `,
      action: () => {
        navigate('sheet')
      }
    }
  })
}
