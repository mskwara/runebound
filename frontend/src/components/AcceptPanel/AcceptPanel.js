/* eslint-disable */

import React, { useState, useEffect } from "react";
import "./AcceptPanel.scss";
import axios from "axios";

const AcceptPanel = (props) => {
    const [state, setState] = useState({
        left: 12,
        archery: 0,
        sword: 0,
        magic: 0,
        health: 0,
        avatarNum: 1,
        accepted: false,
    });

    const toDoIfAccepted = () => {
        console.log(props);
        const player = props.user.games.find((el) => el.game == props.gameId)
            .player;
        console.log("player", player);
        setState((state) => ({
            ...state,
            left:
                12 -
                player.skills.archery -
                player.skills.sword -
                player.skills.magic -
                player.health.maxHealth,
            archery: player.skills.archery,
            sword: player.skills.sword,
            magic: player.skills.magic,
            health: player.health.maxHealth,
            avatarNum: player.avatar.slice(6),
            accepted: true,
        }));
    };

    useEffect(() => {
        console.log(props);
        if (
            props.players.find((el) => el.user._id == localStorage.userId)
                .accepted
        ) {
            toDoIfAccepted();
        }
    }, [props.user]);

    const accept = async () => {
        const data = {
            archery: state.archery,
            sword: state.sword,
            magic: state.magic,
            health: state.health,
            avatar: "knight" + state.avatarNum,
        };
        const response = await axios.post(
            `http://localhost:8000/api/games/${props.gameId}/user/${localStorage.userId}/accept`,
            data
        );
        setState((state) => ({ ...state, accepted: true }));
        props.handleUserChange(response.data.data.user);
    };

    const handlePointsChange = (skill) => {
        if (state.accepted) {
            console.log("Brak możliwości zmiany po zaakceptowaniu!");
            return;
        }
        if (state.left == 0) {
            console.log("Brak punktów.");
            return;
        }
        if (state[skill] == 5) {
            console.log("Osiągnięto już poziom 5 tej umiejętności");
            return;
        }
        if (skill === "health" && state[skill] == 4) {
            console.log("Osiągnięto już poziom 4 zdrowia");
            return;
        }
        if (
            (state.archery == 5 || state.sword == 5 || state.magic == 5) &&
            state[skill] == 4
        ) {
            console.log("Jedna umiejętność jest już na poziomie 5");
            return;
        }
        const newState = { ...state };
        newState[skill] += 1;
        newState.left -= 1;
        setState(newState);
    };

    const reset = () => {
        if (state.accepted) {
            console.log("Brak możliwości zmiany po zaakceptowaniu!");
            return;
        }
        setState({
            left: 12,
            archery: 0,
            sword: 0,
            magic: 0,
            health: 0,
            avatarNum: state.avatarNum,
        });
    };

    const switchAvatar = (factor) => {
        if (state.accepted) {
            console.log("Brak możliwości zmiany po zaakceptowaniu!");
            return;
        }
        const newState = { ...state };
        newState.avatarNum += factor;
        if (newState.avatarNum < 1) {
            newState.avatarNum = 8;
        } else if (newState.avatarNum > 8) {
            newState.avatarNum = 1;
        }
        setState(newState);
    };

    return (
        <div id="AcceptPanel">
            <div className="players">
                <div className="left">{state.left}</div>
                <div className="avatar-wrapper">
                    <img
                        className="switch-arrow arrow-left"
                        src={require("../../assets/switch_arrow.png")}
                        alt="avatar"
                        onClick={switchAvatar.bind(this, -1)}
                    />
                    <img
                        className="avatar"
                        src={require(`../../assets/avatars/knight${state.avatarNum}.png`)}
                        alt="avatar"
                    />
                    <img
                        className="switch-arrow arrow-right"
                        src={require("../../assets/switch_arrow.png")}
                        alt="avatar"
                        onClick={switchAvatar.bind(this, 1)}
                    />
                </div>
                <div className="skills">
                    <div className="one-skill">
                        <img
                            src={require("../../assets/skill_archery.png")}
                            alt="archery"
                            onClick={handlePointsChange.bind(this, "archery")}
                        />
                        {state.archery}
                    </div>
                    <div className="one-skill">
                        <img
                            src={require("../../assets/skill_sword.png")}
                            alt="sword"
                            onClick={handlePointsChange.bind(this, "sword")}
                        />
                        {state.sword}
                    </div>
                    <div className="one-skill">
                        <img
                            src={require("../../assets/skill_magic.png")}
                            alt="magic"
                            onClick={handlePointsChange.bind(this, "magic")}
                        />
                        {state.magic}
                    </div>
                    <div className="one-skill">
                        <img
                            src={require("../../assets/health.png")}
                            alt="health"
                            onClick={handlePointsChange.bind(this, "health")}
                        />
                        {state.health}
                    </div>
                </div>
                <button
                    className="btnReset"
                    onClick={reset}
                    disabled={state.accepted}
                >
                    Resetuj umiejętności
                </button>
            </div>
            <button
                className="btnAccept"
                onClick={accept}
                disabled={state.accepted}
            >
                {state.accepted
                    ? "Gra została zaakceptowana"
                    : "Zaakceptuj zaproszenie"}
            </button>
        </div>
    );
};

export default AcceptPanel;
