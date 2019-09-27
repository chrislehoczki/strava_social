import React from 'react';
import styled, { css } from 'styled-components';

import UserImage from './UserImage';

const UsersContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  align-content: center;
`;

const renderUsers = users =>
  users.map(user => <UserImage key={user.id} {...user} />);

export default function AllUsers({ users }) {
  return <UsersContainer>{renderUsers(users)}</UsersContainer>;
}
