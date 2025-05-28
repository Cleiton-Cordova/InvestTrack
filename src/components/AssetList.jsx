// components/AssetList.jsx
import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { getCurrencySymbol } from '../utils/getCurrencySymbol';

const AssetList = ({ assets, onDelete }) => {
  return (
    assets.length === 0 ? (
      <p className="text-gray-400 text-center">No assets registered.</p>
    ) : (
      <ul className="space-y-4">
        {assets.map((asset) => (
          <li
            key={asset.id} // ✅ chave única baseada no ID gerado em AssetsPage
            className="bg-gray-700 border border-gray-600 p-4 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1 text-sm text-gray-200">
                <p className="text-base font-semibold text-white">
                  {asset.name} <span className="text-gray-400 font-normal">({asset.ticker})</span>
                </p>
                <p>Quantity: <strong>{asset.quantity}</strong></p>
                <p>Average Price: <strong>{getCurrencySymbol(asset.currency)}{asset.price}</strong></p>
                <p>Total: <strong>{getCurrencySymbol(asset.currency)}{(asset.quantity * asset.price).toFixed(2)}</strong></p>
              </div>
              <button
                onClick={() => onDelete(asset.id)}
                className="text-red-400 hover:text-red-600 text-sm inline-flex items-center gap-1 mt-1"
                title="Remove asset"
              >
                <TrashIcon className="h-4 w-4" /> Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    )
  );
};

export default AssetList;
