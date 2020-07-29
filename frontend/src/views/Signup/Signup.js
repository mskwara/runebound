import React, { useState } from "react";
import "./Signup.scss";
import axios from "axios";

const Signup = (props) => {
    const [userState, setUserState] = useState({
        nick: "",
        email: "",
        password: "",
        passwordConfirm: "",
    });

    const signup = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8000/api/users/signup",
                userState
            );
            const user = response.data.data.user;
            if (response.data.status === "success") {
                props.history.push("/dashboard");
                localStorage.setItem("userId", user._id);
            }
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
        <div id="Signup">
            <h1>Rejestracja</h1>
            <div className="form">
                <input
                    type="text"
                    name="nick"
                    placeholder="Nick"
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    onChange={handleInputChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Hasło"
                    onChange={handleInputChange}
                />
                <input
                    type="password"
                    name="passwordConfirm"
                    placeholder="Potwierdź hasło"
                    onChange={handleInputChange}
                />
                <button className="button" onClick={signup}>
                    Zarejestruj się
                </button>
            </div>
        </div>
    );
};

export default Signup;
