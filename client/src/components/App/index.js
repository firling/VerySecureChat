import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Messenger from '../Messenger';
import Login from '../Login';
import axios from 'axios';

export default function App() {

  const [isLogged, setIsLogged] = useState();

  useEffect(() => {
    axios.get(`${window.env.SERVER_URL}/api/auth/check`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      }
     }).then(res => {
        setIsLogged(true);
      }).catch(err => {
        setIsLogged(false);
      })
  },[])
  

  if(!isLogged) {
    return <Login setIsLogged={setIsLogged} />
  }

  return (
    <div className="App">
      <Router>
        <Switch>

          <Route path='/'>
            <Messenger />
          </Route>

          <Route path='*' exact>
            <Redirect to="/" />
          </Route>

        </Switch>
      </Router>
    </div>
  );
}