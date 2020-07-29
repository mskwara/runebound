import React from "react";
import "./Game.scss";
import Map from "../../components/Map/Map";

const Game = (props) => {
    console.log(props);
    return (
        <div id="Game">
            <Map map={props.location.map} />
        </div>
    );
};

export default Game;
