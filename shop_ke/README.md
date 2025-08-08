# Shop KE

A simple Django e‑commerce prototype focused on the Kenyan market (KSh currency, M‑Pesa manual option).

## Quickstart

1. Create venv and install deps

```bash
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
```

2. Create the project database and run the server

```bash
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

Visit http://localhost:8000

## Apps
- core: homepage
- catalog: categories and products
- cart: session-based cart
- orders: checkout and orders
- payments: placeholder