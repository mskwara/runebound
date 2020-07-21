import React from "react";
import "./NotLogged.scss";
import SquareButton from "../../components/SquareButton/SquareButton";
import { Link } from "react-router-dom";

function NotLogged() {
    return (
        <div className="NotLogged">
            <Link to="/signup">
                <SquareButton title="Rejestracja" image="signup.png" />
            </Link>
            <Link to="/login">
                <SquareButton title="Logowanie" image="login.png" />
            </Link>
        </div>
    );
}

export default NotLogged;
