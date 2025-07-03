export const exportToCSV = (assets) => {
  if (!assets.length) return;

  const header = ['Name', 'Ticker', 'Quantity', 'Average Price', 'Currency', 'Total', 'Variation (%)'];
  const rows = assets.map(asset => [
    asset.name,
    asset.ticker,
    asset.quantity,
    asset.price,
    asset.currency,
    (asset.quantity * asset.price).toFixed(2),
    asset.percentChange || 'N/A'
  ]);

  const csvContent =
    [header, ...rows]
      .map(row => row.map(String).join(','))
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'assets.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
