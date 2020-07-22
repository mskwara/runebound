import React, { useEffect } from "react";
import "./App.scss";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Topbar from "./components/Topbar/Topbar";
import NotLogged from "./views/NotLogged/NotLogged";
import Signup from "./views/Signup/Signup";
import Login from "./views/Login/Login";
import Dashboard from "./views/Dashboard/Dashboard";
import NewGame from "./views/NewGame/NewGame";
import axios from "axios";

const App = (props) => {
    useEffect(() => {
        let user = null;
        const checkLogin = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/api/users/isLoggedIn"
                );
                user = response.data.data;
                console.log(user);
                // if (user != null) {
                //     props.history.push("/dashboard");
                // } else {
                //     props.history.push("/");
                // }
            } catch (err) {
                console.log(err);
            }
        };
        checkLogin();
    });

    return (
        <BrowserRouter>
            <div className="App">
                <Topbar />
                <Switch>
                    <Route path="/" exact component={NotLogged} />
                    <Route path="/signup" exact component={Signup} />
                    <Route path="/login" exact component={Login} />
                    <Route path="/dashboard" exact component={Dashboard} />
                    <Route path="/new-game" exact component={NewGame} />
                </Switch>
            </div>
        </BrowserRouter>
    );
};

export default App;
