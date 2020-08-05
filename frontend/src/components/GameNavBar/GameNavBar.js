import React from "react";
import "./GameNavBar.scss";

const GameNavBar = (props) => {
    let dices = null;
    if (props.status === "dices") {
        dices = (
            <div
                className="btn"
                onClick={props.navClickHandler.bind(this, "dices")}
            >
                <img src={require("../../assets/nav_dices.png")} alt="dices" />
            </div>
        );
    } else {
        dices = (
            <div className="btn disabled">
                <img src={require("../../assets/nav_dices.png")} alt="dices" />
            </div>
        );
    }
    return (
        <div id="GameNavBar">
            <div
                className="btn"
                onClick={props.navClickHandler.bind(this, "map")}
            >
                <img src={require("../../assets/nav_map.png")} alt="map" />
            </div>
            {dices}
            <div
                className="btn"
                onClick={props.navClickHandler.bind(this, "adventure")}
            >
                <img
                    src={require("../../assets/nav_adventure.png")}
                    alt="adventure"
                />
            </div>
            <div
                className="btn"
                onClick={props.navClickHandler.bind(this, "player")}
            >
                <img
                    src={require("../../assets/nav_player.png")}
                    alt="player"
                />
            </div>
        </div>
    );
};

export default GameNavBar;
