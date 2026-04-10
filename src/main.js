import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const payAmountInput = document.getElementById('pay-amount');
  const receiveAmountInput = document.getElementById('receive-amount');
  const routePanel = document.getElementById('route-panel');
  const routeHops = document.getElementById('route-hops');
  const swapBtn = document.getElementById('swap-btn');
  const invertBtn = document.querySelector('.invert-btn');

  let currentPayToken = { symbol: 'SOL', logo: 'https://cryptologos.cc/logos/solana-sol-logo.png' };
  let currentReceiveToken = { symbol: 'USDC', logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' };
  
  let routeTimer = null;

  // Render Token UI helper
  const renderTokens = () => {
    document.querySelector('#pay-token-btn img').src = currentPayToken.logo;
    document.querySelector('#pay-token-btn span.token-symbol').textContent = currentPayToken.symbol;
    document.querySelector('#receive-token-btn img').src = currentReceiveToken.logo;
    document.querySelector('#receive-token-btn span.token-symbol').textContent = currentReceiveToken.symbol;
  };

  // Handle Input Changes
  payAmountInput.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    
    if (isNaN(val) || val <= 0) {
      receiveAmountInput.value = '';
      routePanel.style.display = 'none';
      swapBtn.textContent = 'Enter an amount';
      swapBtn.className = 'action-btn';
      return;
    }

    // Show loading state
    routePanel.style.display = 'block';
    document.querySelector('.route-label').textContent = 'Finding best route...';
    document.querySelector('.route-loader').style.display = 'block';
    routeHops.innerHTML = '';
    
    swapBtn.textContent = 'Finding Route...';
    swapBtn.className = 'action-btn';

    // Debounce fake API call
    clearTimeout(routeTimer);
    routeTimer = setTimeout(() => calculateMockRoute(val), 600);
  });

  const calculateMockRoute = (amount) => {
    // Mock exchange rate (e.g. 1 SOL = 145 USDC)
    const rate = currentPayToken.symbol === 'SOL' ? 145.20 : 1/145.20;
    const output = (amount * rate).toFixed(4);
    
    receiveAmountInput.value = output;

    // Update Route UI
    document.querySelector('.route-label').textContent = 'Best Route (Max Return)';
    document.querySelector('.route-loader').style.display = 'none';
    
    // Create Hops HTML
    routeHops.innerHTML = `
      <div class="hop">
        <img src="${currentPayToken.logo}" alt="${currentPayToken.symbol}" />
        <span>${currentPayToken.symbol}</span>
      </div>
      <span class="route-arrow">→</span>
      <div class="hop" style="background: rgba(33, 196, 89, 0.1); border-color: rgba(33, 196, 89, 0.3);">
        <span style="color: #21c459; font-weight: 600; font-size: 0.75rem;">Orca (100%)</span>
      </div>
      <span class="route-arrow">→</span>
      <div class="hop">
        <img src="${currentReceiveToken.logo}" alt="${currentReceiveToken.symbol}" />
        <span>${currentReceiveToken.symbol}</span>
      </div>
    `;

    swapBtn.textContent = 'Swap';
    swapBtn.className = 'action-btn active';
  };

  // Invert Tokens
  invertBtn.addEventListener('click', () => {
    const temp = currentPayToken;
    currentPayToken = currentReceiveToken;
    currentReceiveToken = temp;
    
    renderTokens();

    const payVal = payAmountInput.value;
    const receiveVal = receiveAmountInput.value;
    
    // Invert amounts effectively
    if (receiveVal && parseFloat(receiveVal) > 0) {
      payAmountInput.value = receiveVal;
      // Recalculate
      payAmountInput.dispatchEvent(new Event('input'));
    } else {
      payAmountInput.value = '';
      receiveAmountInput.value = '';
      routePanel.style.display = 'none';
      swapBtn.textContent = 'Enter an amount';
      swapBtn.className = 'action-btn';
    }
  });
});
