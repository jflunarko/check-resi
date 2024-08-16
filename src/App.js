import React, { useState } from 'react';
import './App.css';

const TrackingForm = () => {
    const [awb, setAwb] = useState('');
    const [courier, setCourier] = useState('jne');
    const [result, setResult] = useState(null);

    const trackShipment = async () => {
        const url = `https://api.binderbyte.com/v1/track?api_key=${process.env.REACT_APP_APIKEY}&courier=${courier}&awb=${awb}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Error:', error);
            setResult({ error: 'Terjadi kesalahan, silakan coba lagi.' });
        }
    };

    const formatResult = () => {
        if (!result) return null;
        
        if (result.error) return <p>{result.error}</p>;
        
        if (!result.data) return <p>Resi tidak ditemukan.</p>;

        const { summary, detail, history } = result.data;

        return (
            <div id="result">
                <h2>Summary</h2>
                <p><strong>Resi:</strong> {summary.awb}</p>
                <p><strong>Kurir:</strong> {summary.courier}</p>
                <p><strong>Status:</strong> {summary.status}</p>
                <p><strong>Date:</strong> {summary.date}</p>
                <p><strong>Description:</strong> {summary.desc}</p>
                <p><strong>Weight:</strong> {summary.weight}</p>

                <h2>Detail</h2>
                <p><strong>Origin:</strong> {detail.origin}</p>
                <p><strong>Destination:</strong> {detail.destination}</p>
                <p><strong>Shipper:</strong> {detail.shipper}</p>
                <p><strong>Receiver:</strong> {detail.receiver}</p>

                <h2>History</h2>
                <ul>
                    {history.map((item, index) => (
                        <li key={index}>
                            <p><strong>Date:</strong> {item.date}</p>
                            <p><strong>Description:</strong> {item.desc}</p>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="container">
            <h1>Lacak Pengiriman</h1>
            <div>
                <input
                    type="text"
                    value={awb}
                    onChange={(e) => setAwb(e.target.value)}
                    placeholder="Masukkan nomor resi"
                />
                <select
                    value={courier}
                    onChange={(e) => setCourier(e.target.value)}
                >
                    <option value="jne">JNE</option>
                    <option value="jnt">JNT</option>
                    <option value="sicepat">SiCepat</option>
                    <option value="anteraja">AnterAja</option>
                    <option value="spx">Shopee Express</option>
                    <option value="lion">Lion Parcel</option>
                    <option value="ide">ID Express</option>
                </select>
                <button onClick={trackShipment}>Kirim</button>
            </div>
            {result && (
                <div className="tracking-result">
                    {formatResult()}
                </div>
            )}
        </div>
    );
};

export default TrackingForm;
