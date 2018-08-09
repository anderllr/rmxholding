import { call, put, takeEvery } from 'redux-saga/effects'
import Client from './sagasClient';
import {
  changeSearchData,
  changeSelectedPerson,
  changeMoedas,
  changeSelectedAporte,
  changeAportes,
  deleteAporte
} from './actions'


function* fetchSearchData(action) {
  const searchData = yield call(Client.searchByName, action.payload.firstName);

  const result = yield put(changeSearchData(searchData));

  // if it is from a redux-action, we get an object with error set not a thrown error
  if (result !== undefined) {
    const { error } = result;
    if (error) {
      throw result;
    }
  }
  return result;
}

function* fetchSelectedPerson(action) {

  let email = action.payload.email ? action.payload.email : ''
  const searchPerson = yield call(Client.searchByEmail, email);
  const result = yield put(changeSelectedPerson(searchPerson[0]));

  // if it is from a redux-action, we get an object with error set not a thrown error
  if (result !== undefined) {
    const { error } = result;
    if (error) {
      throw result;
    }
  }
  return result;
}

function* fetchAportes(action) {

  let id_investidor = action.payload.id_investidor ? action.payload.id_investidor : 0
  const searchAportes = yield call(Client.searchAportes, id_investidor);
  const result = yield put(changeAportes(searchAportes));

  // if it is from a redux-action, we get an object with error set not a thrown error
  if (result !== undefined) {
    const { error } = result;
    if (error) {
      throw result;
    }
  }
  return result;
}

function* fetchMoedas(action) {
  const moedas = yield call(Client.searchMoedas);
  const result = yield put(changeMoedas(moedas));

  // if it is from a redux-action, we get an object with error set not a thrown error
  if (result !== undefined) {
    const { error } = result;
    if (error) {
      throw result;
    }
  }
  return result;
}

function* fetchSavePerson(action) {
  let id_pessoa = action.payload.id_pessoa;
  let result = yield call(Client.savePerson, action.payload);
  if (id_pessoa === 0) {
    const person = { ...action.payload };
    person.id_pessoa = result[0].id_pessoa;
    yield put(changeSelectedPerson(person));
  }
  // if it is from a redux-action, we get an object with error set not a thrown error
  if (result !== undefined) {
    const { error } = result;
    if (error) {
      throw result;
    }
  }
  return result;
}

function* fetchSaveAporte(action) {
  let id_aporte = action.payload.id_aporte;
  let result = yield call(Client.saveAporte, action.payload);
  if (id_aporte === 0) {
    const aporte = { ...action.payload };
    aporte.id_aporte = result[0].id_aporte;
    yield put(changeSelectedAporte(aporte));
  }
  // if it is from a redux-action, we get an object with error set not a thrown error
  if (result !== undefined) {
    const { error } = result;
    if (error) {
      throw result;
    }
  }
  return result;
}

function* fetchDeleteAporte(action) {
  console.log('Action: ', action);
  let id_aporte = action.payload.id_aporte;
  let result = yield call(Client.deleteAporte, id_aporte);
  yield put(deleteAporte(id_aporte));

  // if it is from a redux-action, we get an object with error set not a thrown error
  if (result !== undefined) {
    const { error } = result;
    if (error) {
      throw result;
    }
  }
  return result;
}
/*
function* watchFetchSearchData() {
  yield takeEvery("FETCH_SEARCH_DATA", fetchSearchData);
}
*/
const rootSaga = function* () {
  yield takeEvery('FETCH_SEARCH_DATA', fetchSearchData);
  yield takeEvery('FETCH_SELECTED_PERSON', fetchSelectedPerson);
  yield takeEvery('FETCH_SAVE_PERSON', fetchSavePerson);
  yield takeEvery('FETCH_SAVE_APORTE', fetchSaveAporte);
  yield takeEvery('FETCH_MOEDAS', fetchMoedas);
  yield takeEvery('FETCH_APORTES', fetchAportes);
  yield takeEvery('DELETE_APORTE', fetchDeleteAporte);
};

export default rootSaga;
