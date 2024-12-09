import os

from dotenv import load_dotenv
from pycoingecko import CoinGeckoAPI


load_dotenv()
cg = CoinGeckoAPI(demo_api_key=os.getenv("COINGECKO_API_KEY"))
print(cg.get_coin_market_chart_by_id("bitcoin", vs_currency="usd", days=30))
