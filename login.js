function loginRFID() {
  const rfid = document.getElementById('rfidInput').value.trim();
  if (!rfid) return Swal.fire('RFID kosong', 'Silakan masukkan kartu RFID Anda', 'warning');

  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rfid })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      Swal.fire('Login Berhasil', '', 'success').then(() => {
        localStorage.setItem('admin', 'true');
        window.location.href = '/dashboard';
      });
    } else {
      Swal.fire('Gagal', 'RFID tidak dikenal', 'error');
    }
  });
}
