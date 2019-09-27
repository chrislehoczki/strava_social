import React, { useState, useEffect } from 'react';
import config from './config';

import { createDataPoints, createGraph } from './d3_network';
import { initMap } from './d3_map';

export default function UserDashboard({ match }) {
  const { loading, user } = useUserDataFetch(match.params.id);
  const [ mapped, setMapped ] = useState(false)
  // localStorage.setItem("userData", JSON.stringify(user))
  // const user = JSON.parse(localStorage.userData);
  if (user) {
    const links = createDataPoints(user);
    createGraph(links);
    if (!mapped) {
      initMap(user.strava.followers);
      setMapped(true)
    }
    
  }

  console.log(user);
  return (
    <div>
      <h1>{user && user.strava.details.firstname} {user && user.strava.details.lastname}</h1>
      <div id="graph" />
      <div id="globalMap" />
    </div>
  );
}

function useUserDataFetch(userId) {
  const [user, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const response = await fetch(config.api + '/' + userId);
    const user = await response.json();
    console.log({ user, response });
    setLoading(false);
    return setUserData(user);
  };
  useEffect(() => {
    try {
      fetchData();
    } catch (e) {
      setLoading(false);
    }
  }, []);

  return { user, loading };
}
