import React from "react";
import "./GameTile.scss";

const GameTile = (props) => {
    const playerList = props.game.players.map((player) => {
        return (
            <div className="row" key={player.user._id}>
                <img
                    src={require(`../../assets/sword.png`)}
                    alt="selected"
                    className="icon"
                />
                {player.user.nick}
            </div>
        );
    });
    let round = <p className="round">Runda {props.game.round}</p>;
    if (props.game.round === 0) {
        round = <p className="round">Oczekiwanie na graczy</p>;
    }

    const launchGame = () =>
        props.history.push({
            pathname: "/game",
            map: props.game.map,
        });

    return (
        <div id="GameTile">
            <p className="title">{props.game.name}</p>
            {round}
            <div className="divider" />
            <div className="players">{playerList}</div>
            <button onClick={launchGame}>Wejdź do gry</button>
        </div>
    );
};

export default GameTile;
