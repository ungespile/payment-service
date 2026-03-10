document.addEventListener("DOMContentLoaded", () => {
  const turnoverCtx = document.getElementById("turnoverChart");
  const balanceCtx = document.getElementById("balanceChart");

  if (turnoverCtx && window.Chart) {
    new Chart(turnoverCtx, {
      type: "bar",
      data: {
        labels: ["10.02.2026", "11.02.2026", "12.02.2026", "14.02.2026", "15.02.2026", "16.02.2026"],
        datasets: [
          {
            label: "PayIn",
            data: [1200000, 1200000, 1200000, 1200000, 1200000, 1200000],
            backgroundColor: "#4f46e5",
            borderRadius: 6,
            maxBarThickness: 40
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 11 } }
          },
          y: {
            grid: { color: "#e5e7eb" },
            ticks: {
              font: { size: 10 },
              callback: value => value.toLocaleString("ru-RU")
            }
          }
        }
      }
    });
  }

  if (balanceCtx && window.Chart) {
    new Chart(balanceCtx, {
      type: "pie",
      data: {
        labels: ["Мерчанты", "Трейдеры", "Провайдеры", "Агенты"],
        datasets: [
          {
            data: [422940.59, 540839.14, 1594719.95, 0],
            backgroundColor: ["#4f46e5", "#22c55e", "#f59e0b", "#0ea5e9"]
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
});

