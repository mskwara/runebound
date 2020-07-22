import React, { useState } from "react";

import "./NewGame.scss";
import PlayersSelect from "../../components/PlayersSelect/PlayersSelect";
import axios from "axios";

const NewGame = (props) => {
    const [gameState, setGameState] = useState({
        name: "",
        players: [],
    });
    const style = {
        marginRight: "30px",
    };

    const handleNameChange = (event) => {
        const newState = { ...gameState };
        newState.name = event.target.value;
        setGameState(newState);
    };
    const handlePlayersChange = (players) => {
        const newState = { ...gameState };
        newState.players = players;
        setGameState(newState);
    };
    const createGame = async () => {
        try {
            const response = await axios.post("api/games", gameState);
            console.log(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div id="NewGame">
            <h1>Stwórz nową grę</h1>
            <div className="content">
                <PlayersSelect
                    onPlayersChange={handlePlayersChange}
                    style={style}
                />
                <div className="right">
                    <input
                        type="text"
                        placeholder="Nadaj nazwę tej grze"
                        onChange={handleNameChange}
                    />
                    <button onClick={createGame}>Rozpocznij grę</button>
                </div>
            </div>
        </div>
    );
};

export default NewGame;
