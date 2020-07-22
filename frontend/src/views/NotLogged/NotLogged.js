import React from "react";
import "./NotLogged.scss";
import SquareButton from "../../components/SquareButton/SquareButton";

function NotLogged() {
    return (
        <div className="NotLogged">
            <SquareButton to="/signup" title="Rejestracja" image="signup.png" />
            <SquareButton to="/login" title="Logowanie" image="login.png" />
        </div>
    );
}

export default NotLogged;
