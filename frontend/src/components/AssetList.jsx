import React, { useState } from 'react';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { getCurrencySymbol } from '../utils/getCurrencySymbol';

const AssetList = ({ assets, onDelete, onUpdate }) => {
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ quantity: '', price: '' });

  const startEditing = (asset) => {
    setEditingId(asset.id);
    setEditValues({ quantity: asset.quantity, price: asset.price });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValues({ quantity: '', price: '' });
  };

  const saveChanges = (id) => {
    const quantity = parseFloat(editValues.quantity);
    const price = parseFloat(editValues.price);
    if (isNaN(quantity) || isNaN(price) || quantity <= 0 || price <= 0) {
      alert('Quantity and price must be positive numbers.');
      return;
    }

    onUpdate(id, { quantity, price });
    cancelEditing();
  };

  return assets.length === 0 ? (
    <p className="text-gray-400 text-center">No assets registered.</p>
  ) : (
    <ul className="space-y-4">
      {assets.map((asset, index) => (
        <li
          key={`${asset.ticker}-${index}`}
          className="bg-gray-700 border border-gray-600 p-4 rounded-lg shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1 text-sm text-gray-200">
              <p className="text-base font-semibold text-white">
                {asset.name}{' '}
                <span className="text-gray-400 font-normal">
                  ({asset.ticker})
                </span>
              </p>

              {editingId === asset.id ? (
                <>
                  <div>
                    <label className="block text-xs">Quantity:</label>
                    <input
                      type="number"
                      className="w-24 p-1 rounded text-black"
                      value={editValues.quantity}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          quantity: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs">Price:</label>
                    <input
                      type="number"
                      className="w-24 p-1 rounded text-black"
                      value={editValues.price}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          price: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              ) : (
                <>
                  <p>
                    Quantity: <strong>{asset.quantity}</strong>
                  </p>
                  <p>
                    Average Price:{' '}
                    <strong>
                      {getCurrencySymbol(asset.currency)}
                      {asset.price}
                    </strong>
                  </p>
                  <p>
                    Total:{' '}
                    <strong>
                      {getCurrencySymbol(asset.currency)}
                      {(asset.quantity * asset.price).toFixed(2)}
                    </strong>
                  </p>

                  {asset.percentChange !== undefined && (
                    <p className="mt-1">
                      Variation:{' '}
                      <strong
                        className={
                          asset.direction === 'positive'
                            ? 'text-green-400'
                            : asset.direction === 'negative'
                            ? 'text-red-400'
                            : 'text-gray-300'
                        }
                      >
                        {asset.direction === 'positive' && '+'}
                        {asset.direction === 'negative' && '-'}
                        {Math.abs(parseFloat(asset.percentChange)).toFixed(2)}%
                        {asset.direction === 'positive' && ' ↑'}
                        {asset.direction === 'negative' && ' ↓'}
                      </strong>
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="flex flex-col items-end gap-1 ml-4">
              {editingId === asset.id ? (
                <>
                  <button
                    className="text-green-400 hover:text-green-600 text-xs"
                    onClick={() => saveChanges(asset.id)}
                  >
                    Save
                  </button>
                  <button
                    className="text-gray-400 hover:text-gray-200 text-xs"
                    onClick={cancelEditing}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="text-yellow-400 hover:text-yellow-600 text-sm inline-flex items-center gap-1"
                    onClick={() => startEditing(asset)}
                  >
                    <PencilIcon className="h-4 w-4" /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(asset.id)}
                    className="text-red-400 hover:text-red-600 text-sm inline-flex items-center gap-1"
                    title="Remove asset"
                  >
                    <TrashIcon className="h-4 w-4" /> Remove
                  </button>
                </>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default AssetList;
