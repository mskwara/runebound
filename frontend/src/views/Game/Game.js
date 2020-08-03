/* eslint-disable */

import React, { useEffect, useState } from "react";
import "./Game.scss";
import Map from "../../components/Map/Map";
import GameNavBar from "../../components/GameNavBar/GameNavBar";
import AcceptPanel from "../../components/AcceptPanel/AcceptPanel";
import DicesView from "../../components/DicesView/DicesView";
import Loader from "../../components/Loader/Loader";
import diceData from "../../data/dice";
import { getPossibleMoves } from "../../utils/methods";
import axios from "axios";

const Game = (props) => {
    const [state, setState] = useState({
        game: null,
        user: null,
        card: "map",
        loading: true,
    });

    const [moveState, setMoveState] = useState({
        possibleMoves: null,
        dicesResult: null,
        showDices: false,
    });

    const convertMapTo2d = (plainMap) => {
        const rows = 9;
        const columns = 20;
        const map2d = [];
        for (let i = 0; i < rows * columns; i += columns) {
            const oneRow = plainMap.slice(i, i + columns);
            map2d.push(oneRow);
        }
        return map2d;
    };

    const getGame = async () => {
        setState((state) => ({ ...state, loading: true }));
        const response = await axios.get(
            `http://localhost:8000/api/games/${props.match.params.gameId}`
        );
        const game = response.data.data.game;
        // console.log(game);
        // change map array to map2d array

        game.map = convertMapTo2d(game.map);
        setState((state) => ({ ...state, loading: false }));

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

            setState((state) => ({ ...state, game, user }));

            if (
                game.currentPlay.dicesResult.length > 0 &&
                game.currentPlay.player == localStorage.getItem("userId")
            ) {
                console.log("bla bla bla");
                // jeżeli zostały już rzucone kości i jest ruch zalogowanej osoby
                const loggedPlayer = user.games.filter(
                    (el) => el.game == game._id
                )[0].player;
                const possibleMoves = getPossibleMoves(
                    game.map,
                    game.currentPlay.dicesResult,
                    loggedPlayer.position.x,
                    loggedPlayer.position.y
                );
                setMoveState((moveState) => ({
                    ...moveState,
                    dicesResult: game.currentPlay.dicesResult,
                    possibleMoves,
                    showDices: true,
                }));
            }
            setState((state) => ({ ...state, loading: false }));
        };
        getGameAndUser();
    }, []);

    const handleUserChange = (newUser) => {
        setState((state) => ({ ...state, user: newUser }));
        getGame();
    };

    const hideDicesResult = () => {
        setMoveState((moveState) => ({ ...moveState, showDices: false }));
    };

    const goToField = async (x, y) => {
        setState((state) => ({ ...state, loading: true }));
        let status = "dices"; // empty field -> next player
        if (state.game.map[y][x].isCity) {
            status = "city";
        } else if (state.game.map[y][x].isAdventure) {
            status = "adventure";
        }
        const response = await axios.post(
            `http://localhost:8000/api/games/${state.game._id}/user/${state.game.currentPlay.player}/move`,
            { x, y, status }
        );
        response.data.data.game.map = convertMapTo2d(
            response.data.data.game.map
        );
        setState((state) => ({
            ...state,
            game: response.data.data.game,
            user: response.data.data.user,
        }));

        setMoveState((moveState) => ({
            ...moveState,
            possibleMoves: null,
        }));
        setState((state) => ({ ...state, loading: false }));
    };

    const navClickHandler = async (nav) => {
        setState((state) => ({ ...state, card: nav }));

        if (nav === "dices") {
            const dicesResult = [];
            for (let i = 0; i < 4; i++) {
                const side = Math.floor(Math.random() * (6 - 0)) + 0;
                dicesResult.push(diceData[side]);
            }

            // console.log("rzut", dicesResult);
            setMoveState((moveState) => ({ ...moveState, dicesResult }));
            const loggedPlayer = state.user.games.filter(
                (el) => el.game == state.game._id
            )[0].player;
            // console.log(
            //     "starting: ",
            //     loggedPlayer.position.x,
            //     loggedPlayer.position.y
            // );
            const possibleMoves = getPossibleMoves(
                state.game.map,
                dicesResult,
                loggedPlayer.position.x,
                loggedPlayer.position.y
            );
            setMoveState((moveState) => ({
                ...moveState,
                possibleMoves,
                showDices: true,
            }));

            const response = await axios.post(
                `http://localhost:8000/api/games/${state.game._id}/setDices`,
                { dicesResult, status: "move" }
            );
            response.data.data.game.map = convertMapTo2d(
                response.data.data.game.map
            );
            setState((state) => ({ ...state, game: response.data.data.game }));
        }
    };

    let map = null;
    let acceptpanel = null;
    let content = null;
    let gameNavBar = null;
    let dicesView = null;
    let whoPlaying = null;

    if (state.game != null && state.user != null) {
        // console.log(state);

        map = (
            <Map
                map={state.game.map}
                players={state.game.players}
                gameId={state.game._id}
                possibleMoves={moveState.possibleMoves}
                onFieldClick={goToField}
            />
        );
        // check if all accepted already
        let allAccepted = true;
        for (let i = 0; i < state.game.players.length; i++) {
            if (state.game.players[i].accepted === false) {
                allAccepted = false;
                break;
            }
        }
        if (allAccepted) {
            // if (state.card === "map") {
            content = map;
            // }
            // else if (state.card === "dices") {
            //     content = "dices";
            // } else if (state.card === "adventure") {
            //     content = "adventure";
            // }
        } else {
            //find first city
            let cityPos = null;
            for (let i = 0; i < state.game.map.length; i++) {
                for (let j = 0; j < state.game.map[i].length; j++) {
                    if (state.game.map[i][j].isCity === true) {
                        cityPos = {
                            x: i,
                            y: j,
                        };
                        break;
                    }
                }
                if (cityPos != null) {
                    break;
                }
            }
            acceptpanel = (
                <AcceptPanel
                    players={state.game.players}
                    gameId={state.game._id}
                    user={state.user}
                    startPosition={cityPos}
                    handleUserChange={handleUserChange}
                />
            );
            content = acceptpanel;
        }
        if (state.game.round >= 1) {
            //jeśli gra się zaczęła
            if (
                state.game.currentPlay.player == localStorage.getItem("userId")
            ) {
                // i jest ruch zalogowanej osoby
                gameNavBar = (
                    <GameNavBar
                        navClickHandler={navClickHandler}
                        status={state.game.currentPlay.status}
                    />
                );

                if (moveState.showDices === true) {
                    dicesView = (
                        <DicesView
                            dices={moveState.dicesResult}
                            hideDicesResult={hideDicesResult}
                        />
                    );
                }
            } else {
                //ruch innej osoby
                const nick = state.game.players.filter(
                    (p) => p.user._id == state.game.currentPlay.player
                )[0].user.nick;
                whoPlaying = (
                    <div className="whoPlaying">Tura gracza {nick}</div>
                );
            }
        }
    }

    return (
        <div id="Game">
            {state.loading ? <Loader /> : null}
            {whoPlaying}
            {content}
            {gameNavBar}
            {dicesView}
        </div>
    );
};

export default Game;
