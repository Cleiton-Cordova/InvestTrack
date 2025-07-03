import React, { useRef } from 'react';
import Papa from 'papaparse';

const CSVImporter = ({ onImport, className = '' }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const data = results.data
          .map((row) => {
            const cleanedPrice = parseFloat(
              String(row.price).replace(/[^\d.-]/g, '')
            );
            const cleanedQuantity = parseFloat(
              String(row.quantity).replace(/[^\d.-]/g, '')
            );

            return {
              name: row.name?.trim(),
              ticker: row.ticker?.toUpperCase().trim(),
              quantity: isNaN(cleanedQuantity) ? 0 : cleanedQuantity,
              price: isNaN(cleanedPrice) ? 0 : cleanedPrice,
              currency: row.currency?.toUpperCase().trim() || 'USD',
            };
          })
          .filter(
            (asset) =>
              asset.name &&
              asset.ticker &&
              asset.quantity > 0 &&
              asset.price > 0 &&
              ['USD', 'BRL', 'EUR'].includes(asset.currency)
          );

        onImport(data);
      },
    });
  };

  return (
    <div>
      <button
        onClick={() => fileInputRef.current.click()}
        className={`bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-lg shadow transition duration-200 ${className}`}
      >
        Import CSV
      </button>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default CSVImporter;
