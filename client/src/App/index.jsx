import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch } from 'react-router-dom';

import { getAuthStatus, updateState } from '../redux/actions/shareMoies';

import Layout from '../pages/layout';
import Dashboard from '../pages/Dashboard';
import Home from '../pages/Home';

import PrivateRoute from './Routers/PrivateRoute';
import LogoutRoute from './Routers/LogoutRoute';

import './App.css';

function App() {
  const [socketio, setSocketio] = useState(null);
  const { socket } = useSelector((_state) => _state);
  const dispatch = useDispatch();
  useEffect(() => {
    setSocketio(socket);
    if (localStorage.getItem('shareVideo')) {
      const { isAuth, roomId, username, userId, role, connectedUsers } =
        JSON.parse(window.localStorage.getItem('shareVideo'));
      dispatch(
        updateState({ isAuth, roomId, username, userId, role, connectedUsers })
      );
      dispatch(getAuthStatus({ isAuth }));
    }
    return socket.on('disconnect', () => {
      console.log(socket.id);
    });
  }, []);

  return (
    <div className="App">
      <Layout>
        <Switch>
          <PrivateRoute exact path="/dashboard">
            <Dashboard socket={socketio} />
          </PrivateRoute>
          <LogoutRoute exact path="/">
            <Home socket={socketio} />
          </LogoutRoute>
        </Switch>
      </Layout>
    </div>
  );
}

export default App;
