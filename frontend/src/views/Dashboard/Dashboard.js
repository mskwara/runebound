import React from "react";

import "./Dashboard.scss";
import SquareButton from "../../components/SquareButton/SquareButton";

const Dashboard = (props) => {
    return (
        <div id="Dashboard">
            <SquareButton
                to="active-games"
                title="Trwające gry"
                image="active-games.png"
            />
            <SquareButton to="new-game" title="Nowa gra" image="new-game.png" />
            <SquareButton to="stats" title="Statystyki" image="stats.png" />
            <SquareButton to="chat" title="Czat" image="chat.png" />
        </div>
    );
};

export default Dashboard;
