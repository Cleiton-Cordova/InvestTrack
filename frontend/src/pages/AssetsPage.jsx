// pages/AssetsPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AssetForm from '../components/AssetForm';
import AssetList from '../components/AssetList';
import Sidebar from '../components/Sidebar';
import PortfolioChart from '../components/PortfolioChart';
import AssetBarChart from '../components/AssetBarChart';

const AssetsPage = () => {
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const formatName = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const fetchCurrentPrices = async (assetsToUpdate) => {
    const updatedAssets = await Promise.all(
      assetsToUpdate.map(async (asset) => {
        try {
          const res = await fetch(
            `http://localhost:5000/api/variation/${asset.ticker}?currency=${asset.currency}`
          );
          const data = await res.json();

          if (!res.ok || !data?.lastPrice) throw new Error('No variation data');

          const percentChange = ((data.lastPrice - asset.price) / asset.price) * 100;
          const direction =
            percentChange > 0 ? 'positive' : percentChange < 0 ? 'negative' : 'neutral';

          return {
            ...asset,
            currentPrice: data.lastPrice,
            percentChange: percentChange.toFixed(2),
            direction,
          };
        } catch (err) {
          console.error(`Failed to fetch variation for ${asset.ticker}:`, err.message);
          return asset;
        }
      })
    );
    setAssets(updatedAssets);
  };

  const fetchAssets = () => {
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
          if (res.status === 404) throw new Error('NotFound');
          throw new Error('Failed to fetch');
        }
        return res.json();
      })
      .then(async (data) => {
        await fetchCurrentPrices(data);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('Error loading assets:', err.message);
        if (err.message === 'Unauthorized') {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('We couldn’t load your assets. Please try again later.');
        }
      });

    return () => controller.abort();
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (location.state?.importedAssets?.length) {
      (async () => {
        for (const asset of location.state.importedAssets) {
          console.log('📦 Importing asset from CSV:', asset);
          await handleAddOrUpdate(asset);
        }
        fetchAssets();
        navigate('/assets', { replace: true }); // clear import state from history
      })();
    } else {
      fetchAssets();
    }
  }, [navigate, token]);

  const handleAddOrUpdate = async (newAsset, resetForm) => {
    try {
      const { name, ticker, quantity, price, currency } = newAsset;
      if (!name || !ticker || !quantity || !price || !currency) {
        setError('Please fill in all fields before submitting.');
        return;
      }

      const formattedAsset = {
        ...newAsset,
        name: formatName(name),
        ticker: ticker.toUpperCase(),
      };

      console.log('📤 Sending asset:', formattedAsset);

      const response = await fetch('http://localhost:5000/api/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedAsset),
      });

      if (!response.ok) throw new Error('Failed to save asset');
      const savedAsset = await response.json();

      const updatedList = [...assets.filter((a) => a.id !== savedAsset.id), savedAsset];
      await fetchCurrentPrices(updatedList);

      if (resetForm) resetForm();
    } catch (err) {
      console.error('❌ Failed to add asset:', err.message);
      setError('Failed to save asset. Try again.');
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/assets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error('Failed to update asset');
      const updatedAsset = await response.json();

      await fetchCurrentPrices(
        assets.map((a) => (a.id === updatedAsset.id ? updatedAsset : a))
      );
    } catch (err) {
      console.error('❌ Failed to update asset:', err.message);
      setError('Failed to update asset. Try again.');
    }
  };

  const handleRemove = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/assets/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete asset');

      setAssets((prevAssets) => prevAssets.filter((asset) => asset.id !== id));
    } catch (err) {
      console.error('❌ Failed to delete asset:', err.message);
      setError('Failed to delete asset. Try again.');
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar onLogout={handleLogout} />
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">My Assets</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <AssetForm onSubmit={handleAddOrUpdate} />
        <AssetList assets={assets} onDelete={handleRemove} onUpdate={handleUpdate} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <PortfolioChart assets={assets} />
          <AssetBarChart assets={assets} />
        </div>
      </main>
    </div>
  );
};

export default AssetsPage;

