import { PromiseStorage } from 'Util/promiseStorage';

export const CLEAR_STORE = 'CLEAR_STORE';
export const NOOP = 'NOOP';

function cleanIfNewDay() {
  return async function(dispatch){
    const currentDay = new Date().getDate();
    const lastDay = await PromiseStorage.get('lastDayUpdated').then(res => res.lastDayUpdated);

    if (currentDay !== lastDay) {
      await PromiseStorage.clear();
      PromiseStorage.set({lastDayUpdated: currentDay});
      dispatch(clean(currentDay));
    } else {
      dispatch({
        type: 'NOOP'
      });
    }
  };
}

const clean = function(day){
  return {
    type: CLEAR_STORE,
    action: {
      lastDayUpdated: day
    }
  };
};

export default cleanIfNewDay;
