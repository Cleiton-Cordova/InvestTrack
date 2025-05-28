// AssetsPage.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AssetForm from '../components/AssetForm';
import AssetList from '../components/AssetList';
import Sidebar from '../components/Sidebar';
import PortfolioChart from '../components/PortfolioChart';
import AssetBarChart from '../components/AssetBarChart';

const AssetsPage = () => {
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const formatName = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Abort if token is missing
    if (!token) {
      console.warn('No token found. Redirecting to login.');
      navigate('/login');
      return;
    }

    setError('');
    const controller = new AbortController();

    fetch('http://localhost:5000/api/assets', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) throw new Error('Unauthorized');
          throw new Error('Failed to fetch');
        }
        return res.json();
      })
      .then((data) => setAssets(data))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('Error loading assets:', err);
        if (err.message === 'Unauthorized') {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('We couldn’t load your assets. Please try again later.');
        }
      });

    return () => {
      controller.abort();
    };
  }, [navigate]);

  const handleAddOrUpdate = async (newAsset, resetForm) => {
    try {
      const formattedAsset = {
        ...newAsset,
        name: formatName(newAsset.name),
        ticker: newAsset.ticker.toUpperCase(),
      };

      setAssets((prevAssets) => {
        const existingAsset = prevAssets.find(
          (asset) =>
            asset.name === formattedAsset.name &&
            asset.currency === formattedAsset.currency
        );

        if (existingAsset) {
          const totalValue =
            existingAsset.quantity * existingAsset.price +
            formattedAsset.quantity * formattedAsset.price;
          const totalQuantity =
            existingAsset.quantity + formattedAsset.quantity;

          const updatedAsset = {
            ...existingAsset,
            quantity: totalQuantity,
            price: +(totalValue / totalQuantity).toFixed(2),
          };

          return prevAssets.map((asset) =>
            asset.name === formattedAsset.name &&
            asset.currency === formattedAsset.currency
              ? updatedAsset
              : asset
          );
        } else {
          return [
            ...prevAssets,
            {
              ...formattedAsset,
              id: `${formattedAsset.ticker}-${formattedAsset.currency}-${Date.now()}`,
            },
          ];
        }
      });

      if (resetForm) resetForm();
    } catch (err) {
      console.error('Failed to add asset:', err);
    }
  };

  const handleRemove = (id) => {
    setAssets((prevAssets) => prevAssets.filter((asset) => asset.id !== id));
  };

  return (
    <div className="flex h-screen">
      <Sidebar onLogout={handleLogout} />
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">My Assets</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <AssetForm onSubmit={handleAddOrUpdate} />
        <AssetList assets={assets} onDelete={handleRemove} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <PortfolioChart assets={assets} />
          <AssetBarChart assets={assets} />
        </div>
      </main>
    </div>
  );
};

export default AssetsPage;
