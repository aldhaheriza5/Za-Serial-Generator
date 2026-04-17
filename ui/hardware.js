// ANTIGRAVITY HARDWARE IDENTITY MONITOR (ENGINEERING SUITE)

document.addEventListener('DOMContentLoaded', () => {
    const scanOverlay = document.getElementById('scan-overlay');
    const scanBar = document.getElementById('scan-bar');
    const scanStatus = document.getElementById('scan-status');

    const hardwareData = {
        motherboard: {
            manufacturer: 'Micro-Star International Co., Ltd.',
            product: 'MPG Z790 CARBON WIFI',
            serial: 'S67B1239845X'
        },
        cpu: {
            model: '13th Gen Intel(R) Core(TM) i9-13900K',
            id: 'BFEBFBFF000A0671',
            cores: '24 Cores / 32 Threads'
        },
        gpu: {
            name: 'NVIDIA GeForce RTX 4090',
            uuid: 'GPU-8e5c4a12-7f21-4d9b-9c3e-556677889900'
        },
        storage: [
            { model: 'Samsung SSD 980 PRO 2TB', serial: 'S6BRNX0T123456F' },
            { model: 'WD_BLACK SN850X 2TB', serial: '223456789012' }
        ],
        network: {
            mac: '00:D8:61:A4:B3:7F',
            ip: '192.168.1.142'
        }
    };

    const statusSteps = [
        "Initializing Neural Bypass...",
        "Accessing BIOS Interface...",
        "Querying WMI Repository...",
        "Extracting NVMe PPA Keys...",
        "Bypassing TPM Guard...",
        "Verifying Hardware Signatures...",
        "Finalizing Identity Matrix..."
    ];

    let progress = 0;
    let stepIndex = 0;

    function runScan() {
        const interval = setInterval(() => {
            progress += Math.random() * 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(revealData, 500);
            }

            scanBar.style.width = `${progress}%`;
            
            // Update status text periodically
            if (progress > (stepIndex + 1) * (100 / statusSteps.length)) {
                stepIndex++;
                if (statusSteps[stepIndex]) {
                    scanStatus.textContent = statusSteps[stepIndex];
                }
            }
        }, 50);
    }

    function revealData() {
        // Populating the UI
        document.getElementById('mb-man').textContent = hardwareData.motherboard.manufacturer;
        document.getElementById('mb-prod').textContent = hardwareData.motherboard.product;
        document.getElementById('mb-ser').textContent = hardwareData.motherboard.serial;

        document.getElementById('cpu-name').textContent = hardwareData.cpu.model;
        document.getElementById('cpu-id').textContent = hardwareData.cpu.id;
        document.getElementById('cpu-cores').textContent = hardwareData.cpu.cores;

        document.getElementById('gpu-name').textContent = hardwareData.gpu.name;
        document.getElementById('gpu-uuid').textContent = hardwareData.gpu.uuid;

        const storageList = document.getElementById('storage-list');
        storageList.innerHTML = '';
        hardwareData.storage.forEach(drive => {
            const row = document.createElement('div');
            row.className = 'data-row';
            row.innerHTML = `<span class="data-label">${drive.model}</span><span class="data-value">${drive.serial}</span>`;
            storageList.appendChild(row);
        });

        document.getElementById('net-mac').textContent = hardwareData.network.mac;
        document.getElementById('net-ip').textContent = hardwareData.network.ip;

        // Hide overlay
        scanOverlay.style.opacity = '0';
        setTimeout(() => {
            scanOverlay.style.display = 'none';
        }, 800);
    }

    // Start the simulation after a short delay
    setTimeout(runScan, 500);
});
