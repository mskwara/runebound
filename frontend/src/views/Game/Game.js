/* eslint-disable */

import React, { useEffect, useState } from "react";
import "./Game.scss";
import Map from "../../components/Map/Map";
import AcceptPanel from "../../components/AcceptPanel/AcceptPanel";
import axios from "axios";

const Game = (props) => {
    const [state, setState] = useState({
        game: null,
        user: null,
    });

    const getGame = async () => {
        const response = await axios.get(
            `http://localhost:8000/api/games/${props.match.params.gameId}`
        );
        const game = response.data.data.game;
        // change map array to map2d array
        const rows = 9;
        const columns = 20;
        const map = game.map;
        const map2d = [];
        for (let i = 0; i < rows * columns; i += columns) {
            const oneRow = map.slice(i, i + columns);
            map2d.push(oneRow);
        }
        game.map = map2d;
        return game;
    };

    useEffect(() => {
        const getGameAndUser = async () => {
            const game = await getGame();

            const response2 = await axios.get(
                `http://localhost:8000/api/users/${localStorage.getItem(
                    "userId"
                )}`
            );
            const user = response2.data.data.user;

            setState({ game, user });
        };

        getGameAndUser();
    }, []);

    const handleUserChange = (newUser) => {
        setState((state) => ({ ...state, user: newUser }));
        getGame();
    };
    let map = null;
    let acceptpanel = null;
    let content = null;
    if (state.game != null && state.user != null) {
        map = <Map map={state.game.map} />;
        acceptpanel = (
            <AcceptPanel
                players={state.game.players}
                gameId={state.game._id}
                user={state.user}
                handleUserChange={handleUserChange}
            />
        );
        content = acceptpanel;
        let allAccepted = true;
        console.log("stategame", state.game);
        for (let i = 0; i < state.game.players.length; i++) {
            if (state.game.players[i].accepted === false) {
                allAccepted = false;
                break;
            }
        }
        if (allAccepted) content = map;
    }

    return <div id="Game">{content}</div>;
};

export default Game;
