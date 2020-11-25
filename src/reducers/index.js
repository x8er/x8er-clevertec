function reducer(state, action) {
  switch (action.type) {
    case "SAVE_VALUE":
      state.form[action.name] = action.value;
      return { ...state };
    case "NOTIFY":
      return { ...state, notify: action.notify };
    case "CONTROLLER":
      return { ...state, controller: action.controller };
    default:
      return { ...state };
  }
}

export default reducer;
