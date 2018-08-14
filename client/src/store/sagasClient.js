function searchByName(query) {
  return fetch(`/api/personbyname?name=${query}`, {
    accept: 'application/json',
  }).then(checkStatus)
    .then(parseJSON);
}

function searchByEmail(email) {
  return fetch(`/api/personbyemail?email=${email}`, {
    accept: 'application/json',
  }).then(checkStatus)
    .then(parseJSON);
}

function searchAportes(id_investidor) {
  return fetch(`/api/aportebyinvestor?id_investidor=${id_investidor}`, {
    accept: 'application/json',
  }).then(checkStatus)
    .then(parseJSON);
}

function searchMoedas() {
  return fetch(`/api/moedas`, {
    accept: 'application/json',
  }).then(checkStatus)
    .then(parseJSON);
}

function savePerson(person) {
  return fetch(`/api/pessoas`, {
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(person)
  }).then(checkStatus)
    .then(parseJSON)
    .catch(error => {
      return {
        error: true,
        errorMessage: error.status
      }
    });
}

function saveAporte(aporte) {
  return fetch(`/api/aportes`, {
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(aporte)
  }).then(checkStatus)
    .then(parseJSON)
    .catch(error => {
      return {
        error: true,
        errorMessage: error.status
      }
    });
}

function deleteAporte(id_aporte) {
  return fetch(`/api/aportes/${id_aporte}`, {
    method: 'delete',
    accept: 'application/json',
  }).then(checkStatus)
    .then(parseJSON);
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(response.statusText);
    error.status = response.statusText;
    error.response = response;
    throw error;
  }
}

function parseJSON(response) {
  const resp = response.json();
  return resp;
}

const Client = {
  searchByName,
  searchByEmail,
  savePerson,
  searchMoedas,
  saveAporte,
  searchAportes,
  deleteAporte
};

export default Client;
