// const buildBtn = document.getElementById("build-btn");

// let chart = null;

// buildBtn.addEventListener("click", () => {

//     const points = parsePoints();

//     if (!points.length) {
//         alert("Введіть коректні точки!");
//         return;
//     }

//     renderTable(points);

//     const polynomial = buildLagrangePolynomial(points);

//     renderPolynomial(polynomial);

//     buildGraph(points);

// });

// function parsePoints() {

//     const text = document
//         .getElementById("points")
//         .value
//         .trim();

//     const lines = text.split("\n");

//     let points = [];

//     for (let line of lines) {

//         const [x, y] = line
//             .split(",")
//             .map(Number);

//         if (!isNaN(x) && !isNaN(y)) {

//             points.push({ x, y });

//         }

//     }

//     return points;
// }

// function renderTable(points) {

//     const container = document.getElementById("table-container");

//     let html = `

//         <table class="fade">

//             <thead>
//                 <tr>
//                     <th>#</th>
//                     <th>x</th>
//                     <th>y</th>
//                 </tr>
//             </thead>

//             <tbody>

//     `;

//     points.forEach((point, index) => {

//         html += `

//             <tr>
//                 <td>${index + 1}</td>
//                 <td>${point.x}</td>
//                 <td>${point.y}</td>
//             </tr>

//         `;

//     });

//     html += `

//             </tbody>

//         </table>

//     `;

//     container.innerHTML = html;
// }

// function lagrangeInterpolation(points, x) {

//     let result = 0;

//     for (let i = 0; i < points.length; i++) {

//         let term = points[i].y;

//         for (let j = 0; j < points.length; j++) {

//             if (i !== j) {

//                 term *=
//                     (x - points[j].x) /
//                     (points[i].x - points[j].x);

//             }

//         }

//         result += term;

//     }

//     return result;
// }

// function buildLagrangePolynomial(points) {

//     let formula = "L(x) = ";

//     for (let i = 0; i < points.length; i++) {

//         let part = `${points[i].y.toFixed(2)}`;

//         for (let j = 0; j < points.length; j++) {

//             if (i !== j) {

//                 part += `
//                 ((x - ${points[j].x}) / (${points[i].x} - ${points[j].x}))
//                 `;

//             }

//         }

//         formula += part;

//         if (i !== points.length - 1) {
//             formula += " + ";
//         }

//     }

//     return formula;
// }

// function renderPolynomial(polynomial) {

//     const area = document.getElementById("result-area");

//     area.innerHTML = `

//         <div class="polynomial-box fade">
//             ${polynomial}
//         </div>

//     `;
// }

// function buildGraph(points) {

//     const graphData = [];

//     const minX = Math.min(...points.map(p => p.x));
//     const maxX = Math.max(...points.map(p => p.x));

//     for (let x = minX; x <= maxX; x += 0.05) {

//         graphData.push({
//             x: x,
//             y: lagrangeInterpolation(points, x)
//         });

//     }

//     const ctx = document.getElementById("chart");

//     if (chart) {
//         chart.destroy();
//     }

//     chart = new Chart(ctx, {

//         type: "line",

//         data: {

//             datasets: [

//                 {
//                     label: "Поліном Лагранжа",

//                     data: graphData,

//                     parsing: false,

//                     borderWidth: 3,

//                     tension: 0.2
//                 },

//                 {
//                     label: "Вузли",

//                     data: points,

//                     type: "scatter",

//                     pointRadius: 6
//                 }

//             ]

//         },

//         options: {

//             responsive: true,

//             animation: {
//                 duration: 1500
//             },

//             plugins: {

//                 legend: {
//                     labels: {
//                         color: "white"
//                     }
//                 }

//             },

//             scales: {

//                 x: {

//     type: "linear",

//     ticks: {
//         color: "white"
//     },

//     grid: {
//         color: "#334155"
//     }

// },

//                 y: {

//                     ticks: {
//                         color: "white"
//                     },

//                     grid: {
//                         color: "#334155"
//                     }

//                 }

//             }

//         }

//     });

// }

const buildBtn = document.getElementById("build-btn");

let chart = null;

buildBtn.addEventListener("click", () => {

    const points = parsePoints();

    if (!points.length) {
        alert("Введіть коректні точки!");
        return;
    }

    renderTable(points);

    const method = document.getElementById("method").value;

    if (method === "lagrange") {

        renderPolynomial(
            buildLagrangePolynomial(points)
        );

        clearDifferences();

        buildGraph(points, "lagrange");

    } else {

        const table = buildDividedDifferences(points);

        renderNewtonPolynomial(table, points);

        renderDifferencesTable(table);

        buildGraph(points, "newton", table);

    }

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

function buildDividedDifferences(points) {

    const n = points.length;

    let table = Array.from(
        { length: n },
        () => Array(n).fill("")
    );

    for (let i = 0; i < n; i++) {
        table[i][0] = points[i].y;
    }

    for (let j = 1; j < n; j++) {

        for (let i = 0; i < n - j; i++) {

            table[i][j] =
                (
                    (table[i + 1][j - 1] - table[i][j - 1]) /
                    (points[i + j].x - points[i].x)
                );

        }

    }

    return table;
}

function newtonInterpolation(points, table, x) {

    let result = table[0][0];

    for (let i = 1; i < points.length; i++) {

        let product = table[0][i];

        for (let j = 0; j < i; j++) {

            product *= (x - points[j].x);

        }

        result += product;

    }

    return result;
}

function renderNewtonPolynomial(table, points) {

    let formula = "N(x) = ";

    formula += table[0][0].toFixed(4);

    for (let i = 1; i < points.length; i++) {

        formula += ` + (${table[0][i].toFixed(4)})`;

        for (let j = 0; j < i; j++) {

            formula += `(x - ${points[j].x})`;

        }

    }

    document.getElementById("result-area").innerHTML = `

        <div class="polynomial-box fade">
            ${formula}
        </div>

    `;
}

function renderPolynomial(polynomial) {

    document.getElementById("result-area").innerHTML = `

        <div class="polynomial-box fade">
            ${polynomial}
        </div>

    `;
}

function renderDifferencesTable(table) {

    const container =
        document.getElementById("differences-container");

    let html = `

        <table class="fade">

            <thead>
                <tr>
    `;

    for (let i = 0; i < table.length; i++) {

        html += `<th>Δ${i}</th>`;

    }

    html += `
                </tr>
            </thead>

            <tbody>
    `;

    for (let i = 0; i < table.length; i++) {

        html += `<tr>`;

        for (let j = 0; j < table.length; j++) {

            html += `

                <td>
                    ${table[i][j] !== ""
                        ? Number(table[i][j]).toFixed(4)
                        : ""}
                </td>

            `;

        }

        html += `</tr>`;
    }

    html += `

            </tbody>

        </table>

    `;

    container.innerHTML = html;
}

function clearDifferences() {

    document.getElementById(
        "differences-container"
    ).innerHTML = `

        <p class="placeholder">
            Побудуйте поліном Ньютона
        </p>

    `;
}

function buildGraph(points, method, table = null) {

    const graphData = [];

    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x));

    for (let x = minX; x <= maxX; x += 0.05) {

        let y;

        if (method === "lagrange") {

            y = lagrangeInterpolation(points, x);

        } else {

            y = newtonInterpolation(points, table, x);

        }

        graphData.push({ x, y });

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
                    label: method === "lagrange"
                        ? "Поліном Лагранжа"
                        : "Поліном Ньютона",

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
