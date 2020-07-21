import React from "react";
import "./SquareButton.scss";

const SquareButton = (props) => {
    return (
        <div id="SquareButton">
            <img
                src={require(`../../assets/${props.image}`)}
                alt={props.image}
            />
            <p className="title">{props.title}</p>
        </div>
    );
};

export default SquareButton;
