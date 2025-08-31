import { createContext, useContext, useState } from 'react';
import { getUser, getAccessToken } from './user.actions';

const UserContext = createContext([null, (_) => {}]);

export const UserProvider = ({ children }) => {

  const [user, setUser] = useState(getUser());
  const [accessToken, setAccessToken] = useState(getAccessToken());

  return (
    <UserContext.Provider value={{user, setUser, accessToken, setAccessToken}}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;

export const useUser = () => {
  return useContext(UserContext);
}
