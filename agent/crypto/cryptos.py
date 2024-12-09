from typing import List, cast

from crypto.gecko import cg
from crypto.state import AgentState, Crypto
from langchain_core.messages import AIMessage, ToolMessage
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import tool


async def cryptos_node(state: AgentState, config: RunnableConfig):
    """
    Lets the user know about the operations about to be performed on cryptocurrencies.
    """
    return state


async def perform_cryptos_node(state: AgentState, config: RunnableConfig):
    """Execute cryptocurrency operations"""
    ai_message = cast(AIMessage, state["messages"][-1])

    action_handlers = {
        "add_cryptos": lambda args: handle_add_cryptos(state, args),
        "delete_cryptos": lambda args: handle_delete_cryptos(state, args),
        "update_cryptos": lambda args: handle_update_cryptos(state, args),
    }

    if not state.get("cryptos"):
        state["cryptos"] = []

    for tool_call in ai_message.tool_calls:
        action = tool_call["name"]
        args = tool_call.get("args", {})

        if action in action_handlers:
            message = action_handlers[action](args)
            state["messages"].append(
                ToolMessage(content=message, tool_call_id=tool_call["id"])
            )

    return state


async def prices_node(state: AgentState, config: RunnableConfig):
    """Handles requests for cryptocurrency prices."""
    ai_message = state["messages"][-1]

    coins = ai_message.tool_calls[0].get("args", {}).get("coins", [])

    if not coins:
        return state

    prices = get_prices(coins)
    state["prices"] = prices

    state["messages"].append(
        {
            "tool_call_id": ai_message.tool_calls[0]["id"],
            "content": f"Fetched the following prices: {prices}",
        }
    )

    return state


async def insights_node(state: AgentState, config: RunnableConfig):
    """Handles requests for cryptocurrency insights."""
    ai_message = state["messages"][-1]

    coin = ai_message.tool_calls[0].get("args", {}).get("coin", "")

    if not coin:
        return state

    insights = get_insights(coin)

    state["insights"] = insights

    state["messages"].append(
        {
            "tool_call_id": ai_message.tool_calls[0]["id"],
            "content": f"Fetched the following insights for {coin}: {insights}",
        }
    )

    return state


def handle_add_cryptos(state: AgentState, args: dict) -> str:
    cryptos = args.get("cryptos", [])

    state["cryptos"].extend(cryptos)
    return f"Added {len(cryptos)} cryptocurrencies!"


def handle_delete_cryptos(state: AgentState, args: dict) -> str:
    crypto_ids = args.get("crypto_ids", [])

    if state.get("selected_crypto_id") and state["selected_crypto_id"] in crypto_ids:
        state["selected_crypto_id"] = None

    state["cryptos"] = [
        crypto for crypto in state["cryptos"] if crypto["id"] not in crypto_ids
    ]
    return f"Deleted {len(crypto_ids)} cryptocurrencies!"


def handle_update_cryptos(state: AgentState, args: dict) -> str:
    cryptos = args.get("cryptos", [])
    for crypto in cryptos:
        state["cryptos"] = [
            {**existing_crypto, **crypto}
            if existing_crypto["id"] == crypto["id"]
            else existing_crypto
            for existing_crypto in state["cryptos"]
        ]
    return f"Updated {len(cryptos)} cryptocurrencies!"


@tool
def delete_cryptos(crypto_ids: List[str], state: AgentState) -> str:
    """Delete one or many cryptocurrencies"""
    deleted_count = 0

    for crypto_id in crypto_ids:
        if any(crypto["id"] == crypto_id for crypto in state["cryptos"]):
            state["cryptos"] = [
                crypto for crypto in state["cryptos"] if crypto["id"] != crypto_id
            ]
            deleted_count += 1

    return f"Deleted {deleted_count} cryptocurrencies!"


@tool
def update_cryptos(cryptos: List[Crypto], state: AgentState) -> str:
    """Update one or many cryptocurrencies"""
    updated_count = 0

    for crypto in cryptos:
        for index, existing_crypto in enumerate(state["cryptos"]):
            if existing_crypto["id"] == crypto["id"]:
                state["cryptos"][index] = {**existing_crypto, **crypto}
                updated_count += 1
                break

    return f"Updated {updated_count} cryptocurrencies!"


@tool
def get_prices(coins: List[str]) -> List[dict]:
    """Fetch the latest prices for a list of cryptocurrencies from CoinGecko using pycoingecko."""
    prices = cg.get_price(ids=",".join(coins), vs_currencies="usd")
    return prices


@tool
def get_insights(coin: str) -> dict:
    """Fetch insights for a given cryptocurrency using the CoinGecko API."""

    market_data = cg.get_coin_market_chart_by_id(id=coin, vs_currency="usd", days="7")
    coin_data = cg.get_coin_by_id(id=coin)

    insights = {
        "name": coin_data.get("name", ""),
        "symbol": coin_data.get("symbol", ""),
        "current_price": market_data["prices"][-1][1]
        if market_data["prices"]
        else None,
        "market_cap": coin_data.get("market_data", {})
        .get("market_cap", {})
        .get("usd", 0),
        "24h_volume": coin_data.get("market_data", {})
        .get("total_volume", {})
        .get("usd", 0),
        "price_change_percentage_7d": market_data["prices"][-1][1]
        / market_data["prices"][0][1]
        * 100
        if market_data["prices"]
        else 0,
        "history": market_data.get("prices", []),
    }
    return insights
