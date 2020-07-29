import React, { useEffect, useState } from "react";

import "./ActiveGames.scss";
import GameTile from "../../components/GameTile/GameTile";
import axios from "axios";

const ActiveGames = (props) => {
    const [state, setState] = useState({
        games: [],
    });
    useEffect(() => {
        const getGames = async () => {
            const response = await axios.get(
                `api/games/user/${localStorage.getItem("userId")}`
            );
            const games = response.data.data.games;

            // change map array to map2d array
            const rows = 9;
            const columns = 20;
            games.map((game) => {
                const map = game.map;
                const map2d = [];
                for (let i = 0; i < rows * columns; i += columns) {
                    const oneRow = map.slice(i, i + columns);
                    map2d.push(oneRow);
                }
                game.map = map2d;
                return game;
            });

            setState({ games });
        };
        getGames();
    }, []);

    const gameTiles = state.games.map((game) => {
        return <GameTile history={props.history} game={game} key={game._id} />;
    });

    return <div id="ActiveGames">{gameTiles}</div>;
};

export default ActiveGames;
