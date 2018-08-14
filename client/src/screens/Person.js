import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Container, Col, Form,
    FormGroup, Label, Input,
    Button, TabContent, TabPane, Nav,
    NavItem, NavLink, Row, CustomInput,
    Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import moment from 'moment';

import classnames from 'classnames';

import { changeSelectedPerson, newPerson, changePersonError } from '../store/actions';

const requiredFields = [
    'cpf',
    'email'
]

class Person extends Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1',
            errors: [''],
            modal: false
        };
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    componentWillMount() {
        this.props.fetchPerson({ email: this.props.email });
        this.cleanError();
    }

    cleanError = () => {
        this.props.changeError({
            error: false,
            errorMessage: ''
        })
        //to prevent problems in component willmount
        this.setState({ modal: false });

    }

    fetchAportes = async (id_investidor) => {
        await this.props.fetchAportes({ id_investidor })
    }

    validateFields = () => {
        let errors = [];
        requiredFields.map((field, i) => {
            const value = this.props.person[field]
            if ((value === '') || (value === '1900-01-01') || (value === 0)) {
                errors.push(`* Campo (${field}) é obrigatório!`);
            }
        });

        this.setState({ errors });
        return errors.length === 0;
    }

    onSubmit = async (e) => {
        //prevents full page reload
        e.preventDefault();
        if (this.validateFields()) {
            await this.props.fetchSavePerson(this.props.person);
            this.setState({ modal: true });
        }
    }

    onNewClick = () => {
        this.props.newPerson();
    }

    onChange({ target }) {
        const person = { ...this.props.person };
        let value = target.name === 'email' ? target.value.toLowerCase() : target.value.toUpperCase();
        if (target.type === 'checkbox')
            value = target.checked ? 'S' : 'N';
        person[target.name] = value;
        this.props.savePerson(person);

        //Clean errors
        this.setState({ errors: [''] });
    }

    renderErrors = () =>
        this.state.errors.map((error, i) => {
            return <p key={i}>{error}</p>
        }
        )

    renderInputWithLabel = (name, label, sm, type, value = '') =>
        <Col sm={sm || 12}>
            <Label for={name} >{label}</Label>
            <Input onChange={(e) => this.onChange(e)}
                name={name}
                type={type}
                value={(type === 'date') ? moment(this.props.person[name]).format('YYYY-MM-DD') : this.props.person[name] || value} />
        </Col>

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
                </li>
            );
        });

    }

    renderModal() {

        return this.props.personResult.error ? (
            <p className="text-danger"><strong>Erro ao Salvar: </strong> {this.props.personResult.errorMessage} </p>
        ) : <p className="text-success"><strong>Salvo com Sucesso </strong></p>
    }

    render() {
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
                                    Dados Pessoais
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '2' })}
                                    onClick={() => { this.toggle('2'); }}
                                >
                                    Documentos
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '3' })}
                                    onClick={() => { this.toggle('3'); }}
                                >
                                    Endereço/Contato
                                </NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '4' })}
                                    onClick={() => { this.toggle('4'); }}
                                >
                                    Dados Bancários
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '5' })}
                                    onClick={() => {
                                        this.toggle('5');
                                        const { id_pessoa } = this.props.person;
                                        this.fetchAportes(id_pessoa > 0 ? id_pessoa : -1);
                                    }
                                    }
                                >
                                    Aportes
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab} >
                            <TabPane tabId="1">
                                <Row>
                                    <Col>
                                        <FormGroup row>
                                            {this.renderInputWithLabel('nome_pessoa', 'Nome', 6)}
                                            {this.renderInputWithLabel('email', 'Email', 6)}
                                            {this.renderInputWithLabel('pai_pessoa', 'Nome do Pai', 6)}
                                            {this.renderInputWithLabel('mae_pessoa', 'Nome da Mãe', 6)}
                                            {this.renderInputWithLabel('profissao', 'Profissão', 3)}
                                            {this.renderInputWithLabel('nacionalidade', 'Nacionalidade', 3)}
                                            <Col sm={3}>
                                                <Label for="est_civil">Estado Civil</Label>
                                                <Input type="select" name="est_civil" id="est_civil"
                                                    value={this.props.person.est_civil}
                                                    onChange={(e) => this.onChange(e)}>
                                                    <option>CASADO(A)</option>
                                                    <option>DIVORCIADO(A)</option>
                                                    <option>SOLTEIRO(A)</option>
                                                    <option>UNIÃO ESTÁVEL</option>
                                                    <option>VIÚVO(A)</option>
                                                    <option>OUTROS</option>
                                                </Input>
                                            </Col>
                                            {this.renderInputWithLabel('dt_nasc', 'Nascimento', 3, 'date')}
                                            <Col sm={12} className='checkBox'>
                                                <CustomInput type="checkbox" id="gestor" name="gestor" label="Gestor"
                                                    onChange={(e) => this.onChange(e)}
                                                    checked={this.props.person.gestor === 'S'} />
                                                <CustomInput type="checkbox" id="corretor" name="corretor" label="Corretor"
                                                    onChange={(e) => this.onChange(e)}
                                                    checked={this.props.person.corretor === 'S'} />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="2">
                                <Row>
                                    <Col>
                                        <FormGroup row>
                                            {this.renderInputWithLabel('cpf', 'CPF', 3)}
                                            {this.renderInputWithLabel('rg', 'RG', 3)}
                                            {this.renderInputWithLabel('org_emissor', 'Órgão Emissor', 3)}
                                            {this.renderInputWithLabel('dt_emissao', 'Emissão', 3, 'date')}

                                            {this.renderInputWithLabel('passaporte', 'Passaporte', 6)}
                                            {this.renderInputWithLabel('dt_emis_pass', 'Emissão', 3, 'date')}
                                            {this.renderInputWithLabel('dt_venc_pass', 'Vencimento', 3, 'date')}
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </TabPane>
                            {/* Endereço/Contato */}
                            <TabPane tabId="3">
                                <Row>
                                    <Col>
                                        <FormGroup row>
                                            {this.renderInputWithLabel('cep', 'CEP', 2)}
                                            {this.renderInputWithLabel('endereco', 'Endereço', 7)}
                                            {this.renderInputWithLabel('numero', 'Número', 3)}
                                            {this.renderInputWithLabel('complemento', 'Complemento', 7)}
                                            {this.renderInputWithLabel('bairro', 'Bairro', 5)}
                                            {this.renderInputWithLabel('cidade', 'Cidade', 5)}
                                            {this.renderInputWithLabel('estado', 'Estado', 2)}
                                            {this.renderInputWithLabel('tel_celular', 'Celular', 5)}
                                            {this.renderInputWithLabel('tel_outro', 'Outros Telefones')}
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </TabPane>
                            {/* Dados Bancários */}
                            <TabPane tabId="4">
                                <Row>
                                    <Col>
                                        <FormGroup row>
                                            {this.renderInputWithLabel('banco', 'Banco', 2)}
                                            {this.renderInputWithLabel('agencia', 'Agência', 3)}
                                            <Col sm={3}>
                                                <Label for="tp_conta">Tipo da Conta</Label>
                                                <Input type="select" name="tp_conta" id="tp_conta"
                                                    value={this.props.person.tp_conta}
                                                    onChange={(e) => this.onChange(e)}>
                                                    <option>CORRENTE</option>
                                                    <option>POUPANCA</option>
                                                </Input>
                                            </Col>
                                            {this.renderInputWithLabel('conta', 'Conta', 4)}
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </TabPane>
                            {/* Aportes */}
                            <TabPane tabId="5">
                                <Row>
                                    <Col>
                                        <FormGroup row>
                                            <Col sm={12}>
                                                <ul className="list-group col-lg-12">
                                                    <li key={0} className="list-group-item d-flex justify-content-between align-items-center" >
                                                        <div>
                                                            Data
                                                        </div>
                                                        <div>
                                                            Valor
                                                    </div>
                                                    </li>
                                                    {this.renderAportes()}
                                                </ul>
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </TabPane>
                        </TabContent>
                    </Col>

                    <FormGroup row>
                        <Col sm={10}>
                            <Button className="form-button" color="primary">Salvar</Button>
                            <Button className="form-button" color="danger" onClick={() => console.log('Person Result: ', this.props.personResult)} >Excluir</Button>
                            <Button className="form-button" color="info" onClick={() => this.onNewClick()} >Novo</Button>
                        </Col>
                    </FormGroup>

                    <FormGroup check row>
                        <Col sm={10}>
                            <div className='text-danger'>
                                {this.renderErrors()}
                            </div>
                        </Col>
                    </FormGroup>
                </Form>
                <Modal isOpen={this.state.modal} backdrop={true}>
                    <ModalHeader toggle={() => this.cleanError()}>Cadastro de Pessoas</ModalHeader>
                    <ModalBody>
                        {this.renderModal()}
                    </ModalBody>
                    <ModalFooter>
                        <Button color={`${this.props.personResult.error ? 'danger' : 'success'}`} onClick={() => this.cleanError()}>Ok</Button>{' '}
                    </ModalFooter>
                </Modal>
            </Container>
        );
    }
}

const mapStateToProps = ({ reducer: { selectedEmail, selectedPerson, aportes, personResult } }) => {
    return {
        email: selectedEmail,
        person: selectedPerson,
        aportes,
        personResult
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPerson: email => dispatch({ type: 'FETCH_SELECTED_PERSON', payload: email }),
        fetchSavePerson: person => dispatch({ type: 'FETCH_SAVE_PERSON', payload: person }),
        savePerson: person => dispatch(changeSelectedPerson(person)),
        changeError: error => dispatch(changePersonError(error)),
        newPerson: () => dispatch(newPerson()),
        fetchAportes: id_investidor => dispatch({ type: 'FETCH_APORTES', payload: id_investidor })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Person);