// components/AssetForm.jsx
import React, { useState } from 'react';

const AssetForm = ({ onSubmit, error }) => {
  const [formData, setFormData] = useState({
    name: '',
    ticker: '',
    quantity: '',
    price: '',
    currency: 'USD',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'quantity') {
      setFormData({ ...formData, quantity: value.replace(/\D+/g, '') });
    } else if (name === 'price') {
      setFormData({ ...formData, price: value.replace(/[^0-9.]/g, '') });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const formatName = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const handleSubmit = (e) => {
    e.preventDefault();

    const preparedData = {
      ...formData,
      name: formatName(formData.name),
      ticker: formData.ticker.toUpperCase(),
      quantity: Number(formData.quantity),
      price: Number(formData.price),
    };

    onSubmit(preparedData, () =>
      setFormData({
        name: '',
        ticker: '',
        quantity: '',
        price: '',
        currency: 'USD',
      })
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          name="name"
          placeholder="Asset Name"
          value={formData.name}
          onChange={handleChange}
          className="border border-gray-600 bg-gray-700 text-white focus:border-yellow-400 focus:ring focus:ring-yellow-500 p-2 rounded w-full text-sm placeholder-gray-400"
        />
        <input
          name="ticker"
          placeholder="TICKER"
          value={formData.ticker}
          onChange={handleChange}
          className="border border-gray-600 bg-gray-700 text-white focus:border-yellow-400 focus:ring focus:ring-yellow-500 p-2 rounded w-full uppercase text-sm placeholder-gray-400"
        />
        <input
          name="quantity"
          type="text"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="border border-gray-600 bg-gray-700 text-white focus:border-yellow-400 focus:ring focus:ring-yellow-500 p-2 rounded w-full text-sm placeholder-gray-400"
        />
        <input
          name="price"
          type="text"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="border border-gray-600 bg-gray-700 text-white focus:border-yellow-400 focus:ring focus:ring-yellow-500 p-2 rounded w-full text-sm placeholder-gray-400"
        />
        <select
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          className="border border-gray-600 bg-gray-700 text-white focus:border-yellow-400 focus:ring focus:ring-yellow-500 p-2 rounded w-full md:col-span-2 text-sm"
        >
          <option value="USD">USD - Dollar</option>
          <option value="EUR">EUR - Euro</option>
          <option value="BRL">BRL - Real</option>
        </select>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm px-4 py-2 rounded w-full font-semibold"
      >
        Add Asset
      </button>
    </form>
  );
};

export default AssetForm;
