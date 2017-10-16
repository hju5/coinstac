/* eslint-disable react/no-array-index-key */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import StatusItem from './status-item';
import { fetchAllComputationsMetadataFunc } from '../state/graphql/functions';
import { computationsProp } from '../state/graphql/props';

class DashboardHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      didInitResults: false,
    };
  }

/*
  componentWillMount() {
    const {
      // fetchRemoteResultsForUser,
      username,
    } = this.props;

    this.interval = setInterval(() => fetchRemoteResultsForUser(username), 2000);
  }
*/

/*
  componentWillUpdate() {
    const {
      computations,
      consortia,
      fetchRemoteResultsForUser,
      username,
    } = this.props;

    if (
      !this.state.didInitResults &&
      computations.length &&
      consortia.length &&
      username
    ) {
      this.setState({ didInitResults: true }, () => { // eslint-disable-line
        fetchRemoteResultsForUser(username);
      });
    }
  }
  */

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    const {
      remoteResults,
    } = this.props;

    return (
      <div className="dashboard-home">
        <div className="page-header clearfix">
          <h1 className="pull-left">Computation Statuses</h1>
        </div>
        {!remoteResults.length &&
          <Alert>No computation results</Alert>
        }
        <ul className="list-unstyled">
          {remoteResults.map(res => (
            <li key={res.startDate}>
              <StatusItem
                computation={res.computation}
                consortium={res.consortium}
                remoteResult={res}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

DashboardHome.propTypes = {
  username: PropTypes.string,
};

DashboardHome.defaultProps = {
  computations: [],
  username: null,
  remoteResults: [],
};

function mapStateToProps({
  auth,
}) {
  return {
    username: auth.user.username || '',
  };
}

const DashHomeWithData = graphql(fetchAllComputationsMetadataFunc, computationsProp)(DashboardHome);

export default connect(mapStateToProps)(DashHomeWithData);
