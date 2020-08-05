/* eslint-disable */

import React, { useEffect, useState } from "react";
import "./Game.scss";
import Map from "../../components/Map/Map";
import GameNavBar from "../../components/GameNavBar/GameNavBar";
import AcceptPanel from "../../components/AcceptPanel/AcceptPanel";
import DicesView from "../../components/DicesView/DicesView";
import Loader from "../../components/Loader/Loader";
import CityView from "../../components/CityView/CityView";
import PlayerView from "../../components/PlayerView/PlayerView";
import diceData from "../../data/dice";
import items from "../../data/items";
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

    const [playerState, setPlayerState] = useState({
        userId: null,
    });

    const setLoading = (value) => {
        setState((state) => ({ ...state, loading: value }));
    };

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
        setLoading(true);
        const response = await axios.get(
            `http://localhost:8000/api/games/${props.match.params.gameId}`
        );
        const game = response.data.data.game;
        // console.log(game);
        // change map array to map2d array

        game.map = convertMapTo2d(game.map);
        setLoading(false);

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
            setPlayerState((playerState) => ({
                ...playerState,
                userId: user._id,
            }));

            if (
                game.currentPlay.dicesResult.length > 0 &&
                game.currentPlay.player == localStorage.getItem("userId")
            ) {
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
            setLoading(false);
        };
        getGameAndUser();
    }, []);

    const handleUserChange = async (newUser) => {
        const game = await getGame();
        setState((state) => ({ ...state, game, user: newUser }));
    };

    const updateUserAndGame = (newUser, newGame) => {
        newGame.map = convertMapTo2d(newGame.map);
        setState((state) => ({ ...state, game: newGame, user: newUser }));
    };

    const hideDicesResult = () => {
        setMoveState((moveState) => ({ ...moveState, showDices: false }));
    };

    const finishHandler = async () => {
        const game = await getGame();
        setState((state) => ({ ...state, game }));
    };

    const navClickHandler = async (nav) => {
        if (nav != "dices") {
            setState((state) => ({ ...state, card: nav }));
        }

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

    const goToField = async (x, y) => {
        setState((state) => ({ ...state, loading: true }));
        hideDicesResult();

        let status = "dices"; // empty field -> next player
        let itemId = null;
        let cityId = null;
        if (state.game.map[y][x].isCity) {
            // goes to City
            status = "city";
            if (state.game.availableItems.length > 0) {
                // zostały jeszcze wolne przedmioty
                const itemIndex =
                    Math.floor(
                        Math.random() * (state.game.availableItems.length - 0)
                    ) + 0;
                itemId = state.game.availableItems[itemIndex];
            }
            cityId = state.game.map[y][x].city;
        } else if (state.game.map[y][x].isAdventure) {
            status = "adventure";
        }
        const response = await axios.post(
            `http://localhost:8000/api/games/${state.game._id}/user/${state.game.currentPlay.player}/move`,
            { x, y, status, itemId, cityId }
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
        setLoading(false);
    };

    let map = null;
    let acceptpanel = null;
    let content = null;
    let gameNavBar = null;
    let dicesView = null;
    let whoPlaying = null;
    let cityView = null;

    if (state.game != null && state.user != null) {
        // console.log(state);

        // check if all accepted already
        let allAccepted = true;
        for (let i = 0; i < state.game.players.length; i++) {
            if (state.game.players[i].accepted === false) {
                allAccepted = false;
                break;
            }
        }
        if (allAccepted) {
            if (state.card === "map") {
                content = (
                    <Map
                        map={state.game.map}
                        players={state.game.players}
                        gameId={state.game._id}
                        possibleMoves={moveState.possibleMoves}
                        onFieldClick={goToField}
                    />
                );
            } else if (state.card === "player") {
                const playerToShow = state.game.players.filter(
                    (p) => p.user._id === playerState.userId
                )[0];
                content = <PlayerView player={playerToShow} />;
            }
            // else if (state.card === "dices") {
            //     content = "dices";
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
                if (state.game.currentPlay.status === "city") {
                    const currentPosition = state.user.games.filter(
                        (g) => g.game === state.game._id
                    )[0].player.position;
                    const field =
                        state.game.map[currentPosition.y][currentPosition.x];
                    const items = state.game.cities.filter(
                        (c) => c.cityId === field.city
                    )[0].items;

                    const player = state.user.games.filter(
                        (g) => g.game === state.game._id
                    )[0].player;

                    cityView = (
                        <CityView
                            cityId={field.city}
                            items={items}
                            gameId={state.game._id}
                            userId={state.user._id}
                            player={player}
                            finishHandler={finishHandler}
                            updateUserAndGame={updateUserAndGame}
                            setLoading={setLoading}
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
            {cityView}
        </div>
    );
};

export default Game;
