import React from "react";
import "./Topbar.scss";
import { Link } from "react-router-dom";

const Topbar = (props) => {
    return (
        <div id="Topbar">
            <div className="left">
                <Link className="link" to="/dashboard">
                    Runebound
                </Link>
            </div>
            <div className="right">
                <Link className="link" to="/active-games">
                    Trwające gry
                </Link>
                <Link className="link" to="/new-game">
                    Nowa gra
                </Link>
                <Link className="link" to="/chat">
                    Czat
                </Link>
            </div>
        </div>
    );
};

export default Topbar;
