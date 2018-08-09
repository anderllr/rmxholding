import React from "react";
import { Link } from 'react-router-dom';

import { Nav } from "reactstrap";
import Icon from '../utils/Icon';

/*
 * Sidebar Component
 */
export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showMenu: "nonPanels" };
    }

    handleMenu(name) {
        let menu = name === this.state.showMenu ? null : name;
        this.setState({ showMenu: menu });
    }

    render() {
        return (
            <Nav
                id="Accordion"
                className="col-md-2 d-none d-md-block bg-light sidebar flex-column"
            >
                <div className="sidebar-sticky">
                    <li className="nav-item">
                        <h6
                            className="nav-link sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
                            onClick={() => this.handleMenu("menu1")}
                            data-toggle="collapse"
                            data-parent="#Accordion"
                        >
                            <Icon name='bars' />
                            <span>Cadastros</span>
                            {this.state.showMenu === "menu1" ? (
                                <Icon name='arrow-down' />
                            ) : (
                                    <Icon name='arrow-right' />
                                )}
                        </h6>
                        <div
                            id="menu1"
                            className={
                                "collapse" +
                                (this.state.showMenu === "menu1" ? " show" : "")
                            }
                        >
                            <ul className="nav flex-column ml-3">
                                <li className="nav-choice d-flex justify-content-between ">
                                    <Link to="/">
                                        <Icon className='nav-icon' name='users' /> Lista de Pessoas
                                    </Link>
                                </li>
                                <li className="nav-choice d-flex justify-content-between ">
                                    <Link to="/person">
                                        <Icon className='nav-icon' name='user-circle' /> Cadastro
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li className="nav-item">
                        <h6
                            className="nav-link sidebar-heading d-flex justify-content-between align-items-center -px-3 mt-4 mb-1 text-muted"
                            onClick={() => this.handleMenu("menu2")}
                            data-toggle="collapse"
                            data-parent="#Accordion"
                        >
                            <Icon name='angle-double-right' />
                            <span>Lançamentos</span>
                            {this.state.showMenu === "menu2" ? (
                                <Icon name='arrow-down' />
                            ) : (
                                    <Icon name='arrow-right' />
                                )}
                        </h6>
                        <div
                            id="emeaPanels"
                            className={
                                "collapse" +
                                (this.state.showMenu === "menu2" ? " show" : "")
                            }
                        >
                            <ul className="nav flex-column ml-3">
                                <ul className="nav flex-column ml-3">
                                    <li className="nav-choice d-flex justify-content-between ">
                                        <Link to="/aportes">
                                            <Icon className='nav-icon' name='dollar' /> Aportes
                                        </Link>
                                    </li>
                                </ul>
                            </ul>
                        </div>
                    </li>
                </div>
            </Nav>
        );
    }
}
