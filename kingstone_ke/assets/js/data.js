// Product catalog and helpers

const productCatalog = [
  {
    id: 'KS-101',
    name: 'Smartphone Pro 6.5" 128GB',
    category: 'Electronics',
    price: 34999,
    image: null,
    tags: ['phone', 'smartphone', 'android'],
    popularity: 98,
    createdAt: '2025-06-12'
  },
  {
    id: 'KS-102',
    name: '4K LED TV 55" HDR',
    category: 'Electronics',
    price: 75999,
    image: null,
    tags: ['tv', '4k', 'hdr'],
    popularity: 89,
    createdAt: '2025-05-30'
  },
  {
    id: 'KS-201',
    name: 'Sneakers AirWave (Unisex)',
    category: 'Fashion',
    price: 6999,
    image: null,
    tags: ['shoes', 'sneakers'],
    popularity: 86,
    createdAt: '2025-06-18'
  },
  {
    id: 'KS-202',
    name: 'Kitenge Shirt Premium',
    category: 'Fashion',
    price: 3499,
    image: null,
    tags: ['kitenge', 'shirt'],
    popularity: 75,
    createdAt: '2025-04-22'
  },
  {
    id: 'KS-301',
    name: 'Electric Kettle 1.7L',
    category: 'Home & Kitchen',
    price: 2999,
    image: null,
    tags: ['kettle', 'kitchen'],
    popularity: 72,
    createdAt: '2025-06-01'
  },
  {
    id: 'KS-302',
    name: 'Non-stick Pan 28cm',
    category: 'Home & Kitchen',
    price: 2499,
    image: null,
    tags: ['pan', 'cookware'],
    popularity: 68,
    createdAt: '2025-05-01'
  },
  {
    id: 'KS-401',
    name: 'Bluetooth Headphones ANC',
    category: 'Electronics',
    price: 8999,
    image: null,
    tags: ['audio', 'headphones'],
    popularity: 83,
    createdAt: '2025-06-25'
  },
  {
    id: 'KS-402',
    name: 'Portable Speaker 20W',
    category: 'Electronics',
    price: 5499,
    image: null,
    tags: ['speaker', 'bluetooth'],
    popularity: 72,
    createdAt: '2025-06-10'
  },
  {
    id: 'KS-501',
    name: 'Fitness Smartwatch',
    category: 'Electronics',
    price: 6999,
    image: null,
    tags: ['watch', 'fitness'],
    popularity: 78,
    createdAt: '2025-05-18'
  },
  {
    id: 'KS-601',
    name: 'Organic Kenyan Coffee 500g',
    category: 'Groceries',
    price: 1199,
    image: null,
    tags: ['coffee', 'organic', 'kenya'],
    popularity: 71,
    createdAt: '2025-05-05'
  },
  {
    id: 'KS-602',
    name: 'Premium Tea Leaves 250g',
    category: 'Groceries',
    price: 499,
    image: null,
    tags: ['tea', 'kenya'],
    popularity: 65,
    createdAt: '2025-04-28'
  },
  {
    id: 'KS-701',
    name: 'Gaming Mouse RGB',
    category: 'Electronics',
    price: 3499,
    image: null,
    tags: ['mouse', 'gaming'],
    popularity: 64,
    createdAt: '2025-06-20'
  }
];

function getUniqueCategories(products) {
  const categories = Array.from(new Set(products.map(p => p.category)));
  return categories.sort();
}

function formatPriceKES(amount) {
  return `KSh ${amount.toLocaleString('en-KE')}`;
}

function buildPlaceholderImage(name, colorA = '#00a859', colorB = '#bb1919') {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
  const svg = `<?xml version='1.0' encoding='UTF-8'?>
  <svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>
    <defs>
      <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
        <stop offset='0%' stop-color='${colorA}' stop-opacity='0.9'/>
        <stop offset='100%' stop-color='${colorB}' stop-opacity='0.9'/>
      </linearGradient>
      <filter id='grain'>
        <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
        <feColorMatrix type='saturate' values='0.2'/>
        <feComponentTransfer>
          <feFuncA type='linear' slope='0.06'/>
        </feComponentTransfer>
      </filter>
    </defs>
    <rect width='100%' height='100%' fill='url(#g)'/>
    <rect width='100%' height='100%' filter='url(#grain)' opacity='0.2'/>
    <text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle'
      font-family='Poppins, Arial, Helvetica, sans-serif' font-weight='700' font-size='120'
      fill='white' opacity='0.9'>${initials}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Hydrate images if missing
for (const p of productCatalog) {
  if (!p.image) {
    p.image = buildPlaceholderImage(p.name);
  }
}

const categoryList = getUniqueCategories(productCatalog);