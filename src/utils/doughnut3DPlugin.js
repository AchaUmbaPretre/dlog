//DOUGHNUT 3D PLUGIN
export const doughnut3DPlugin = {
  id: "doughnut3DPlugin",
  beforeDraw(chart) {
    const { ctx, chartArea, data } = chart;
    const meta = chart.getDatasetMeta(0);

    if (!meta || !meta.data) return;

    const slices = meta.data;
    const x = (chartArea.left + chartArea.right) / 2;
    const y = (chartArea.top + chartArea.bottom) / 2 + 12;
    const extraDepth = 18;

    slices.forEach((slice, i) => {
      const angle = slice.startAngle;
      const angle2 = slice.endAngle;

      ctx.save();
      ctx.beginPath();

      // Sécurisation ici ↓↓↓
      const color = data.datasets[0].backgroundColor[i] || "rgba(0,0,0,0.5)";
      const depthColor = color.replace(/0\.\d+/, "0.50");

      ctx.fillStyle = depthColor;

      for (let depth = 0; depth < extraDepth; depth++) {
        ctx.moveTo(x, y + depth);
        ctx.arc(x, y + depth, slice.outerRadius, angle, angle2);
      }

      ctx.fill();
      ctx.restore();
    });
  },
};
