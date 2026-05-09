const buildBtn = document.getElementById("build-btn");

let chart = null;

buildBtn.addEventListener("click", () => {

    const points = parsePoints();

    if (!points.length) {
        alert("Введіть коректні точки!");
        return;
    }

    renderTable(points);

    const polynomial = buildLagrangePolynomial(points);

    renderPolynomial(polynomial);

    buildGraph(points);

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

            points.push({ x, y });

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

function lagrangeInterpolation(points, x) {

    let result = 0;

    for (let i = 0; i < points.length; i++) {

        let term = points[i].y;

        for (let j = 0; j < points.length; j++) {

            if (i !== j) {

                term *=
                    (x - points[j].x) /
                    (points[i].x - points[j].x);

            }

        }

        result += term;

    }

    return result;
}

function buildLagrangePolynomial(points) {

    let formula = "L(x) = ";

    for (let i = 0; i < points.length; i++) {

        let part = `${points[i].y.toFixed(2)}`;

        for (let j = 0; j < points.length; j++) {

            if (i !== j) {

                part += `
                ((x - ${points[j].x}) / (${points[i].x} - ${points[j].x}))
                `;

            }

        }

        formula += part;

        if (i !== points.length - 1) {
            formula += " + ";
        }

    }

    return formula;
}

function renderPolynomial(polynomial) {

    const area = document.getElementById("result-area");

    area.innerHTML = `

        <div class="polynomial-box fade">
            ${polynomial}
        </div>

    `;
}

function buildGraph(points) {

    const graphData = [];

    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x));

    for (let x = minX; x <= maxX; x += 0.05) {

        graphData.push({
            x: x,
            y: lagrangeInterpolation(points, x)
        });

    }

    const ctx = document.getElementById("chart");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {

        type: "line",

        data: {

            datasets: [

                {
                    label: "Поліном Лагранжа",

                    data: graphData,

                    parsing: false,

                    borderWidth: 3,

                    tension: 0.2
                },

                {
                    label: "Вузли",

                    data: points,

                    type: "scatter",

                    pointRadius: 6
                }

            ]

        },

        options: {

            responsive: true,

            animation: {
                duration: 1500
            },

            plugins: {

                legend: {
                    labels: {
                        color: "white"
                    }
                }

            },

            scales: {

                x: {

    type: "linear",

    ticks: {
        color: "white"
    },

    grid: {
        color: "#334155"
    }

},

                y: {

                    ticks: {
                        color: "white"
                    },

                    grid: {
                        color: "#334155"
                    }

                }

            }

        }

    });

}
