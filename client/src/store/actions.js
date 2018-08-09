export function changeSearchData(data) {
  return {
    type: "CHANGE_SEARCH_DATA",
    data
  }
}

export function changeMoedas(data) {
  return {
    type: "CHANGE_MOEDAS",
    data
  }
}

export function changeAportes(data) {
  return {
    type: "CHANGE_APORTES",
    data
  }
}

export const selectEmail = (email) => ({
  type: 'SELECT_EMAIL',
  email
});

export const changeSelectedPerson = (person) => ({
  type: 'CHANGE_SELECTED_PERSON',
  person
});

export const changeSelectedAporte = (aporte) => ({
  type: 'CHANGE_SELECTED_APORTE',
  aporte
});

export const deleteAporte = (id) => ({
  type: 'DELETE_APORTE',
  id
});

export const newPerson = () => ({ type: 'NEW_PERSON' });

export const newAporte = () => ({ type: 'NEW_APORTE' });