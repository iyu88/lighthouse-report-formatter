const core = require('@actions/core');
const fs = require('fs');

const formatLighthouseReportTable = (root_directory, manifest_path) => {
  const results = JSON.parse(fs.readFileSync(`${root_directory}${manifest_path}/manifest.json`));
  let comments = "";

  results.forEach((result, index) => {
    const { summary, jsonPath } = result;
    const details = JSON.parse(fs.readFileSync(jsonPath));
    const { audits } = details;

    const formatScore = (res) => Math.round(res * 100);

    Object.keys(summary).forEach(
      (key) => (summary[key] = formatScore(summary[key]))
    );

    const scoreEmoji = (res) => (res >= 90 ? "🟢" : res >= 50 ? "🟠" : "🔴");
    const reportRow = (label, score) => `| ${scoreEmoji(score)} ${label} | ${score} |`;
    const detailRow = (label, score, displayValue) => `${reportRow(label, score)} ${displayValue} |`;

    const report = [`⚡️ Lighthouse Report! - ${index+1}`,
    `| Category | Score |`,
    `| -------- | ----- |`,
    `${reportRow('Performance', summary.performance)}`,
    `${reportRow('Accessibility', summary.accessibility)}`,
    `${reportRow('Best practices', summary['best-practices'])}`,
    `${reportRow('SEO', summary.seo)}`,
    `${reportRow('PWA', summary.pwa)}`].join('\n');

    const detail = [`🔎 Performance Details - ${index+1}`,
    `| Category | Score | DisplayValue |`,
    `| -------- | ----- | ------------ |`,
    `${detailRow("First Contentful Paint", audits['first-contentful-paint'].score * 100, audits['first-contentful-paint'].displayValue)}`,
    `${detailRow("Largest Contentful Paint", audits['largest-contentful-paint'].score * 100, audits['largest-contentful-paint'].displayValue)}`].join('\n');

    comments += report + "\n\n" + detail + "\n\n";
  });
  return comments;
}

async function run () {
  const lh_directory = core.getInput('lh_directory');
  const manifest_path = core.getInput('manifest_path');
  
  try {
    const comments = formatLighthouseReportTable(lh_directory, manifest_path);
    core.setOutput("comments", comments);
  } catch(err) {
    core.setFailed(err.message);
  }
}

run();
