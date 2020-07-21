import React from "react";
import "./App.scss";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import NotLogged from "./views/NotLogged/NotLogged";
import Signup from "./views/Signup/Signup";
import Topbar from "./components/Topbar/Topbar";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Topbar />
                <Switch>
                    <Route path="/" exact component={NotLogged} />
                    <Route path="/signup" exact component={Signup} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;
