import React from "react";
import "./DicesView.scss";

const DicesView = (props) => {
    let dices = props.dices.map((dice, index) => {
        const images = [];
        for (const type in dice) {
            if (dice[type] === true) {
                images.push(
                    <img
                        src={require(`../../assets/${type}.png`)}
                        alt={type}
                        key={type}
                    />
                );
            }
        }
        return (
            <div className="dice" key={index}>
                {images}
            </div>
        );
    });
    return (
        <div id="DicesView" onClick={props.hideDicesResult}>
            <div className="bar">Wynik Twojego rzutu</div>
            {dices}
        </div>
    );
};

export default DicesView;
