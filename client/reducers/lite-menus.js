const INITIAL_STATE = {
  liteMenus: []
}

const liteMenus = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_LITE_MENUS':
      return {
        ...state,
        liteMenus: action.liteMenus
      }

    default:
      return state
  }
}

export default liteMenus
