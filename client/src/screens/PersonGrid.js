import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { connect } from 'react-redux';

import { selectEmail } from '../store/actions';

class PersonGrid extends Component {
  onRowClick = (row) => {
    this.props.selectEmail(row.email);
    this.props.history.push('/person');
  }

  renderData() {
    let tableOptions = {
      noDataText: 'Sem dados para listar',
      onRowClick: this.onRowClick
    }
    let tableFull = (
      <BootstrapTable data={this.props.searchData} striped bordered={false} options={tableOptions}>
        <TableHeaderColumn dataField='nome_pessoa'>Nome</TableHeaderColumn>
        <TableHeaderColumn dataField='email' isKey={true} >Email</TableHeaderColumn>
      </BootstrapTable>
    );

    let tableLess = (
      <BootstrapTable data={this.props.searchData} options={tableOptions} bordered={false}>
        <TableHeaderColumn dataField='nome_pessoa' >Nome</TableHeaderColumn>
        <TableHeaderColumn dataField='email' isKey={true} >Email</TableHeaderColumn>
      </BootstrapTable>
    );

    if (this.props.searchData && this.props.searchData.length !== 0) {
      return tableFull
    }
    return tableLess;
  }

  render() {
    return (
      this.renderData()
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
    selectEmail: email => dispatch(selectEmail(email))
  }
}

export default connect(mapStatetoProps, mapDispatchToProps)(PersonGrid)

