import React from "react";
import "./PlayerView.scss";

const PlayerView = (props) => {
    return (
        <div id="PlayerView">
            <span>
                <img
                    src={require(`../../assets/avatars/${props.player.character.avatar}.png`)}
                />
                <p>{props.player.user.nick}</p>
            </span>

            <div className="skills">
                <div className="one-skill">
                    <img
                        src={require("../../assets/skill_archery.png")}
                        alt="archery"
                    />
                    <span>
                        <p className="big">
                            {props.player.character.skills.archery}
                        </p>
                        <p className="small">
                            /{props.player.character.health.maxHealth}
                        </p>
                    </span>
                </div>
                <div className="one-skill">
                    <img
                        src={require("../../assets/skill_sword.png")}
                        alt="sword"
                    />
                    <span>
                        <p className="big">
                            {props.player.character.skills.sword}
                        </p>
                        <p className="small">
                            /{props.player.character.health.maxHealth}
                        </p>
                    </span>
                </div>
                <div className="one-skill">
                    <img
                        src={require("../../assets/skill_magic.png")}
                        alt="magic"
                    />
                    <span>
                        <p className="big">
                            {props.player.character.skills.magic}
                        </p>
                        <p className="small">
                            /{props.player.character.health.maxHealth}
                        </p>
                    </span>
                </div>
                <div className="one-skill">
                    <img
                        src={require("../../assets/health.png")}
                        alt="health"
                    />
                    <span>
                        <p className="big">
                            {props.player.character.health.current}
                        </p>
                        <p className="small">
                            /{props.player.character.health.maxHealth}
                        </p>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PlayerView;
