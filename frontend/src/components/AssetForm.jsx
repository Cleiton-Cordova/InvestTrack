// components/AssetForm.jsx
import React, { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';

const AssetForm = ({ onSubmit, error }) => {
  const [formData, setFormData] = useState({
    name: '',
    ticker: '',
    quantity: '',
    price: '',
    currency: 'USD',
  });

  const [suggestions, setSuggestions] = useState([]);

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

  const formatName = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, ticker, quantity, price, currency } = formData;

    if (
      !name.trim() ||
      !ticker.trim() ||
      !quantity ||
      !price ||
      Number(quantity) <= 0 ||
      Number(price) <= 0
    ) {
      alert('Please fill in all fields with valid values.');
      return;
    }

    const preparedData = {
      name: formatName(name),
      ticker: ticker.toUpperCase(),
      quantity: Number(quantity),
      price: Number(price),
      currency,
    };

    console.log('📤 Sending asset to parent:', preparedData);

    onSubmit(preparedData, () => {
      setFormData({
        name: '',
        ticker: '',
        quantity: '',
        price: '',
        currency: 'USD',
      });
      setSuggestions([]);
    });
  };

  const fetchSuggestions = debounce(async (query, currency) => {
    if (!query) return setSuggestions([]);
    try {
      const res = await fetch(
        `http://localhost:5000/api/search-ticker?name=${query}&currency=${currency}`
      );
      const data = await res.json();
      setSuggestions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setSuggestions([]);
    }
  }, 400);

  useEffect(() => {
    fetchSuggestions(formData.name, formData.currency);
  }, [formData.name, formData.currency]);

  const handleSelectSuggestion = (item) => {
    setFormData((prev) => ({
      ...prev,
      name: item.name,
      ticker: item.ticker,
    }));
    setSuggestions([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <select
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          className="border border-gray-600 bg-gray-700 text-white focus:border-yellow-400 focus:ring focus:ring-yellow-500 p-2 rounded w-full text-sm"
        >
          <option value="USD">USD - Dollar</option>
          <option value="EUR">EUR - Euro</option>
          <option value="BRL">BRL - Real</option>
        </select>

        <div className="relative">
          <input
            name="name"
            placeholder="Asset Name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-600 bg-gray-700 text-white focus:border-yellow-400 focus:ring focus:ring-yellow-500 p-2 rounded w-full text-sm placeholder-gray-400"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white text-black border border-gray-300 mt-1 rounded shadow w-full max-h-40 overflow-y-auto">
              {suggestions.map((item, index) => (
                <li
                  key={`${item.name}-${item.ticker}-${index}`}
                  onClick={() => handleSelectSuggestion(item)}
                  className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {item.name} ({item.ticker})
                </li>
              ))}
            </ul>
          )}
        </div>

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
