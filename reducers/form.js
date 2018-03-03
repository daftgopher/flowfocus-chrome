const form = (state = {active: false}, action) => {
  switch(action.type){
    case 'TOGGLE_FORM':
      return {...state, active: !state.active};
    case 'CLEAR_FORM':
      return state;
    default:
      return state;
  }
};

export default form;
