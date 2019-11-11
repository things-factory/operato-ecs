import { html } from 'lit-html'
import { store, navigate } from '@things-factory/shell'
import { appendViewpart, VIEWPART_POSITION } from '@things-factory/layout-base'
import { ADD_MORENDA } from '@things-factory/more-base'
import { ADD_SETTING } from '@things-factory/setting-base'
import { auth } from '@things-factory/auth-base'

import './viewparts/menu'
import './viewparts/dashboard-setting-let'

import sheets from './reducers/sheets'
import dashboard from './reducers/dashboard-settings'

import { UPDATE_DASHBOARD_SETTINGS, CLEAR_DASHBOARD_SETTINGS } from './actions/dashboard-settings'
import { fetchDashboardSettings } from './viewparts/fetch-dashboard-settings'

export default function bootstrap() {
  store.addReducers({
    sheets,
    dashboard
  })

  /* 사용자 signin/signout 에 따라서, setting 변경 */
  auth.on('signin', async () => {
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

  auth.on('signout', async () => {
    // clear res-app settings
    store.dispatch({
      type: CLEAR_DASHBOARD_SETTINGS
    })
  })

  appendViewpart({
    name: 'menu-part',
    viewpart: {
      show: true,
      resizable: true,
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
        <mwc-icon>view_list</mwc-icon>
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
    type: ADD_SETTING,
    setting: {
      seq: 20,
      template: html`
        <dashboard-setting-let></dashboard-setting-let>
      `
    }
  })
}
