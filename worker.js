addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

const PASSWORD = "wg123"; // رمز عبور دلخواه خودتون رو اینجا تنظیم کنید

const htmlForm = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تولید کانفیگ WireGuard</title>
  <style>
    :root {
      --primary: #2c3e50;
      --secondary: #3498db;
      --accent: #e74c3c;
      --bg: #ecf0f1;
      --text: #2c3e50;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Vazir', Arial, sans-serif;
      background: linear-gradient(135deg, var(--bg) 0%, #dfe4ea 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      padding: 30px;
      width: 100%;
      max-width: 600px;
      animation: fadeIn 0.5s ease-in;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    h1 {
      color: var(--primary);
      text-align: center;
      margin-bottom: 30px;
      font-size: 2rem;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
    }
    .form-group {
      margin-bottom: 20px;
      position: relative;
    }
    label {
      display: block;
      color: var(--text);
      font-weight: 600;
      margin-bottom: 8px;
    }
    input, select {
      width: 100%;
      padding: 12px;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }
    input:focus, select:focus {
      outline: none;
      border-color: var(--secondary);
      box-shadow: 0 0 5px rgba(52,152,219,0.3);
    }
    button {
      width: 100%;
      padding: 14px;
      background: var(--secondary);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      cursor: pointer;
      transition: transform 0.2s, background 0.3s;
    }
    button:hover {
      background: #2980b9;
      transform: translateY(-2px);
    }
    .optional {
      color: #7f8c8d;
      font-size: 0.9rem;
      margin-right: 5px;
    }
    #passwordModal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      justify-content: center;
      align-items: center;
    }
    .modal-content {
      background: white;
      padding: 30px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      animation: fadeIn 0.3s ease-in;
    }
    .modal-content input {
      margin: 15px 0;
    }
    .error {
      color: var(--accent);
      font-size: 0.9rem;
      margin-top: 10px;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      font-size: 0.9rem;
    }
    .footer a {
      color: var(--secondary);
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
  </style>
  <link href="https://v1.fontapi.ir/css/Vazir" rel="stylesheet">
</head>
<body>
  <div id="passwordModal">
    <div class="modal-content">
      <h2>ورود به ابزار</h2>
      <input type="password" id="passwordInput" placeholder="رمز عبور را وارد کنید">
      <button onclick="checkPassword()">ورود</button>
      <div id="errorMessage" class="error"></div>
    </div>
  </div>
  <div class="container" id="mainForm" style="display: none;">
    <h1>تولید کانفیگ WireGuard</h1>
    <form method="POST">
      <div class="form-group">
        <label>نوع کانفیگ</label>
        <select name="configType" required>
          <option value="standard">استاندارد</option>
          <option value="gaming">گیمینگ</option>
        </select>
      </div>
      <div class="form-group">
        <label>نوع IP</label>
        <select name="ipType" required>
          <option value="ipv4">IPv4</option>
          <option value="ipv6">IPv6</option>
        </select>
      </div>
      <div class="form-group">
        <label>آدرس کلاینت IPv4</label>
        <input name="clientAddressIPv4" value="172.16.0.2/32" required>
      </div>
      <div class="form-group">
        <label><span class="optional">(اختیاری)</span>آدرس کلاینت IPv6</label>
        <input name="clientAddressIPv6" value="2606:4700:110:80bd:2df9:84d3:96b5:e837/128">
      </div>
      <div class="form-group">
        <label>کلید عمومی سرور</label>
        <input name="serverPublicKey" value="bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=" required>
      </div>
      <div class="form-group">
        <label><span class="optional">(اختیاری)</span>DNS</label>
        <input name="dns" value="1.1.1.1, 1.0.0.1">
      </div>
      <div class="form-group">
        <label><span class="optional">(اختیاری)</span>MTU</label>
        <input name="mtu" value="1280">
      </div>
      <div class="form-group">
        <label><span class="optional">(اختیاری)</span>Persistent Keepalive</label>
        <input name="keepalive" value="25" placeholder="مثلاً 25">
      </div>
      <button type="submit">تولید کانفیگ</button>
    </form>
    <div class="footer">
      <p>توسعه داده شده توسط <a href="https://github.com/Argh94" target="_blank">Argh94</a></p>
    </div>
  </div>
  <script>
    document.getElementById('passwordModal').style.display = 'flex';
    
    function checkPassword() {
      const input = document.getElementById('passwordInput').value;
      if (input === "${PASSWORD}") {
        document.getElementById('passwordModal').style.display = 'none';
        document.getElementById('mainForm').style.display = 'block';
      } else {
        document.getElementById('errorMessage').textContent = 'رمز عبور اشتباه است!';
      }
    }
    
    document.getElementById('passwordInput').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        checkPassword();
      }
    });
  </script>
</body>
</html>
`;

async function fetchEndpoint(ipType) {
  try {
    const response = await fetch('https://ircfspace.github.io/endpoint/ip.json');
    const data = await response.json();
    const endpoints = ipType === 'ipv4' ? data.ipv4 : data.ipv6;
    if (!endpoints || endpoints.length === 0) throw new Error('No endpoints');
    return endpoints[Math.floor(Math.random() * endpoints.length)];
  } catch (error) {
    return ipType === 'ipv4' ? '162.159.195.118:988' : '[2606:4700:110:80bd:2df9:84d3:96b5:e837]:988';
  }
}

const keyPairs = [
  { privateKey: "EDXI/30lGy4EVyfPdJx30RaBowcRHS6WohVyMPSn80c=", reserved: "90,144,81" },
  { privateKey: "5p6wM/gxP+wFmFyGb5YU4ifWvj5rxrgl7EpqMfOH7Oo=", reserved: "53,5,168" },
  { privateKey: "UCjzV552f5sMH/Qm3F3AoWcLF6GsICBTEIpjyZ0S+VQ=", reserved: "162,61,132" },
  { privateKey: "YFZVAy20eMMc3KbuuSgvw9Eb7mvQFJcn9Xzkm2LOSk0=", reserved: "234,42,151" },
  { privateKey: "wCEFj8vgAQdPJYbGCp+L8Buvsf3tr28OZJjtQ+z33Xo=", reserved: "105,248,230" },
  { privateKey: "qDj2Pi4hsOxnt8HbW4dt03404nTtbi8rehou3k6uX2E=", reserved: "10,216,47" },
  { privateKey: "eMtTZFsOdem09Oagfapm4sOr/fgkMBMKlGnPa+LVo3U=", reserved: "212,192,200" },
  { privateKey: "8A8eGCrKfVGnyvYC7MSiF0Vgf9+aAgGrC1hY7PDwVl0=", reserved: "0,140,127" },
  { privateKey: "2B+VBkKQAc/hkyd2rjn1vVqHaqiYmrl/JoMBWB3FwXo=", reserved: "235,87,87" },
  { privateKey: "4JI0AcbOxC3uDv/nwfWYvWdGTYdh552K+r6Pol1uZ3s=", reserved: "17,13,240" },
  { privateKey: "gBrXfYO1UwKlm0oSqgqqH/a1ZyXFs8UaHWE1JEko3F0=", reserved: "151,236,25" },
  { privateKey: "EI8I+Gyvbz535PMrzuENUL1h/6CjxWYwzYZL7Mr3fEI=", reserved: "112,62,212" },
  { privateKey: "GLnYvhYE+MDhel0NDA/CfJ5lPyB/okQmhvEfXgVzPEY=", reserved: "131,135,36" },
  { privateKey: "yJC7KfAGVq1StEM/vOBPHHFXCKAQgDgpxdT5nRAdEnY=", reserved: "250,68,235" },
  { privateKey: "0KXxafjAAfrNi5TvC2S4ntOOYj+F7Y9NR/jnpt2GHHs=", reserved: "7,50,94" },
  { privateKey: "HjfYR5Dork/KlqG/iKLCbwi7ZtyXP5nmjGtohOuoOBQ=", reserved: "124,161,100" },
  { privateKey: "In8GJRx4DVB/03yDu+Dfse3dTGUd0BSjmnfjFpco75I=", reserved: "154,157,40" },
  { privateKey: "aoDElZ7UK30aZpsC9WoVhPeIQ2QOPrjzihkxVpnBFA4=", reserved: "50,66,122" },
  { privateKey: "FrcHYd0tN74p5Andx2aFHrIMkuSGwQb6EROeHLck1jo=", reserved: "78,185,176" },
  { privateKey: "mm3FGFam/NkodpUFXF1kSmqGCwTFEI70zs5VmSQ8AIA=", reserved: "33,142,81" },
  { privateKey: "l0+AjgT7o2oAyTm0qi55CYWt5ARag1AfWeLDcOxyavk=", reserved: "93,246,172" },
  { privateKey: "2JeflgPo2T75fY852uoQ5nr1SuEP0tv61epScPeyzuA=", reserved: "219,70,99" }
];

function getRandomKeyPair() {
  return keyPairs[Math.floor(Math.random() * keyPairs.length)];
}

function getRandomIP() {
  return Math.floor(Math.random() * 255) + "." +
         Math.floor(Math.random() * 255) + "." +
         Math.floor(Math.random() * 255) + "." +
         Math.floor(Math.random() * 255);
}

function getRandomIPv6() {
  let hex = "0123456789abcdef";
  let ipv6 = "";
  for (let i = 0; i < 8; i++) {
    let part = "";
    for (let j = 0; j < 4; j++) {
      part += hex.charAt(Math.floor(Math.random() * hex.length));
    }
    ipv6 += (i === 7) ? part : part + ":";
  }
  return ipv6;
}

function getRandomPort() {
  return Math.floor(Math.random() * (65535 - 1024) + 1024);
}

function getRandomKey() {
  let array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode.apply(null, array)).slice(0, 44);
}

function generateDNS() {
  let dnsList = ["10.202.10.10"];
  for (let i = 0; i < 40; i++) {
    dnsList.push(getRandomIP());
  }
  for (let i = 0; i < 500; i++) {
    dnsList.push(getRandomIPv6());
  }
  return dnsList.join(", ");
}

async function handleRequest(request) {
  if (request.method === 'POST') {
    const formData = await request.formData();
    const configType = formData.get('configType') || 'standard';
    const ipType = formData.get('ipType') || 'ipv4';
    const clientAddressIPv4 = formData.get('clientAddressIPv4');
    const clientAddressIPv6 = formData.get('clientAddressIPv6') || '';
    const serverPublicKey = formData.get('serverPublicKey');
    const dns = formData.get('dns') || '1.1.1.1, 1.0.0.1';
    const mtu = formData.get('mtu') || '1280';
    const keepalive = formData.get('keepalive') || '';

    if (!clientAddressIPv4 || !serverPublicKey) {
      return new Response(errorPage('لطفاً تمام فیلدهای الزامی را پر کنید!'), {
        headers: { 'Content-Type': 'text/html' },
        status: 400
      });
    }

    const endpoint = await fetchEndpoint(ipType);

    if (configType === 'gaming') {
      const privateKey = getRandomKey();
      const publicKey = getRandomKey();
      const preSharedKey = getRandomKey();
      const address = getRandomIP() + "/24";
      const gamingEndpoint = getRandomIP() + ":" + getRandomPort();
      const dnsServers = generateDNS();

      const gamingConfig = `[Interface]\nPrivateKey = ${privateKey}\nAddress = ${address}\nDNS = ${dnsServers}\nMTU = 1483\n\n[Peer]\nPublicKey = ${publicKey}\nPresharedKey = ${preSharedKey}\nEndpoint = ${gamingEndpoint}\nPersistentKeepalive = 47`;

      const resultPage = `
      <!DOCTYPE html>
      <html lang="fa" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>کانفیگ WireGuard گیمینگ</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; background-color: #f5f5f5; direction: rtl; }
          h1 { text-align: center; color: #333; }
          h2 { color: #555; }
          pre { background: #f8f9fa; padding: 15px; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word; }
          button { padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 5px; }
          button:hover { background-color: #0056b3; }
          .footer { text-align: center; margin-top: 20px; }
          .footer a { color: #007bff; text-decoration: none; }
          .footer a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <h1>کانفیگ WireGuard گیمینگ شما</h1>
        <h2>فرمت WireGuard گیمینگ:</h2>
        <pre id="gamingConfig">${gamingConfig}</pre>
        <button onclick="copyText('gamingConfig')">کپی کانفیگ گیمینگ</button>
        <button onclick="downloadConfig()">دانلود فایل</button>
        <button onclick="window.location.href='/'">برگشت به فرم</button>
        <div class="footer">
          <p>توسعه داده شده توسط <a href="https://github.com/Argh94" target="_blank">Argh94</a></p>
        </div>
        <script>
          function copyText(id) {
            navigator.clipboard.writeText(document.getElementById(id).innerText)
              .then(() => alert('کانفیگ کپی شد!'))
              .catch(() => alert('خطا در کپی کردن!'));
          }
          function downloadConfig() {
            const configText = document.getElementById('gamingConfig').innerText;
            const blob = new Blob([configText], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'wireguard-gaming.conf';
            a.click();
            window.URL.revokeObjectURL(url);
            alert('فایل دانلود شد!');
          }
        </script>
      </body>
      </html>
      `;
      return new Response(resultPage, { headers: { 'Content-Type': 'text/html' } });
    }

    const { privateKey, reserved } = getRandomKeyPair();
    let address = ipType === 'ipv4' ? clientAddressIPv4 : clientAddressIPv6;
    let allowedIPs = ipType === 'ipv4' ? '0.0.0.0/0' : '::/0';
    if (ipType === 'ipv4' && clientAddressIPv6) {
      address += `, ${clientAddressIPv6}`;
      allowedIPs += ', ::/0';
    } else if (ipType === 'ipv6' && clientAddressIPv4) {
      address += `, ${clientAddressIPv4}`;
      allowedIPs += ', 0.0.0.0/0';
    }

    let wireguardConfig = `[Interface]\nPrivateKey = ${privateKey}\nAddress = ${address}\n`;
    if (dns) wireguardConfig += `DNS = ${dns}\n`;
    if (mtu) wireguardConfig += `MTU = ${mtu}\n`;
    wireguardConfig += `[Peer]\nPublicKey = ${serverPublicKey}\nEndpoint = ${endpoint}\nAllowedIPs = ${allowedIPs}\n`;
    if (keepalive) wireguardConfig += `PersistentKeepalive = ${keepalive}\n`;

    let amneziaConfig = `[Interface]\nPrivateKey = ${privateKey}\nAddress = ${address}\n`;
    if (dns) amneziaConfig += `DNS = ${dns}\n`;
    if (mtu) amneziaConfig += `MTU = ${mtu}\n`;
    amneziaConfig += `[Peer]\nPublicKey = ${serverPublicKey}\nEndpoint = ${endpoint}\nAllowedIPs = ${allowedIPs}\n`;
    amneziaConfig += `Reserved = ${reserved}\n`;
    if (keepalive) amneziaConfig += `PersistentKeepalive = ${keepalive}\n`;

    const encodedPrivateKey = encodeURIComponent(privateKey);
    const encodedAddress = encodeURIComponent(address);
    const encodedPublicKey = encodeURIComponent(serverPublicKey);
    const v2rayNGConfig = `wireguard://${encodedPrivateKey}@${endpoint}?address=${encodedAddress}&reserved=${reserved}&publickey=${encodedPublicKey}&mtu=${mtu}#Argh94`;

    const resultPage = `
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>کانفیگ WireGuard</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; background-color: #f5f5f5; direction: rtl; }
        h1 { text-align: center; color: #333; }
        h2 { color: #555; }
        pre { background: #f8f9fa; padding: 15px; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word; }
        button { padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 5px; }
        button:hover { background-color: #0056b3; }
        .footer { text-align: center; margin-top: 20px; }
        .footer a { color: #007bff; text-decoration: none; }
        .footer a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <h1>کانفیگ WireGuard شما</h1>
      <h2>فرمت WireGuard:</h2>
      <pre id="wireguardConfig">${wireguardConfig}</pre>
      <h2>فرمت AmneziaVPN:</h2>
      <pre id="amneziaConfig">${amneziaConfig}</pre>
      <h2>فرمت v2rayNG:</h2>
      <pre id="v2rayConfig">${v2rayNGConfig}</pre>
      <button onclick="copyText('wireguardConfig')">کپی کانفیگ WireGuard</button>
      <button onclick="copyText('amneziaConfig')">کپی کانفیگ AmneziaVPN</button>
      <button onclick="copyText('v2rayConfig')">کپی کانفیگ v2rayNG</button>
      <button onclick="downloadConfig()">دانلود فایل WireGuard</button>
      <button onclick="window.location.href='/'">برگشت به فرم</button>
      <div class="footer">
        <p>توسعه داده شده توسط <a href="https://github.com/Argh94" target="_blank">Argh94</a></p>
      </div>
      <script>
        function copyText(id) {
          navigator.clipboard.writeText(document.getElementById(id).innerText)
            .then(() => alert('کانفیگ کپی شد!'))
            .catch(() => alert('خطا در کپی کردن!'));
        }
        function downloadConfig() {
          const configText = document.getElementById('wireguardConfig').innerText;
          const blob = new Blob([configText], { type: 'text/plain' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'wireguard.conf';
          a.click();
          window.URL.revokeObjectURL(url);
          alert('فایل دانلود شد!');
        }
      </script>
    </body>
    </html>
    `;
    return new Response(resultPage, { headers: { 'Content-Type': 'text/html' } });
  }

  return new Response(htmlForm, { headers: { 'Content-Type': 'text/html' } });
}

function errorPage(message) {
  return `
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <style>
        ${htmlForm.match(/<style>.*<\/style>/s)[0]}
        body { display: flex; flex-direction: column; justify-content: center; align-items: center; }
      </style>
    </head>
    <body>
      <h1>خطا</h1>
      <p class="error">${message}</p>
      <a href="/">برگشت</a>
      <div class="footer">
        <p>توسعه داده شده توسط <a href="https://github.com/Argh94" target="_blank">Argh94</a></p>
      </div>
    </body>
    </html>
  `;
}
