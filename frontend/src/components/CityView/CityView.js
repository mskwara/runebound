import React, { useState } from "react";
import "./CityView.scss";
import cities from "../../data/cities";
import ItemCard from "../ItemCard/ItemCard";
import axios from "axios";
// import items from "../../data/items";

const CityView = (props) => {
    const [state, setState] = useState({
        left: 0,
        right: 2,
    });

    const scrollItems = (factor) => {
        if (factor === 1) {
            setState((state) => ({
                ...state,
                left: state.left + 1,
                right: state.right + 1,
            }));
        } else if (factor === -1) {
            setState((state) => ({
                ...state,
                left: state.left - 1,
                right: state.right - 1,
            }));
        }
    };

    const buyItem = async (itemId, price) => {
        props.setLoading(true);
        const data = {
            cityId: props.cityId,
            itemId: itemId,
            price: price,
        };
        const response = await axios.post(
            `http://localhost:8000/api/games/${props.gameId}/user/${props.userId}/buyItem`,
            data
        );
        props.updateUserAndGame(
            response.data.data.user,
            response.data.data.game
        );
        props.setLoading(false);
    };

    const finishTurn = async () => {
        await axios.post(
            `http://localhost:8000/api/games/${props.gameId}/user/${props.userId}/finishTurn`,
            { status: "dices" }
        );
        props.finishHandler();
    };
    const items = [...props.items];
    items.reverse();
    const itemsCards = items.map((itemId, index) => {
        if (index >= state.left && index <= state.right) {
            return (
                <ItemCard
                    itemId={itemId}
                    player={props.player}
                    key={index}
                    buyHandler={buyItem}
                />
            );
        }
        return null;
    });

    let leftArrow = null;
    let rightArrow = null;
    if (state.left > 0) {
        leftArrow = (
            <img
                className="switch-arrow arrow-left arrow-left-hover"
                src={require("../../assets/switch_arrow.png")}
                alt="arrow"
                onClick={scrollItems.bind(this, -1)}
            />
        );
    } else {
        leftArrow = (
            <img
                className="switch-arrow arrow-left"
                style={{ opacity: 0.5 }}
                src={require("../../assets/switch_arrow.png")}
                alt="arrow"
            />
        );
    }
    if (state.right < props.items.length - 1) {
        rightArrow = (
            <img
                className="switch-arrow arrow-right arrow-right-hover"
                src={require("../../assets/switch_arrow.png")}
                alt="arrow"
                onClick={scrollItems.bind(this, 1)}
            />
        );
    } else {
        rightArrow = (
            <img
                className="switch-arrow arrow-right"
                style={{ opacity: 0.5 }}
                src={require("../../assets/switch_arrow.png")}
                alt="arrow"
            />
        );
    }

    return (
        <div id="CityView">
            <span>
                <img
                    className="cityIcon"
                    src={require("../../assets/city_icon.png")}
                    alt="city_icon"
                />
                <p className="cityName">{cities[props.cityId].name}</p>
            </span>
            <div className="storeWrapper">
                {leftArrow}
                <div className="store">{itemsCards}</div>
                {rightArrow}
            </div>
            <button className="finish" onClick={finishTurn}>
                Zakończ turę
            </button>
        </div>
    );
};

export default CityView;
