import React from "react";
import { Row } from "reactstrap";

import Header from "./Header";
import Navigation from "./Navigation";

export default class Dashboard extends React.Component {
    componentDidMount() {
        /*only works if you're passing appState to this.props */
        this.props.debug && console.log("Dashboard componentDidMount");
    }

    componentWillReceiveProps(nextProps) {
        /*only works if you're passing appState to this.props */
        this.props.debug && console.log("Dashboard componentWillReceiveProps ");
    }

    render() {
        return (
            <main>
                <Header {...this.props} />
                <Navigation />
                <Row>
                    <div role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
                        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                            <h2>{this.props.title}</h2>
                        </div>
                        <section>{this.props.children}</section>
                    </div>
                </Row>
            </main>
        );
    }
}
