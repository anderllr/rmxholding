import React, { Component } from "react";
import { connect } from 'react-redux';

class Search extends Component {
    onChange(e) {
        if (e.target.value === "") {
            this.props.fetchData({ firstName: "*" })
        }
        else {
            this.props.fetchData({ firstName: e.target.value })
        }
    }

    render() {
        return (
            <input
                className="navbar-nav form-control form-control-dark search-control"
                placeholder="Search..."
                onChange={e => this.onChange(e)}
            />
        );
    }
}


const mapStatetoProps = ({ reducer: { searchData } }) => {
    return {
        searchData
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: firstName => dispatch({ type: 'FETCH_SEARCH_DATA', payload: firstName }),
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(Search)