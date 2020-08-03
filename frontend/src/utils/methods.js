exports.getPossibleMoves = (map, dices, startX, startY) => {
    const maxI = 8;
    const maxJ = 19;
    const dicesCount = dices.length;
    const DFSVisit = (
        i,
        j,
        visited,
        result,
        dices,
        distances,
        prevI,
        prevJ
    ) => {
        visited[i][j] = true;

        if (prevI != null && prevJ != null) {
            if (
                distances[i][j] === null ||
                distances[prevI][prevJ] + 1 < distances[i][j]
            ) {
                distances[i][j] = distances[prevI][prevJ] + 1;
            }
        }
        result.push({
            x: j,
            y: i,
        });

        const toDoForConnectedField = (x, y, prevX, prevY) => {
            let possibleChoices = null;
            if (map[x][y].isCity === false) {
                const fieldType = map[x][y].terrain;
                possibleChoices = dices.filter((el) => {
                    return el[fieldType] === true;
                });
                possibleChoices = possibleChoices.map((el) =>
                    dices.indexOf(el)
                );
            } else {
                possibleChoices = [...dices.keys()];
            }

            possibleChoices.forEach((index) => {
                const updatedDices = [...dices];
                updatedDices.splice(index, 1);
                DFSVisit(
                    x,
                    y,
                    visited,
                    result,
                    updatedDices,
                    distances,
                    prevX,
                    prevY
                );
            });
        };

        // const minusPrevI = prevI != null ? prevI : 0;
        // const minusPrevJ = prevJ != null ? prevJ : 0;

        if (
            i - 1 >= 0 &&
            (visited[i - 1][j] === false ||
                (distances[i - 1][j] != null &&
                    distances[i][j] + 1 <= distances[i - 1][j]))
        ) {
            // top
            toDoForConnectedField(i - 1, j, i, j);
        }
        if (
            i + 1 <= maxI &&
            (visited[i + 1][j] === false ||
                (distances[i + 1][j] != null &&
                    distances[i][j] + 1 <= distances[i + 1][j]))
        ) {
            // bottom
            toDoForConnectedField(i + 1, j, i, j);
        }
        if (
            j + 1 <= maxJ &&
            (visited[i][j + 1] === false ||
                (distances[i][j + 1] != null &&
                    distances[i][j] + 1 <= distances[i][j + 1]))
        ) {
            // right
            toDoForConnectedField(i, j + 1, i, j);
        }
        if (
            j - 1 >= 0 &&
            (visited[i][j - 1] === false ||
                (distances[i][j - 1] != null &&
                    distances[i][j] + 1 <= distances[i][j - 1]))
        ) {
            // left
            toDoForConnectedField(i, j - 1, i, j);
        }
        if (j % 2 == 0) {
            // dla parzystych x
            if (
                i - 1 >= 0 &&
                j + 1 <= maxJ &&
                (visited[i - 1][j + 1] === false ||
                    (distances[i - 1][j + 1] != null &&
                        distances[i][j] + 1 <= distances[i - 1][j + 1]))
            ) {
                // top-right
                toDoForConnectedField(i - 1, j + 1, i, j);
            }
            if (
                i - 1 >= 0 &&
                j - 1 >= 0 &&
                (visited[i - 1][j - 1] === false ||
                    (distances[i - 1][j - 1] != null &&
                        distances[i][j] + 1 <= distances[i - 1][j - 1]))
            ) {
                // top-left
                toDoForConnectedField(i - 1, j - 1, i, j);
            }
        } else {
            // dla nieparzystych x
            if (
                i + 1 <= maxI &&
                j + 1 <= maxJ &&
                (visited[i + 1][j + 1] === false ||
                    (distances[i + 1][j + 1] != null &&
                        distances[i][j] + 1 <= distances[i + 1][j + 1]))
            ) {
                // bottom-right
                toDoForConnectedField(i + 1, j + 1, i, j);
            }
            if (
                i + 1 <= maxI &&
                j - 1 >= 0 &&
                (visited[i + 1][j - 1] === false ||
                    (distances[i + 1][j - 1] != null &&
                        distances[i][j] + 1 <= distances[i + 1][j - 1]))
            ) {
                // bottom-left
                toDoForConnectedField(i + 1, j - 1, i, j);
            }
        }
    };

    const visited = [...Array(9)].map((el) =>
        [...Array(20)].map((el) => false)
    );
    const distances = [...Array(9)].map((el) =>
        [...Array(20)].map((el) => null)
    );
    distances[startY][startX] = 0;
    const result = [];

    DFSVisit(startY, startX, visited, result, dices, distances, null, null);
    return result;
};
