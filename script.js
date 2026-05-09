const buildBtn = document.getElementById("build-btn");

let chart = null;

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

function buildCustomGraph(
    points,
    method,
    canvasId,
    table = null,
    coefficients = null
) {

    const graphData = [];

    const minX =
        Math.min(...points.map(p => p.x));

    const maxX =
        Math.max(...points.map(p => p.x));

    for (let x = minX; x <= maxX; x += 0.05) {

        let y;

        if (method === "lagrange") {

            y =
                lagrangeInterpolation(points, x);

        }

        else if (method === "newton") {

            y =
                newtonInterpolation(
                    points,
                    table,
                    x
                );

        }

        else {

            y =
                leastSquaresValue(
                    coefficients,
                    x
                );

        }

        graphData.push({ x, y });

    }

    const ctx =
        document.getElementById(canvasId);

    if (Chart.getChart(ctx)) {

        Chart.getChart(ctx).destroy();

    }

    let datasets = [

        {
            label:
                method === "lagrange"
                    ? "Поліном Лагранжа"
                    : method === "newton"
                        ? "Поліном Ньютона"
                        : "МНК",

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

    ];

    if (method === "leastSquares") {

        datasets.push({

            label: "Залишки",

            type: "line",

            data: points.map(point => ({

                x: point.x,

                y: leastSquaresValue(
                    coefficients,
                    point.x
                )

            })),

            borderDash: [5, 5],

            borderWidth: 2,

            pointRadius: 0

        });

    }

    new Chart(ctx, {

        type: "line",

        data: {

            datasets: datasets

        },

        options: {

            animation: {
                duration: 2500
            },

            responsive: true,

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

function leastSquares(points, degree = 2) {

    const n = points.length;

    let X = [];
    let Y = [];

    for (let i = 0; i < n; i++) {

        let row = [];

        for (let j = 0; j <= degree; j++) {

            row.push(Math.pow(points[i].x, j));

        }

        X.push(row);
        Y.push(points[i].y);

    }

    const XT = mathTranspose(X);

    const XTX = mathMultiply(XT, X);

    const XTY = mathMultiplyVector(XT, Y);

    const coefficients = gaussianElimination(XTX, XTY);

    return {
        X,
        coefficients
    };
}

function mathTranspose(matrix) {

    return matrix[0].map((_, colIndex) =>
        matrix.map(row => row[colIndex])
    );

}

function mathMultiply(a, b) {

    let result = Array.from(
        { length: a.length },
        () => Array(b[0].length).fill(0)
    );

    for (let i = 0; i < a.length; i++) {

        for (let j = 0; j < b[0].length; j++) {

            for (let k = 0; k < b.length; k++) {

                result[i][j] += a[i][k] * b[k][j];

            }

        }

    }

    return result;
}

function mathMultiplyVector(a, b) {

    let result = Array(a.length).fill(0);

    for (let i = 0; i < a.length; i++) {

        for (let j = 0; j < b.length; j++) {

            result[i] += a[i][j] * b[j];

        }

    }

    return result;
}

function gaussianElimination(A, b) {

    const n = A.length;

    for (let i = 0; i < n; i++) {

        let maxRow = i;

        for (let k = i + 1; k < n; k++) {

            if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {

                maxRow = k;

            }

        }

        [A[i], A[maxRow]] = [A[maxRow], A[i]];
        [b[i], b[maxRow]] = [b[maxRow], b[i]];

        for (let k = i + 1; k < n; k++) {

            let factor = A[k][i] / A[i][i];

            for (let j = i; j < n; j++) {

                A[k][j] -= factor * A[i][j];

            }

            b[k] -= factor * b[i];

        }

    }

    let x = Array(n).fill(0);

    for (let i = n - 1; i >= 0; i--) {

        x[i] = b[i];

        for (let j = i + 1; j < n; j++) {

            x[i] -= A[i][j] * x[j];

        }

        x[i] /= A[i][i];

    }

    return x;
}

function leastSquaresValue(coefficients, x) {

    let y = 0;

    for (let i = 0; i < coefficients.length; i++) {

        y += coefficients[i] * Math.pow(x, i);

    }

    return y;
}

function renderLeastSquares(coefficients) {

    let formula = "P(x) = ";

    coefficients.forEach((coef, index) => {

        if (index === 0) {

            formula += coef.toFixed(4);

        } else {

            formula += ` + (${coef.toFixed(4)})x^${index}`;

        }

    });

    document.getElementById(
        "least-result"
    ).innerHTML = `

        <div class="polynomial-box fade">
            ${formula}
        </div>

    `;
}

function renderMatrix(matrix) {

    let html = "<table class='fade'>";

    matrix.forEach(row => {

        html += "<tr>";

        row.forEach(value => {

            html += `<td>${value.toFixed(2)}</td>`;

        });

        html += "</tr>";

    });

    html += "</table>";

    document.getElementById(
        "matrix-container"
    ).innerHTML = html;
}

function renderResiduals(points, coefficients) {

    let html = `

        <table class="fade">

            <thead>
                <tr>
                    <th>x</th>
                    <th>y</th>
                    <th>ŷ</th>
                    <th>Похибка</th>
                </tr>
            </thead>

            <tbody>

    `;

    points.forEach(point => {

        const predicted =
            leastSquaresValue(coefficients, point.x);

        const residual =
            point.y - predicted;

        html += `

            <tr>
                <td>${point.x}</td>
                <td>${point.y}</td>
                <td>${predicted.toFixed(4)}</td>
                <td>${residual.toFixed(4)}</td>
            </tr>

        `;

    });

    html += "</tbody></table>";

    document.getElementById(
        "residuals-container"
    ).innerHTML = html;
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

function clearMatrix() {

    document.getElementById(
        "matrix-container"
    ).innerHTML = `

        <p class="placeholder">
            Побудуйте МНК
        </p>

    `;
}

function clearResiduals() {

    document.getElementById(
        "residuals-container"
    ).innerHTML = `

        <p class="placeholder">
            Побудуйте МНК
        </p>

    `;
}

const tabButtons = document.querySelectorAll(".tab-btn");

const sections = document.querySelectorAll(".tab-content");

tabButtons.forEach(button => {

    button.addEventListener("click", () => {

        tabButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        const tabId = button.dataset.tab;

        sections.forEach(section => {

            section.classList.remove("active");

            if (section.id === tabId) {

                section.classList.add("active");

            }

        });

    });

});

function buildLagrange() {

    const points = parseCustomPoints(
        "lagrange-points"
    );

    renderCustomTable(
        points,
        "lagrange-table"
    );

    const polynomial =
        buildLagrangePolynomial(points);

    document.getElementById(
        "lagrange-result"
    ).innerHTML = `

        <div class="polynomial-box fade">
            ${polynomial}
        </div>

    `;

    buildCustomGraph(
        points,
        "lagrange",
        "lagrange-chart"
    );

}

function buildNewton() {

    const points = parseCustomPoints(
        "newton-points"
    );

    renderCustomTable(
        points,
        "newton-table"
    );

    const table =
        buildDividedDifferences(points);

    let formula = "N(x) = ";

    formula += table[0][0].toFixed(4);

    for (let i = 1; i < points.length; i++) {

        formula += ` + (${table[0][i].toFixed(4)})`;

        for (let j = 0; j < i; j++) {

            formula += `(x - ${points[j].x})`;

        }

    }

    document.getElementById(
        "newton-result"
    ).innerHTML = `

        <div class="polynomial-box fade">
            ${formula}
        </div>

    `;

    renderDifferencesTable(table);

    buildCustomGraph(
        points,
        "newton",
        "newton-chart",
        table
    );

}

function buildLeastSquares() {

    const points = parseCustomPoints(
        "least-points"
    );

    renderCustomTable(
        points,
        "least-table"
    );

    const result =
        leastSquares(points, 2);

    renderLeastSquares(
        result.coefficients
    );

    renderMatrix(result.X);

    renderResiduals(
        points,
        result.coefficients
    );

    buildCustomGraph(
        points,
        "leastSquares",
        "least-chart",
        null,
        result.coefficients
    );

}

function parseCustomPoints(textareaId) {

    const text = document
        .getElementById(textareaId)
        .value
        .trim();

    const lines = text.split("\n");

    let points = [];

    for (let line of lines) {

        const [x, y] =
            line.split(",").map(Number);

        if (!isNaN(x) && !isNaN(y)) {

            points.push({ x, y });

        }

    }

    return points;

}

function renderCustomTable(points, containerId) {

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

    document.getElementById(
        containerId
    ).innerHTML = html;

}

function clearCanvas(canvasId) {

    const canvas = document.getElementById(canvasId);

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

}

function clearLagrange() {

    document.getElementById(
        "lagrange-result"
    ).innerHTML = `

        <p class="placeholder">
            Поліном ще не побудовано
        </p>

    `;

    document.getElementById(
        "lagrange-table"
    ).innerHTML = "";

    clearCanvas("lagrange-chart");

}

function clearNewton() {

    document.getElementById(
        "newton-result"
    ).innerHTML = `

        <p class="placeholder">
            Поліном ще не побудовано
        </p>

    `;

    document.getElementById(
        "newton-table"
    ).innerHTML = "";

    document.getElementById(
        "differences-container"
    ).innerHTML = `

        <p class="placeholder">
            Побудуйте поліном Ньютона
        </p>

    `;

    clearCanvas("newton-chart");

}

function clearLeastSquares() {

    document.getElementById(
        "least-result"
    ).innerHTML = `

        <p class="placeholder">
            Поліном ще не побудовано
        </p>

    `;

    document.getElementById(
        "least-table"
    ).innerHTML = "";

    clearMatrix();

    clearResiduals();

    clearCanvas("least-chart");

}
