import React, { useEffect, useState } from "react";
import "./PlayersSelect.scss";
import axios from "axios";

const PlayersSelect = (props) => {
    const [state, setState] = useState({
        users: [],
        selected: [],
    });
    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axios.get("api/users");
                const users = response.data.data.users;
                const newState = { ...state };
                newState.users = users;
                setState(newState);
            } catch (err) {
                console.log(err);
            }
        };
        getUsers();
    }, []);

    const selectUser = (index) => {
        const clickedUser = state.users[index];
        if (!state.selected.includes(clickedUser)) {
            const newState = { ...state };
            newState.selected.push(state.users[index]);
            setState(newState);
        } else {
            const newState = { ...state };
            const inxOfUser = state.selected.indexOf(clickedUser);
            newState.selected.splice(inxOfUser, 1);
            setState(newState);
        }
        props.onPlayersChange(state.selected);
    };
    const list = state.users.map((user, index) => {
        let icon = null;
        if (state.selected.includes(user)) {
            icon = (
                <img
                    src={require(`../../assets/accept.png`)}
                    alt="selected"
                    className="icon"
                />
            );
        }
        return (
            <div
                className="row"
                key={user._id}
                onClick={selectUser.bind(this, index)}
            >
                {icon}
                {user.nick}
            </div>
        );
    });

    return (
        <div id="PlayersSelect" style={props.style}>
            <p>Wybierz osoby do gry:</p>
            {list}
        </div>
    );
};

export default PlayersSelect;
