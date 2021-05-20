import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Messenger from '../Messenger';
import Login from '../Login';
import axios from 'axios';
import io from 'socket.io-client';

export default function App() {

  const [isLogged, setIsLogged] = useState();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    axios.get(`${window.env.SERVER_URL}/api/auth/check`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      }
    }).then(res => {
        const soc = io(window.env.SERVER_URL, { path: "/ws" });
        setSocket(soc);
        
        setIsLogged(true);
        soc.emit("send_id", res.data._id);
      }).catch(err => {
        const soc = io(window.env.SERVER_URL, { path: "/ws" });
        setSocket(soc);

        setIsLogged(false);
      })

  },[])

  if (socket === null) {
    return <></>;
  }

  if(!isLogged) {
    return <Login setIsLogged={setIsLogged} socket={socket} />
  }

  return (
    <div className="App">
      <Router>
        <Switch>

          <Route path='/'>
            <Messenger socket={socket} />
          </Route>

          <Route path='*' exact>
            <Redirect to="/" />
          </Route>

        </Switch>
      </Router>
    </div>
  );
}