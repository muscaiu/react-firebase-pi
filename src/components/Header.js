import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { firestoreConnect, isLoaded } from 'react-redux-firebase';
import { compose } from 'redux';
import axios from 'axios';

import Button from '@material-ui/core/Button';

// import { API } from 'config/constants';
import Spinner from 'components/Spinner';
import Log from 'components/Log';
import OnOffSwitch from './OnOffSwitch';
import AutoManualSwitch from './AutoManualSwitch';
// import Weather from './Weather';
import pack from '../../package.json'
import * as actions from '../actions/actions';

const Wrapper = styled.div`
  padding-top: 50px;
`;

const Version = styled.div`
  color: darkgrey;
  font-size: 8px;
  position: fixed;
  bottom: 10px;
  padding: 10px;
`;
const ApiVersion = styled.div`
  color: darkgrey;
  font-size: 8px;
  position: fixed;
  bottom: 0;
  padding: 10px;
`;

class Header extends Component {

  hanldeToggleMode = () => {
    console.log('hanldeToggleMode');
    this.props.toggleMode(this.props.fbMode);
  }

  hanldeToggleStats = () => {
    this.props.toggleStatus(this.props.fbStatus);
  }

  handleTestClick = () => {
    axios.get('http://cassusa.go.ro:3001/api/test')
      .then(function (response) {
        console.log(response.data.relayStatus)
        alert('Real status: ' + response.data.relayStatus);
      })
      .catch(function (err) {
        alert(err);
      })
  }

  render() {
    const apiVersion = '2.1.2';
    const { fbStatus, fbMode, fbLastAction } = this.props;

    return (
      <Wrapper>
        {
          isLoaded(fbStatus) ?
            <div>
              <Spinner isActive={fbStatus} />
              <AutoManualSwitch
                mode={fbMode}
                onModeClick={this.hanldeToggleMode}
              />
              <OnOffSwitch
                isEnabled={fbMode === 'auto'}
                isActive={fbStatus}
                onStatusClick={this.hanldeToggleStats}
              />
              <Log
                lastAction={fbLastAction}
                mode={fbMode}
                isActive={fbStatus}
              />
              <Button onClick={this.handleTestClick}>Test</Button>
              {/* {lastWeatherUpdate &&
                <Weather lastWeatherUpdate={lastWeatherUpdate} />
              } */}
              <Version>version: {pack.version}</Version>
            </div> :
            null
        }
      </Wrapper>
    )
  }
}

function mapStateToProps(state) {
  const fbStatusList = state.firestore.ordered.status;
  const fbModeList = state.firestore.ordered.mode;
  return {
    fbStatus: fbStatusList && fbStatusList[0].value,
    fbMode: fbModeList && fbModeList[0].value,
    fbLastAction: fbStatusList && fbStatusList[0].createdAt
  }
}

export default compose(
  connect(mapStateToProps, actions),
  firestoreConnect([
    { collection: 'status', limit: 1, orderBy: ['createdAt', 'desc'] },
    { collection: 'mode', limit: 1, orderBy: ['createdAt', 'desc'] }
  ])
)(Header);
