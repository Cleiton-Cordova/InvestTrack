// pages/AnalyticsPage.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import PortfolioChart from '../components/PortfolioChart';
import AssetBarChart from '../components/AssetBarChart';
import CSVImporter from '../components/CSVImporter';
import { exportToCSV } from '../utils/exportToCSV';
import { useNavigate } from 'react-router-dom';

const AnalyticsPage = () => {
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

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
    fetchAssets();
  }, [navigate, token]);

  const handleImport = async (importedAssets) => {
    // Redireciona para AssetsPage com os dados importados
    navigate('/assets', { state: { importedAssets } });
  };

  return (
    <div className="flex h-screen">
      <Sidebar onLogout={handleLogout} />

      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <button
            onClick={() => exportToCSV(assets)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-lg shadow transition duration-200"
          >
            Export as CSV
          </button>

          <CSVImporter
            onImport={handleImport}
            className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-6 py-2 rounded-lg shadow transition duration-200"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PortfolioChart assets={assets} />
          <AssetBarChart assets={assets} />
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;
