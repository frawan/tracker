// Copies the pinned Chart.js files from node_modules into vendor/.
import { copyFileSync } from "node:fs";
const files = [
  ["node_modules/chart.js/dist/chart.umd.min.js", "vendor/chart.umd.min.js"],
  ["node_modules/chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels.min.js", "vendor/chartjs-plugin-datalabels.min.js"]
];
for (const [from, to] of files) {
  copyFileSync(from, to);
  console.log(`copied ${to}`);
}
