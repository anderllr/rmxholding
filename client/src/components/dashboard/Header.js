import React, { Component } from "react";

import { Link } from "react-router-dom";
import {
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Navbar,
    NavbarBrand,
    UncontrolledDropdown
} from "reactstrap";


import Search from "./Search";
import Icon from '../utils/Icon';
import logo from '../../assets/img/logo_rmx.png';

/*
 * Header Component
 */
export default class Header extends Component {
    onLogout = () => {
        sessionStorage.setItem('auth', 0);
        this.props.history.push('/login');
    }
    render() {
        return (
            <Navbar
                className="navbar-dark bg-green fixed-top flex-md-nowrap p-0 shadow"
            >
                <NavbarBrand tag={Link} to="/" className="col-sm-2 col-md-2 mr-0">
                    <div className='logo-container'>
                        <img className="logo" src={logo} alt="logo" />
                    </div>
                </NavbarBrand>

                {/* Search */}
                <Search />

                {/* User Menu */}
                <ul className="navbar-nav px-3">
                    <UncontrolledDropdown className="nav-item text-nowrap">
                        <DropdownToggle nav caret>
                            <Icon name='user' />
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem onClick={() => alert('Clicou Alterar senha')} >Alterar senha</DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem onClick={() => this.onLogout()}>Logout</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </ul>
            </Navbar>

        );
    }
}
