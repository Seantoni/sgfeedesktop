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
      const crecimientousuarios = parseFloat(document.getElementById("crecimiento usuarios").value) / 100;
      const crecimientoticket = parseFloat(document.getElementById("crecimiento ticket").value) / 100;
  
      let results = [];
  
      for (let i = 1; i <= 12; i++) {
        if (i > 6) {
          crecimiento = crecimiento * (1 - 0.08);
        }
  
        let usuarios = Math.floor(usuarioMes1 * Math.pow(1 + crecimiento, i - 1));
        let ingresoBruto = Math.floor(usuarios * ticketPromedio);
        let nuevoIngresoBruto = Math.floor((usuarios * (1 +crecimientousuarios) * ticketPromedio * (1 +crecimientoticket)));
        let simpleGoFee = Math.floor(nuevoIngresoBruto * feeSimpleGo);

        let sixMonthsData = results.slice(0, 6);
        let twelveMonthsData = results;
      
        let ingresoSixMonths = sixMonthsData.reduce((acc, val) => acc + val.ingresoBruto, 0);
        let ingresoSimpleGoSixMonths = sixMonthsData.reduce((acc, val) => acc + val.nuevoIngresoBruto, 0);
        let gananciaSixMonths = ingresoSimpleGoSixMonths - ingresoSixMonths;
      
        let ingresoTwelveMonths = twelveMonthsData.reduce((acc, val) => acc + val.ingresoBruto, 0);
        let ingresoSimpleGoTwelveMonths = twelveMonthsData.reduce((acc, val) => acc + val.nuevoIngresoBruto, 0);
        let gananciaTwelveMonths = ingresoSimpleGoTwelveMonths - ingresoTwelveMonths;
        
  
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

    let users6months = results.slice(0, 6).reduce((acc, result) => acc + result.usuarios, 0);
    let users12months = results.reduce((acc, result) => acc + result.usuarios, 0);

    let ingresosg6months = results.slice(0, 6).reduce((acc, result) => acc + result.nuevoIngresoBruto, 0);
    let ingresosg12months = results.reduce((acc, result) => acc + result.nuevoIngresoBruto, 0);

    let ganancia6monthts = ingresosg6months - grossIncome6Months;
    let ganancia12monthts = ingresosg12months - grossIncome12Months
    
    let inversion6months = investment6Months - ganancia6monthts;
    
    let inversion12months = investment12Months - ganancia12monthts;


    const investmentBody = document.getElementById("investmentBody");
    


    while (investmentBody.firstChild) {
        investmentBody.removeChild(investmentBody.firstChild);
    }

    const periodData = [
        {
            period: "6 Meses",
            users: users6months,
            ingresosg: ingresosg6months,
            nuevoingreso: ganancia6monthts,
            investmentsg: investment6Months,
            // HIDDEN //grossIncome: grossIncome6Months,
            investment: inversion6months,
            
        },
        {
            period: "12 Meses",
            users: users12months,
            ingresosg: ingresosg12months,
            nuevoingreso: ganancia12monthts,
            investmentsg: investment12Months,
            // HIDDEN //grossIncome: grossIncome12Months,
            investment: inversion12months,
        }
        
    ];

    periodData.forEach(data => {
        let row = document.createElement("tr");
        Object.keys(data).forEach(key => {
            let cell = document.createElement("td");
            let value = data[key];
            if (key === "investment" && value < 0) {
                // Style the cell if the key matches "investment" and value is negative
                cell.style.backgroundColor = "green";
                cell.style.color = "white";
            }
            if (key !== "users" && typeof value === "number") {
                cell.textContent = `$${value.toLocaleString()}`;
            } else {
                cell.textContent = value.toLocaleString();
            }
            row.appendChild(cell);
        });
        investmentBody.appendChild(row);
    });

    document.getElementById("investmentResults").hidden = false;

    
}
$(document).ready(function() {
    if ($(window).width() <= 768) {
      $('.sidebar').remove();
    }
  });




