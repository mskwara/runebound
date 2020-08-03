import axios from "axios";

const items = [
    {
        name: "Kolczuga",
        type: "shield",
        usage: "every-round",
        description: "Aktywuj tę kartę, aby anulować do 2 ran zadanych twojemu Bohaterowi.",
        action: (gameId) => {
            const update = {
                $inc: {
                    "games.$.player.health.current": 2
                }
            }
            await axios.patch(`http://localhost:8000/api/games/${gameId}/user/${localStorage.getItem("userId")}/updatePlayer`,
                { 
                    update
                }
            );
        }
    }
]
