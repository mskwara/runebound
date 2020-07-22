import React, { useState } from "react";
import "./Login.scss";
import axios from "axios";

const Login = (props) => {
    const [userState, setUserState] = useState({
        nick: "",
        password: "",
    });

    const login = async () => {
        try {
            const response = await axios.post("api/users/login", userState);
            if (response.data.status === "success") {
                props.history.push("/dashboard");
            }
            // const user = response.data.data.user;
        } catch (err) {
            console.log(err);
        }
    };

    const handleInputChange = (event) => {
        const field = event.target.name;
        const state = {
            ...userState,
        };
        state[field] = event.target.value;
        setUserState(state);
    };

    return (
        <div id="Login">
            <h1>Logowanie</h1>
            <div className="form">
                <input
                    type="text"
                    name="nick"
                    placeholder="Nick"
                    onChange={handleInputChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Hasło"
                    onChange={handleInputChange}
                />
                <button className="button" onClick={login}>
                    Zaloguj się
                </button>
            </div>
        </div>
    );
};

export default Login;
