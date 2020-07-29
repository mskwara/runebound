import React from "react";
import "./Map.scss";

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
    return <div id="Map">{map}</div>;
};

export default Map;
