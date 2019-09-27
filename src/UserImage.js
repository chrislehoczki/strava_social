import React, { useState } from 'react';
import styled, { css } from 'styled-components';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const UserHolder = styled(Link)`
  width: 124px;
  height: 124px;
  margin: 10px;
`;
const Image = styled.img`
  width: 100%;
  height: 100%;
`;

export default function UserImage({ _id, img, firstName, lastName, stravaId }) {
  const { error, onError } = useError();
  if (error) {
    return null;
  }
  return (
    <UserHolder to={`/user/${_id}`}>
      <Image src={img.replace('medium', 'large')} onError={onError} />
    </UserHolder>
  );
}

function useError() {
  const [error, setError] = useState(false);
  return {
    onError: () => setError(true),
    error,
  };
}
