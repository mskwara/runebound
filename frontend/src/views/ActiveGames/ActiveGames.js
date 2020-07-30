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
