import axios from "axios";

const items = [
    {
        name: "Kolczuga",
        type: "shield",
        usage: "every-round",
        price: 17,
        description:
            "Aktywuj tę kartę, aby anulować do 2 ran zadanych twojemu Bohaterowi.",
        action: async (gameId) => {
            const update = {
                $inc: {
                    "games.$.player.health.current": 2,
                },
            };
            await axios.patch(
                `http://localhost:8000/api/games/${gameId}/user/${localStorage.getItem(
                    "userId"
                )}/updatePlayer`,
                {
                    update,
                }
            );
        },
    },
    {
        name: "Topór",
        type: "weapon",
        usage: "disposable",
        price: 1,
        description: "Aktywuj tę kartę by rzucić toporem zadając jedną ranę.",
        action: () => {
            console.log("Not implemented");
        },
    },
    {
        name: "Topór2",
        type: "weapon",
        usage: "disposable",
        price: 3,
        description: "Aktywuj tę kartę by rzucić toporem zadając jedną ranę.",
        action: () => {
            console.log("Not implemented");
        },
    },
    {
        name: "Topór3",
        type: "weapon",
        usage: "disposable",
        price: 3,
        description: "Aktywuj tę kartę by rzucić toporem zadając jedną ranę.",
        action: () => {
            console.log("Not implemented");
        },
    },
    {
        name: "Run magiczny",
        type: "rune",
        usage: "forever",
        price: 9,
        description:
            "Gdy posiadasz tą kartę, dodaj +2 do pierwszego rzutu ataku.",
        action: () => {
            console.log("Not implemented");
        },
    },
];

export default items;
