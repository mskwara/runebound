import React from "react";
import "./ItemCard.scss";
import items from "../../data/items";

const ItemCard = (props) => {
    const item = items[props.itemId];
    let itemType = null;
    if (item.type === "shield") {
        itemType = "Pancerz";
    } else if (item.type === "weapon") {
        itemType = "Broń";
    } else if (item.type === "rune") {
        itemType = "Run";
    }

    // check possibility to buy
    let disabled = false;
    let whyDisabled = null;
    if (props.player.money < item.price) {
        disabled = true;
        whyDisabled = "Nie masz wystarczającej ilości pieniędzy.";
    }
    let sameType = 0;
    props.player.items.forEach((itemId) => {
        if (items[itemId].type === item.type) {
            sameType++;
        }
    });
    if (item.type === "shield" && sameType === 1) {
        disabled = true;
        whyDisabled = "Możesz posiadać tylko jeden pancerz.";
    } else if (item.type === "weapon" && sameType === 2) {
        disabled = true;
        whyDisabled = "Możesz posiadać tylko dwie bronie.";
    }
    // END check possibility to buy
    let mainClass = "";
    if (disabled) {
        mainClass = "notAllowed";
    }

    return (
        <div id="ItemCard" className={mainClass} disabled={disabled}>
            <div className="coin">
                <img src={require("../../assets/coin.png")} alt="coin" />
                <div className="white-bg">{item.price}</div>
            </div>
            <div className="name">{item.name}</div>
            <img
                className="item_usage"
                src={require(`../../assets/${item.usage}.png`)}
                alt={item.usage}
            />
            <span>
                <img
                    className="item_pic"
                    src={require(`../../assets/item_${item.type}.png`)}
                    alt={item.type}
                />
                <p>{itemType}</p>
            </span>
            <p className="description">{item.description}</p>
            <p className="whyDisabled">{whyDisabled}</p>
            <button
                className="button"
                onClick={props.buyHandler.bind(this, props.itemId, item.price)}
                disabled={disabled}
            >
                Kup przedmiot
            </button>
        </div>
    );
};

export default ItemCard;
