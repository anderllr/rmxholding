import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Container, Col, Form,
    FormGroup, Label, Input,
    Button, TabContent, TabPane, Nav,
    NavItem, NavLink, Row
} from 'reactstrap';
import Select from 'react-select';
import SimpleCurrencyInput from 'react-simple-currency';
import moment from 'moment';

import classnames from 'classnames';

import { changeSelectedAporte, newAporte } from '../store/actions';

const requiredFields = [
    'id_investidor',
    'id_gestor',
    'id_corretor',
    'vl_deposito',
    'vl_retorno',
    'dt_aporte'
]

const initialState = {
    activeTab: '1',
    errors: [''],
    selectedInvestor: '',
    selectedGestor: '',
    selectedCorretor: '',
    vl_deposito: 0,
    vl_retorno: 0
};

class Aportes extends Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.toggle = this.toggle.bind(this);
        this.onNewClick = this.onNewClick.bind(this);
        this.selectFields = this.selectFields.bind(this);
        this.state = { ...initialState };
    }

    updateSelect(e, type) {
        let name = '';
        if (type === 'I') {
            this.setState({ selectedInvestor: e });
            name = 'id_investidor';

            this.fetchAportes(e.value);
        } else
            if (type === 'G') {
                this.setState({ selectedGestor: e });
                name = 'id_gestor';
            } else
                if (type === 'C') {
                    this.setState({ selectedCorretor: e });
                    name = 'id_corretor';
                }


        const aporte = { ...this.props.aporte };
        let value = e.value;

        aporte[name] = value;

        this.props.saveAporte(aporte);

        //Clean errors
        this.setState({ errors: [''] });
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    componentWillMount() {
        this.props.fetchMoedas();
        this.props.fetchPessoas({ firstName: '*' });
    }

    fetchAportes = (id_investidor) => {
        this.props.fetchAportes({ id_investidor })
    }

    componentDidMount() {
        const { id_pessoa, nome_pessoa } = this.props.person
        if (id_pessoa > 0) {
            this.setState({
                selectedInvestor: {
                    value: id_pessoa,
                    label: nome_pessoa
                }
            })

            //Salva na props do aporte
            const aporte = { ...this.props.aporte };

            aporte.id_investidor = id_pessoa;

            this.props.saveAporte(aporte);

            //Busca os aportes desse investidor
            this.fetchAportes(id_pessoa);
        } else {
            this.fetchAportes(-1);
        }
    }

    validateFields = () => {
        let errors = [];
        requiredFields.map((field, i) => {
            const value = this.props.aporte[field]
            if ((value === '') || (value === '1900-01-01') || (value === 0)) {
                errors.push(`* Campo (${field}) é obrigatório!`);
            }
        });

        this.setState({ errors });
        return errors.length === 0;
    }

    moneyToProps = async () => {
        let { vl_deposito, vl_retorno } = this.state;

        vl_deposito = !vl_deposito ? 0 : vl_deposito / 100;
        vl_retorno = !vl_retorno ? 0 : vl_retorno / 100;

        const aporte = { ...this.props.aporte };

        aporte.vl_deposito = vl_deposito;
        aporte.vl_retorno = vl_retorno;

        await this.props.saveAporte(aporte);
    }
    onSubmit = async (e) => {
        //prevents full page reload
        e.preventDefault();
        await this.moneyToProps();

        if (this.validateFields()) {
            await this.props.fetchSaveAporte(this.props.aporte);
            await this.fetchAportes(this.props.aporte.id_investidor);
        }
    }

    onNewClick = async () => {
        await this.props.newAporte();
        await this.selectFields();
        await this.fetchAportes(-1);
    }

    onChangeMoney(value, name) {
        //Clean errors
        this.setState({ errors: [''], [name]: value });
    }

    onChange(e) {
        const { target } = e;

        if (target) {
            const aporte = { ...this.props.aporte };
            let value = target.value.toUpperCase();
            if (target.type === 'checkbox')
                value = target.checked ? 'S' : 'N';
            aporte[target.name] = value;

            this.props.saveAporte(aporte);

            //Clean errors
            this.setState({ errors: [''] });
        }
    }

    selectFields() {
        let { id_investidor, id_gestor, id_corretor, vl_deposito, vl_retorno } = this.props.aporte;

        //clean the state
        this.setState({ ...initialState });

        //Pega a pessoa
        const pessoa = this.props.searchData;
        //Ajustando a seleção dos componentes customizados
        if (id_investidor > 0) {
            const selectedInvestor = pessoa.filter((item) => item.id_pessoa === id_investidor).map(({ id_pessoa, nome_pessoa }) => {
                return { value: id_pessoa, label: nome_pessoa }
            });
            this.setState({ selectedInvestor });
        }

        if (id_gestor > 0) {
            const selectedGestor = pessoa.filter((item) => item.id_pessoa === id_gestor).map(({ id_pessoa, nome_pessoa }) => {
                return { value: id_pessoa, label: nome_pessoa }
            });
            this.setState({ selectedGestor });
        }

        if (id_corretor > 0) {
            const selectedCorretor = pessoa.filter((item) => item.id_pessoa === id_corretor).map(({ id_pessoa, nome_pessoa }) => {
                return { value: id_pessoa, label: nome_pessoa }
            });
            this.setState({ selectedCorretor });
        }

        //Ajusta os valores pois o state é local por causa do decimais
        if (vl_deposito > 0) {
            vl_deposito *= 100;
        }

        if (vl_retorno > 0) {
            vl_retorno *= 100;
        }

        this.setState({ vl_deposito, vl_retorno });

    }

    selectAporte = async (aporte) => {
        await this.props.saveAporte(aporte);
        await this.selectFields();
    }

    deleteAporte = async ({ id_aporte }) => {
        await this.props.deleteAporte({ id_aporte });
        await this.selectFields();
        await this.fetchAportes(this.props.aporte.id_investidor);
    }

    renderAportes() {
        return this.props.aportes.map((aporte) => {
            return (
                <li key={aporte.id_aporte} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        {moment(aporte.dt_aporte).format('DD/MM/YYYY')}
                    </div>
                    <div>
                        {new Intl.NumberFormat(aporte.id_moeda === 1 ? 'pt-BR' : 'en-US', {
                            style: 'currency',
                            currency: aporte.id_moeda === 1 ? 'BRL' : 'USD',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }).format(aporte.vl_deposito)}
                    </div>
                    <div>
                        <button type='button' className="btn btn-warning" onClick={() => this.selectAporte(aporte)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button type='button' className="btn btn-danger ml-2"
                            onClick={(e) => { if (window.confirm('Tem certeza que deseja excluir esse aporte?')) this.deleteAporte(aporte) }}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </div>

                </li>
            );
        });

    }

    renderErrors = () =>
        this.state.errors.map((error, i) => {
            return <p key={i}>{error}</p>
        })

    renderInputWithLabel = (name, label, sm, type, value = '') =>
        <Col sm={sm || 12}>
            <Label for={name} >{label}</Label>
            <Input onChange={(e) => this.onChange(e)}
                name={name}
                type={type}
                value={(type === 'date') ? moment(this.props.aporte[name]).format('YYYY-MM-DD') : this.props.aporte[name] || value} />
        </Col>
    render() {
        const moedas = this.props.moedas;
        const optionMoedas = moedas.map((moeda) =>
            <option key={moeda.id_moeda} value={moeda.id_moeda}>{`${moeda.sigla} - ${moeda.nome_moeda}`}</option>
        );

        const investor = this.props.searchData;
        const optionInvestor = (investor.map(({ id_pessoa, nome_pessoa }) => {
            return { value: id_pessoa, label: nome_pessoa }
        }))

        const optionGestor = investor.filter((item) => item.gestor === 'S').map(({ id_pessoa, nome_pessoa }) => {
            return { value: id_pessoa, label: nome_pessoa }
        });

        const optionCorretor = investor.filter((item) => item.corretor === 'S').map(({ id_pessoa, nome_pessoa }) => {
            return { value: id_pessoa, label: nome_pessoa }
        })

        return (
            <Container>
                <Form onSubmit={this.onSubmit}>
                    <Col sm="10">
                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '1' })}
                                    onClick={() => { this.toggle('1'); }}
                                >
                                    Cadastro de Aportes
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab} >
                            <TabPane tabId="1">
                                <Row>
                                    <Col>
                                        <FormGroup row>
                                            <Col sm={6}>
                                                <Label for="id_investidor">Investidor</Label>
                                                <Select id='id_investidor'
                                                    value={this.state.selectedInvestor}
                                                    options={optionInvestor}
                                                    onChange={(e) => this.updateSelect(e, 'I')}
                                                />
                                            </Col>
                                            <Col sm={6}>
                                                <Label for="id_gestor">Gestor</Label>
                                                <Select id='id_gestor'
                                                    value={this.state.selectedGestor}
                                                    options={optionGestor}
                                                    onChange={(e) => this.updateSelect(e, 'G')}
                                                />
                                            </Col>
                                            <Col sm={6}>
                                                <Label for="id_corretor">Corretor</Label>
                                                <Select id='id_corretor'
                                                    value={this.state.selectedCorretor}
                                                    options={optionCorretor}
                                                    onChange={(e) => this.updateSelect(e, 'C')}
                                                />
                                            </Col>

                                            {this.renderInputWithLabel('dt_aporte', 'Data Aporte', 3, 'date')}
                                            <Col sm={3}>
                                                <Label for="id_moeda">Moeda</Label>
                                                <Input type="select" name="id_moeda" id="id_moeda"
                                                    value={this.props.aporte.id_moeda}
                                                    onChange={(e) => this.onChange(e)}>
                                                    {optionMoedas}
                                                </Input>
                                            </Col>
                                            <Col sm={3}>
                                                <Label for="vl_deposito">Valor Depósito</Label>
                                                <SimpleCurrencyInput
                                                    id="vl_deposito" //optional
                                                    className="form-control"
                                                    value={this.state.vl_deposito}
                                                    precision={2}
                                                    separator=','
                                                    delimiter='.'
                                                    unit='R$'
                                                    onInputChange={(value) => this.onChangeMoney(value, 'vl_deposito')}
                                                />
                                            </Col>
                                            <Col sm={3}>
                                                <Label for="vl_retorno">Valor Retorno</Label>
                                                <SimpleCurrencyInput
                                                    id="vl_retorno" //optional
                                                    className="form-control"
                                                    value={this.state.vl_retorno}
                                                    precision={2}
                                                    separator=','
                                                    delimiter='.'
                                                    unit='R$'
                                                    onInputChange={(value) => this.onChangeMoney(value, 'vl_retorno')}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </TabPane>
                        </TabContent>
                    </Col>

                    <FormGroup row>
                        <Col sm={10}>
                            <Button className="form-button" type='submit' color="primary">Salvar</Button>
                            <Button className="form-button" color="info" onClick={() => this.onNewClick()}>Novo</Button>
                        </Col>
                    </FormGroup>

                    <FormGroup check row>
                        <Col sm={10}>
                            <div className='text-danger'>
                                {this.renderErrors()}
                            </div>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm={10}>
                            <ul className="list-group col-lg-12">
                                <li key={0} className="list-group-item d-flex justify-content-between align-items-center" >
                                    <div>
                                        Data
                                    </div>
                                    <div>
                                        Valor
                                    </div>
                                    <div>
                                        Actions
                                    </div>
                                </li>
                                {this.renderAportes()}
                            </ul>
                        </Col>
                    </FormGroup>
                </Form>
            </Container>
        );
    }
}

const mapStateToProps = ({ reducer: { selectedAporte, moedas, searchData, selectedPerson, aportes } }) => {
    return {
        aporte: selectedAporte,
        moedas,
        searchData,
        person: selectedPerson,
        aportes
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchMoedas: () => dispatch({ type: 'FETCH_MOEDAS' }),
        fetchSaveAporte: aporte => dispatch({ type: 'FETCH_SAVE_APORTE', payload: aporte }),
        saveAporte: aporte => dispatch(changeSelectedAporte(aporte)),
        newAporte: () => dispatch(newAporte()),
        fetchPessoas: name => dispatch({ type: 'FETCH_SEARCH_DATA', payload: name }),
        fetchAportes: id_investidor => dispatch({ type: 'FETCH_APORTES', payload: id_investidor }),
        deleteAporte: id => dispatch({ type: 'DELETE_APORTE', payload: id })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Aportes);