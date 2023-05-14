document.getElementById("inputForm").addEventListener("submit", function (event) {
    event.preventDefault();
    calculateResults();
});



let myChart = null; // declare the chart variable outside the function

function createChart(results) {
    const ctx = document.getElementById('myChart').getContext('2d');

    // destroy the previous chart if it exists
    if (myChart !== null) {
        myChart.destroy();
    }

    const labels = results.map(result => result.mes);
    const dataUsuarios = results.map(result => result.usuarios);
    const dataInversion = results.map(result => result.simpleGoFee);
    const dataIngresoBruto = results.map(result => result.ingresoBruto);

    // Create new chart
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
            {
                label: 'Inversión',
                data: dataInversion,
                backgroundColor: 'rgba(10, 132, 255, 0.2)',
                borderColor: 'rgba(10, 132, 255, 1)',
                borderWidth: 1,
                type: 'line',
                fill: 'origin'
            },
            {
                label: 'Ingreso Bruto',
                data: dataIngresoBruto,
                backgroundColor: 'rgba(48, 209, 88, 0.2)',
                borderColor: 'rgba(48, 209, 88, 1)',
                borderWidth: 1,
                type: 'line',
                fill: 'origin'
            },]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            },
        },
    });

    document.getElementById("myChart").hidden = false;
}


function calculateResults() {
    const usuarioMes1 = parseInt(document.getElementById("usuarioMes1").value);
    let crecimiento = parseFloat(document.getElementById("crecimiento").value) / 100;
    const feeSimpleGo = parseFloat(document.getElementById("feeSimpleGo").value) / 100;
    const ticketPromedio = parseFloat(document.getElementById("ticketPromedio").value);

    let results = [];

    for (let i = 1; i <= 12; i++) {
        if (i > 6) {
            crecimiento = crecimiento * (1 - 0.08) ; 
        }

        let usuarios = Math.floor(usuarioMes1 * Math.pow(1 + crecimiento, i - 1));
        let ingresoBruto = Math.floor(usuarios * ticketPromedio);
        let simpleGoFee = Math.floor(ingresoBruto * feeSimpleGo);

        results.push({
            mes: i,
            usuarios: usuarios,
            ingresoBruto: ingresoBruto,
            simpleGoFee: simpleGoFee,
            crecimiento: crecimiento
        });
    }

    displayResults(results);
    displayInvestmentAndGrossIncome(results);
    enableDownloadCSV(results);
    createChart(results);

    const form = document.getElementById("inputForm");
    form.classList.add("sidebar");
    form.classList.add("active");  // Add the active class to slide the form in from the left
    document.getElementById("inputForm").classList.add("fixed-sidebar");
    document.body.classList.add('sidebar-active');
}

function displayResults(results) {
    const resultsBody = document.getElementById("resultsBody");

    while (resultsBody.firstChild) {
        resultsBody.removeChild(resultsBody.firstChild);
    }

    results.forEach(result => {
        let row = document.createElement("tr");

        Object.values(result).forEach((value, index) => {
            let cell = document.createElement("td");

            if (index === 2 || index === 3) {
                cell.textContent = `$${value.toLocaleString()}`;
            } else if (index === 4) {
                cell.textContent = `${(value * 100).toFixed(2)}%`; // Format the value as a percentage
            } else {
                cell.textContent = value.toLocaleString();
            }

            row.appendChild(cell);
        });

        resultsBody.appendChild(row);
    });

    document.getElementById("resultsTable").hidden = false;
}


function displayInvestmentAndGrossIncome(results) {
    let investment6Months = results.slice(0, 6).reduce((acc, result) => acc + result.simpleGoFee, 0);
    let investment12Months = results.reduce((acc, result) => acc + result.simpleGoFee, 0);

    let grossIncome6Months = results.slice(0, 6).reduce((acc, result) => acc + result.ingresoBruto, 0);
    let grossIncome12Months = results.reduce((acc, result) => acc + result.ingresoBruto, 0);

    const investmentBody = document.getElementById("investmentBody");

    while (investmentBody.firstChild) {
        investmentBody.removeChild(investmentBody.firstChild);
    }

    const periodData = [
        {
            period: "Primeros 6 meses",
            grossIncome: grossIncome6Months,
            investment: investment6Months
        },
        {
            period: "Primeros 12 meses",
            grossIncome: grossIncome12Months,
            investment: investment12Months,
        }
    ];

    periodData.forEach(data => {
        let row = document.createElement("tr");
        Object.values(data).forEach(value => {
            let cell = document.createElement("td");
            cell.textContent = typeof value === "number" ? `$${value.toLocaleString()}` : value;
            row.appendChild(cell);
        });
        investmentBody.appendChild(row);
    });

    document.getElementById("investmentResults").hidden = false;
}
function enableDownloadCSV(results) {
    const downloadCSVButton = document.getElementById("downloadCSV");
    downloadCSVButton.hidden = false;
    downloadCSVButton.onclick = () => downloadCSV(results);
}

function downloadCSV(results) {
    let csvContent = "Mes,Usuarios,Ingreso Bruto,SimpleGo Fee\n";

    results.forEach(result => {
        csvContent += `${result.mes},${result.usuarios.toLocaleString()},$${result.ingresoBruto.toLocaleString()},$${result.simpleGoFee.toLocaleString()}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "SimpleGo_Fee_Calculator.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}