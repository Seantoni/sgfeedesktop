document.getElementById("inputForm").addEventListener("submit", function (event) {
    event.preventDefault();
    calculateResults(); // Only call calculateResults here, as the password check is handled elsewhere
  });
  
  

let myChart = null;

function checkPassword() {
    const passwordInput = document.getElementById("password").value;
    const correctPassword = "sg2023";
  
    if (passwordInput === correctPassword) {
      document.getElementById("password-group").style.display = "none";
      document.getElementById("inputForm").style.display = "block";
    } else {
      alert("¡Contraseña Incorrecta!");
    }
  }

function createChart(results) {
    const ctx = document.getElementById('myChart').getContext('2d');
    if (myChart !== null) {
        myChart.destroy();
    }
    const labels = results.map(result => result.mes);
    const dataUsuarios = results.map(result => result.usuarios);
    const dataInversion = results.map(result => result.simpleGoFee);
    const dataIngresoBruto = results.map(result => result.ingresoBruto);
    const dataNuevoIngresoBruto = results.map(result => result.nuevoIngresoBruto);

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
                label: 'Ingreso',
                data: dataIngresoBruto,
                backgroundColor: 'rgba(48, 209, 88, 0.2)',
                borderColor: 'rgba(48, 209, 88, 1)',
                borderWidth: 1,
                type: 'line',
                fill: 'origin'
            },
            {
                label: 'Ingreso SimpleGo',
                data: dataNuevoIngresoBruto,
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
                type: 'line',
                fill: 'origin'
            }]
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
          crecimiento = crecimiento * (1 - 0.08);
        }
  
        let usuarios = Math.floor(usuarioMes1 * Math.pow(1 + crecimiento, i - 1));
        let ingresoBruto = Math.floor(usuarios * ticketPromedio);
        let nuevoIngresoBruto = Math.floor((usuarios * 1.1) * ticketPromedio * 1.1);
        let simpleGoFee = Math.floor(nuevoIngresoBruto * feeSimpleGo);
  
        results.push({
          mes: i,
          usuarios: usuarios,
          ingresoBruto: ingresoBruto,
          nuevoIngresoBruto: nuevoIngresoBruto,
          simpleGoFee: simpleGoFee,
          crecimiento: (crecimiento * 100)
        });
      }

    displayResults(results);
    displayInvestmentAndGrossIncome(results);
    createChart(results);

    const form = document.getElementById("inputForm");
    form.classList.add("sidebar");
    form.classList.add("active");
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

        let cellMes = document.createElement("td");
        cellMes.textContent = result.mes;
        row.appendChild(cellMes);

        let cellUsuarios = document.createElement("td");
        cellUsuarios.textContent = result.usuarios.toLocaleString();
        row.appendChild(cellUsuarios);

        let cellIngresoBruto = document.createElement("td");
        cellIngresoBruto.textContent = `$${result.ingresoBruto.toLocaleString()}`;
        row.appendChild(cellIngresoBruto);

        let cellNuevoIngresoBruto = document.createElement("td");
        cellNuevoIngresoBruto.textContent = `$${result.nuevoIngresoBruto.toLocaleString()}`;
        row.appendChild(cellNuevoIngresoBruto);

        let cellSimpleGoFee = document.createElement("td");
        cellSimpleGoFee.textContent = `$${result.simpleGoFee.toLocaleString()}`;
        row.appendChild(cellSimpleGoFee);

        let cellCrecimientoPercent = document.createElement("td");
        cellCrecimientoPercent.textContent = `${result.crecimiento.toFixed(2)}%`;
        row.appendChild(cellCrecimientoPercent);

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
