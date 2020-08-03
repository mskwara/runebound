import React, { useEffect, useState } from "react";
import "./Map.scss";
import axios from "axios";

const Map = (props) => {
    let map = [];
    for (let row = 0; row < 9; row++) {
        // rows
        for (let col = 0; col < 20; col++) {
            // columns
            const style = {};
            const rightVal = col * 60;
            style.left = `${rightVal}px`;
            let topVal = row * 68;
            if (col % 2 !== 0) {
                topVal += 33;
            }
            style.top = `${topVal}px`;

            if (props.possibleMoves != null) {
                style.opacity = 0.5;
                if (
                    props.possibleMoves.filter(
                        (field) => field.x === col && field.y === row
                    ).length > 0
                ) {
                    style.opacity = 1;
                }
            }

            if (!props.map[row][col].isCity) {
                // no city
                if (!props.map[row][col].isAdventure) {
                    //no adventure
                    map.push(
                        <div
                            className="field"
                            style={style}
                            key={row * 20 + col}
                        >
                            <img
                                src={require(`../../assets/${props.map[row][col].terrain}.png`)}
                                alt="field"
                            />
                        </div>
                    );
                } else {
                    // is adventure
                    const advClass = `adventure diff${props.map[row][col].adventure.difficulty}`;
                    map.push(
                        <div
                            className="field"
                            style={style}
                            key={row * 20 + col}
                        >
                            <img
                                src={require(`../../assets/${props.map[row][col].terrain}.png`)}
                                alt="field"
                            />
                            <div className={advClass} />
                        </div>
                    );
                }
            } else {
                // is city
                map.push(
                    <div className="field" style={style} key={row * 20 + col}>
                        <img
                            src={require(`../../assets/field_city.png`)}
                            alt="city"
                        />
                    </div>
                );
            }
        }
    }

    let positionTable = [...Array(20)].map((el) =>
        [...Array(9)].map((el) => 0)
    );

    const players = props.players.map((p) => {
        let multiFactor = 0;
        if (positionTable[p.character.position.x][p.character.position.y] > 0) {
            multiFactor =
                positionTable[p.character.position.x][p.character.position.y] *
                4;
        }
        positionTable[p.character.position.x][p.character.position.y] += 1;
        let plusTop = 68 * p.character.position.y;
        if (p.character.position.x % 2 != 0) {
            plusTop += 34;
        }
        const style = {
            left: 23 + 60 * p.character.position.x + multiFactor,
            top: 18 + plusTop - multiFactor,
        };
        return (
            <img
                src={require(`../../assets/avatars/${p.character.avatar}.png`)}
                alt="avatar"
                style={style}
                className="avatar"
                key={p._id}
            />
        );
    });

    return (
        <div id="Map">
            {map}
            {players}
        </div>
    );
};

export default Map;
