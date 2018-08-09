import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { Person, PersonGrid, Aportes, Login } from '../../screens';
import Main from '../dashboard/Main';
import AdminRoute from './AdminRoute';

export default props => (
    <Switch>
        <Route exact path='/login' component={Login} />
        <AdminRoute exact path='/' component={props => <Main title='Dados das pessoas cadastradas' {...props}> <PersonGrid {...props} /> </Main>} />
        <AdminRoute exact path='/person' component={props => <Main title='Cadastro de Pessoa' {...props}> <Person /> </Main>} />
        <AdminRoute exact path='/aportes' component={props => <Main title='Cadastro de Aportes' {...props}> <Aportes /> </Main>} />
        <Redirect from='*' to='/' />
    </Switch>
);