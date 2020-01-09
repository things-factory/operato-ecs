import { html } from 'lit-html'
import { store, navigate } from '@things-factory/shell'
import { appendViewpart, toggleOverlay, VIEWPART_POSITION, TOOL_POSITION } from '@things-factory/layout-base'
import { APPEND_APP_TOOL } from '@things-factory/apptool-base'
import { ADD_MORENDA } from '@things-factory/more-base'
import { ADD_SETTING } from '@things-factory/setting-base'
import { auth } from '@things-factory/auth-base'

import './viewparts/menu'
import './viewparts/dashboard-setting-let'

import sheets from './reducers/sheets'
import dashboard from './reducers/dashboard-settings'

import { UPDATE_DASHBOARD_SETTINGS } from './actions/dashboard-settings'
import { fetchDashboardSettings } from './viewparts/fetch-dashboard-settings'

import { registerEditor, registerRenderer, TextRenderer } from '@things-factory/grist-ui'

// import { ConnectorSelector } from '@things-factory/integration-ui'
// import { ConnectionSelector } from '@things-factory/integration-ui'
// import { TaskTypeSelector } from '@things-factory/integration-ui'
// import { JsonGristEditor } from '@things-factory/integration-ui'
// import { ParametersEditor } from '@things-factory/integration-ui'

console.log(`
▄▄▄▄                         ▄▄▄▄▄  ▄▄▄     
▓   ▓      ▄         ▄       ▓     ▓   ▀
▓▓▓▓   ▄▄  ▓▄▄   ▄▄  ▓▄▄  ▄  ▓▓▓▓  ▀▀▄▄ 
▓   ▓ ▓  ▓ ▓  ▓ ▓  ▓ ▓       ▓     ▄   ▓
▀    ▀ ▀▀  ▀▀▀   ▀▀  ▀▀▀     ▀▀▀▀▀  ▀▀▀ 
`)

export default function bootstrap() {

  store.addReducers({
    sheets,
    dashboard
  })

  /* 사용자 signin/signout 에 따라서, setting 변경 */
  auth.on('profile', async () => {
    // fetch res-app settings
    var settings = await fetchDashboardSettings()

    store.dispatch({
      type: UPDATE_DASHBOARD_SETTINGS,
      settings: settings.reduce((settings, setting) => {
        settings[setting.name] = setting
        return settings
      }, {})
    })
  })

  /* add hamburger tool */
  store.dispatch({
    type: APPEND_APP_TOOL,
    tool: {
      template: html`
        <mwc-icon
          @click=${e =>
            toggleOverlay('menu-part', {
              backdrop: true
            })}
          >view_headline</mwc-icon
        >
      `,
      position: TOOL_POSITION.FRONT_END
    }
  })

  appendViewpart({
    name: 'menu-part',
    viewpart: {
      resizable: true,
      hovering: 'edge',
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

  store.dispatch({
    type: ADD_MORENDA,
    morenda: {
      icon: html`
        <mwc-icon>view_list</mwc-icon>
      `,
      name: html`
        <i18n-msg msgid="text.user management"></i18n-msg>
      `,
      action: () => {
        navigate('users')
      }
    }
  })

  store.dispatch({
    type: ADD_MORENDA,
    morenda: {
      icon: html`
        <mwc-icon>device_hub</mwc-icon>
      `,
      name: html`
        <i18n-msg msgid="text.connection"></i18n-msg>
      `,
      action: () => {
        navigate('connection')
      }
    }
  })

  store.dispatch({
    type: ADD_MORENDA,
    morenda: {
      icon: html`
        <mwc-icon>format_list_numbered</mwc-icon>
      `,
      name: html`
        <i18n-msg msgid="text.scenario"></i18n-msg>
      `,
      action: () => {
        navigate('scenario')
      }
    }
  })

  store.dispatch({
    type: ADD_SETTING,
    setting: {
      seq: 20,
      template: html`
        <dashboard-setting-let></dashboard-setting-let>
      `
    }
  })
}
