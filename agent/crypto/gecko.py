import os

from dotenv import load_dotenv
from pycoingecko import CoinGeckoAPI


load_dotenv()
cg = CoinGeckoAPI(demo_api_key=os.getenv("COINGECKO_API_KEY"))