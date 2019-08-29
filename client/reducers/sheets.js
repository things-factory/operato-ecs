const INITIAL_STATE = {
  sheets: []
}

const sheets = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_SHEETS':
      return {
        ...state,
        sheets: action.sheets
      }

    default:
      return state
  }
}

export default sheets
