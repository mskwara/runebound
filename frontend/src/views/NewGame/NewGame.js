import React, { useState } from "react";

import "./NewGame.scss";
import PlayersSelect from "../../components/PlayersSelect/PlayersSelect";
import cities from "../../data/cities";
import axios from "axios";

const NewGame = (props) => {
    const [gameState, setGameState] = useState({
        name: "",
        players: [],
        map: [],
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
        const playersReadyForSave = players.map((el) => {
            return { user: el._id };
        });
        const newState = { ...gameState };
        newState.players = playersReadyForSave;
        setGameState(newState);
    };
    const generateMap = () => {
        let map = [];
        const rows = 9;
        const col = 20;
        for (let i = 0; i < rows * col; i++) {
            let type = Math.floor(Math.random() * (16 - 0)) + 0;
            if (type <= 5) {
                type = "field_flat";
            } else if (type <= 8) {
                type = "field_hill";
            } else if (type <= 10) {
                type = "field_lake";
            } else if (type <= 12) {
                type = "field_mountain";
            } else if (type <= 14) {
                type = "field_forest";
            } else if (type <= 15) {
                type = "field_marsh";
            }
            const field = {
                terrain: type,
            };
            map.push(field);
        }
        cities.forEach((city, cityId) => {
            // create cities
            const index = Math.floor(Math.random() * (rows * col - 0)) + 0;
            map[index].isCity = true;
            map[index].city = cityId;
        });

        for (let i = 0; i < 15; i++) {
            // create green adventures
            const advId = 0; // TODO
            const index = Math.floor(Math.random() * (rows * col - 0)) + 0;
            map[index].isAdventure = true;
            map[index].adventure = {
                id: advId,
                difficulty: 0,
            };
        }
        for (let i = 0; i < 10; i++) {
            // create yellow adventures
            const advId = 0; // TODO
            const index = Math.floor(Math.random() * (rows * col - 0)) + 0;
            map[index].isAdventure = true;
            map[index].adventure = {
                id: advId,
                difficulty: 1,
            };
        }
        for (let i = 0; i < 7; i++) {
            // create purple adventures
            const advId = 0; // TODO
            const index = Math.floor(Math.random() * (rows * col - 0)) + 0;
            map[index].isAdventure = true;
            map[index].adventure = {
                id: advId,
                difficulty: 2,
            };
        }
        for (let i = 0; i < 5; i++) {
            // create red adventures
            const advId = 0; // TODO
            const index = Math.floor(Math.random() * (rows * col - 0)) + 0;
            map[index].isAdventure = true;
            map[index].adventure = {
                id: advId,
                difficulty: 3,
            };
        }

        return map;
    };
    const createGame = async () => {
        const map = generateMap();
        const data = { ...gameState };
        data.map = map;
        try {
            await axios.post("api/games", data);
            // console.log(response.data);
            props.history.push("/active-games");
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
