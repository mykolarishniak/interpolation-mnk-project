const loadBtn = document.getElementById("load-btn");

loadBtn.addEventListener("click", () => {

    const points = parsePoints();

    if (!points.length) {
        alert("Введіть коректні точки!");
        return;
    }

    renderTable(points);

});

function parsePoints() {

    const text = document
        .getElementById("points")
        .value
        .trim();

    const lines = text.split("\n");

    let points = [];

    for (let line of lines) {

        const [x, y] = line
            .split(",")
            .map(Number);

        if (!isNaN(x) && !isNaN(y)) {

            points.push({
                x,
                y
            });

        }

    }

    return points;
}

function renderTable(points) {

    const container = document.getElementById("table-container");

    let html = `

        <table class="fade">

            <thead>
                <tr>
                    <th>#</th>
                    <th>x</th>
                    <th>y</th>
                </tr>
            </thead>

            <tbody>

    `;

    points.forEach((point, index) => {

        html += `

            <tr>
                <td>${index + 1}</td>
                <td>${point.x}</td>
                <td>${point.y}</td>
            </tr>

        `;

    });

    html += `

            </tbody>

        </table>

    `;

    container.innerHTML = html;
}
