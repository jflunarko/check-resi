function trackShipment() {
    const awb = document.getElementById('awbTextbox').value;
    const courier = document.getElementById('courierSelect').value;

    const url = `/track?awb=${encodeURIComponent(awb)}&courier=${encodeURIComponent(courier)}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text(); 
    })
    .then(text => {
        try {
            const data = JSON.parse(text); 
            displayResult(data);
        } catch (error) {
            throw new Error('Failed to parse JSON');
        }
    })
}

function displayResult(data) {
    if (data.status === 200) {
        const summary = data.data.summary;
        const detail = data.data.detail;
        const history = data.data.history;

        let result = `
            <h2>Detail Pengiriman</h2>
            <p><strong>Resi:</strong> ${summary.awb}</p>
            <p><strong>Kurir:</strong> ${summary.courier}</p>
            <p><strong>Layanan:</strong> ${summary.service}</p>
            <p><strong>Status:</strong> ${summary.status}</p>
            <p><strong>Tanggal:</strong> ${summary.date}</p>
            <p><strong>Biaya:</strong> ${summary.amount}</p>
            <p><strong>Berat:</strong> ${summary.weight}</p>
            <h3>Detail Pengirim</h3>
            <p><strong>Asal:</strong> ${detail.origin}</p>
            <p><strong>Tujuan:</strong> ${detail.destination}</p>
            <p><strong>Pengirim:</strong> ${detail.shipper}</p>
            <p><strong>Penerima:</strong> ${detail.receiver}</p>
            <h3>Riwayat Pengiriman</h3>
        `;

        history.forEach(event => {
            result += `
                <p><strong>Tanggal:</strong> ${event.date}</p>
                <p><strong>Deskripsi:</strong> ${event.desc}</p>
                <p><strong>Lokasi:</strong> ${event.location}</p>
                <hr>
            `;
        });

        document.getElementById('result').innerHTML = result;
    } else {
        document.getElementById('result').innerHTML = '<p>Nomor resi tidak ditemukan atau tidak valid.</p>';
    }
}
