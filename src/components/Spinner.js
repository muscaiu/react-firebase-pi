import React from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';

import logo from 'assets/logo.svg';

const Wrapper = styled.div`
`;

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Logo = styled.img`
  animation: ${props => props.isActive ? `${rotate360} infinite 20s linear;` : 'paused;'};
  height: 150px;
`;

const handleTestClick = () => {
  axios.get('http://cassusa.go.ro:3001/api/test')
    .then(function (response) {
      console.log(response.data.relayStatus)
      alert('Real status: ' + response.data.relayStatus);
    })
    .catch(function (err) {
      alert(err);
    })
}

const Spinner = ({ isActive }) => (
  <Wrapper>
    <Logo
      onClick={handleTestClick}
      isActive={isActive}
      src={logo}
    />
  </Wrapper>
)

export default Spinner;