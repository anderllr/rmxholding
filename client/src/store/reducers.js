var initialState = {
  searchData: [],
  selectedEmail: '',
  selectedPerson: {
    id_pessoa: 0,
    nome_pessoa: '',
    rg: '',
    org_emissor: '',
    dt_emissao: '1900-01-01',
    cpf: '',
    pai_pessoa: '',
    mae_pessoa: '',
    dt_nasc: '1900-01-01',
    est_civil: '',
    profissao: '',
    email: '',
    endereco: '',
    numero: '',
    complemento: '',
    cep: '',
    bairro: '',
    cidade: '',
    estado: '',
    tel_celular: '',
    tel_outro: '',
    banco: '',
    agencia: '',
    tp_conta: 'CORRENTE',
    conta: '',
    nacionalidade: 'BRASILEIRA',
    passaporte: '',
    dt_emis_pass: '1900-01-01',
    dt_venc_pass: '1900-01-01',
    gestor: 'N',
    corretor: 'N'
  },
  selectedAporte: {
    id_aporte: 0,
    id_investidor: 0,
    id_gestor: 0,
    id_corretor: 0,
    dt_aporte: '1900-01-01',
    vl_deposito: 0.05,
    vl_retorno: 0,
    id_moeda: 1
  },
  personResult: {
    error: false,
    errorMessage: ''
  },
  aporteResult: {
    error: false,
    errorMessage: ''
  },
  aportes: [],
  moedas: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_SEARCH_DATA':
      return {
        ...state,
        searchData: action.data
      }
    case 'CHANGE_MOEDAS':
      return {
        ...state,
        moedas: action.data
      }
    case 'CHANGE_APORTES':
      return {
        ...state,
        aportes: action.data
      }
    case 'CHANGE_SELECTED_PERSON':
      return {
        ...state,
        selectedPerson: action.person ? action.person : initialState.selectedPerson
      }
    case 'CHANGE_SELECTED_APORTE':
      return {
        ...state,
        selectedAporte: action.aporte ? action.aporte : initialState.selectedAporte
      }
    case 'SELECT_EMAIL':
      return {
        ...state,
        selectedEmail: action.email
      }
    case 'NEW_PERSON':
      return {
        ...state,
        selectedPerson: initialState.selectedPerson
      }
    case 'NEW_APORTE':
      return {
        ...state,
        selectedAporte: initialState.selectedAporte
      }
    case 'DELETE_APORTE':
      return {
        ...state,
        aportes: state.aportes.filter(aporte => {
          return aporte.id_aporte !== action.id;
        }),
        selectedAporte: initialState.selectedAporte
      }
    case 'REQUEST_PERSON_ERROR':
      return {
        ...state,
        personResult: action.result
      }
    case 'REQUEST_APORTE_ERROR':
      return {
        ...state,
        aporteResult: action.result
      }
    default:
      return state
  }
}

export default reducer;

