import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './app.css';

import AllUsers from './AllUsers';
import UserDashboard from './UserDashboard';
import config from './config';
const Body = styled.div`
  text-align: center;
`;
const Loading = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: black;
`;

const Header = styled.div`
  text-align: center;
  padding: 50px;
`
const Title = styled.h1``
const Intro = styled.h4`
  width: 300px;
  margin: 0px auto;
`
const Logo = styled.img``

function App() {
  const { users, loading } = useInitialDataFetch()
  // const localUsers = localStorage.users
  // if (localUsers) {
  // 	return setUsers(JSON.parse(localStorage.users))
  // }
  // const users = JSON.parse(localStorage.users);
  // const loading = false;
  // localStorage.setItem('users', JSON.stringify(users))
  return (
    <Router>
    	{ loading && <Loading /> }
      <Header>
        <Logo src="world.png" />
        <Title>Strava Social</Title>
        <Intro>
        This web app made it into the top 25 for the strava developers competition. 
        Subsequently strava changed their API so new users couldn't use the features.
        Here it is archived with some user data to browse :)
        </Intro>
      </Header>
      <Body>
        <Route path="/" exact render={() => <AllUsers users={users} />} />
        <Route path="/user/:id" component={UserDashboard} />
      </Body>
    </Router>
  );
}

export default App;

function useInitialDataFetch() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const response = await fetch(config.api);
    const users = await response.json();
    setTimeout(() => {
    	setLoading(false);
    }, 1000)
    
    return setUsers(users.slice(0, 500));
  };
  useEffect(() => {
    try {
      fetchData();
    } catch (e) {
      setLoading(false);
    }
  }, []);

  return { users, loading };
}
