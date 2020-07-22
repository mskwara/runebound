import React from "react";
import "./SquareButton.scss";
import { Link } from "react-router-dom";

const SquareButton = (props) => {
    let img = null;
    if (props.image) {
        img = (
            <img
                src={require(`../../assets/${props.image}`)}
                alt={props.image}
            />
        );
    }

    let content = (
        <div id="SquareButton">
            {img}
            <p className="title">{props.title || "Untitled"}</p>
        </div>
    );
    if (props.to) {
        content = (
            <Link to={props.to} className="link">
                <div id="SquareButton">
                    {img}
                    <p className="title">{props.title || "Untitled"}</p>
                </div>
            </Link>
        );
    }

    return <div>{content}</div>;
};

export default SquareButton;
