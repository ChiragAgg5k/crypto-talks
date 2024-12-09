import os
from datetime import datetime, timedelta
from typing import Any, Dict, Optional

from crypto.gecko import cg
from crypto.state import END, AgentState
from dotenv import load_dotenv
from langchain_core.messages import AIMessage, SystemMessage, ToolMessage
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import tool
from langchain_groq import ChatGroq


load_dotenv()


@tool
def get_price(coin_id: str) -> Dict[str, Any]:
    """Fetch the latest price of a cryptocurrency"""
    try:
        price = cg.get_price(ids=coin_id, vs_currencies="usd")
        return {
            "coin_id": coin_id,
            "price": price[coin_id]["usd"],
        }
    except Exception as e:
        return {
            "coin_id": coin_id,
            "error": f"Failed to fetch price for {coin_id}: {str(e)}",
        }


@tool
def get_trends() -> Dict[str, Any]:
    """Fetch trending coins"""
    try:
        trends = cg.get_search_trending()
        return {
            "trends": [coin["name"] for coin in trends["coins"]],
        }
    except Exception as e:
        return {
            "error": f"Failed to fetch trending coins: {str(e)}",
        }


@tool
def get_insights(coin_id: str) -> Dict[str, Any]:
    """Fetch coin insights (market cap, volume, etc.)"""
    try:
        coin_data = cg.get_coin_market_chart_by_id(coin_id, vs_currency="usd", days=30)
        market_caps = coin_data["market_caps"][-1][1]
        volume = coin_data["total_volumes"][-1][1]

        return {
            "coin_id": coin_id,
            "market_caps": market_caps,
            "volume": volume,
        }
    except Exception as e:
        return {
            "error": f"Failed to fetch insights for {coin_id}: {str(e)}",
            "coin_id": coin_id,
        }


@tool
def get_history(coin_id: str, date: Optional[str] = None) -> Dict[str, Any]:
    """Fetch historical data for a cryptocurrency"""
    try:
        if date is None:
            date = (datetime.now() - timedelta(days=1)).strftime("%d-%m-%Y")

        history = cg.get_coin_history_by_id(coin_id, date=date, localization=False)
        return {
            "coin_id": coin_id,
            "price": history["market_data"]["current_price"]["usd"],
            "date": date,
        }
    except Exception as e:
        return {
            "error": f"Failed to fetch history for {coin_id}: {str(e)}",
            "coin_id": coin_id,
        }


llm = ChatGroq(model="llama-3.3-70b-specdec", api_key=os.getenv("GROQ_API_KEY"))
tools = [get_price, get_trends, get_insights, get_history]


async def chat_node(state: AgentState, config: RunnableConfig):
    """Handle chat operations for cryptocurrency-related questions"""
    llm_with_tools = llm.bind_tools(tools)

    system_message = """
    You are a cryptocurrency assistant that provides the latest prices, market trends, insights, and history for coins.
    If the user asks for the price of a coin, provide the current price.
    If the user asks for trends, provide the top trending coins.
    If the user asks for insights, provide market cap, volume, etc.
    If the user asks for historical data, provide the price at a specific point in time.
    """

    messages = state.get("messages", [])

    try:
        response = await llm_with_tools.ainvoke(
            [SystemMessage(content=system_message), *messages], config=config
        )
    except Exception as e:
        return {"messages": [SystemMessage(content=f"An error occurred: {str(e)}")]}

    if not isinstance(response, AIMessage):
        return {
            "messages": [response],
            "selected_coin_id": state.get("selected_coin_id"),
        }

    if response.tool_calls:
        for tool_call in response.tool_calls:
            tool_name = tool_call["name"]
            tool_args = tool_call.get("args", {})

            content = await _process_tool_call(tool_name, tool_args)

            tool_message = ToolMessage(
                tool_call_id=tool_call["id"],
                content=content,
            )

            return {
                "messages": [response, tool_message],
                "selected_coin_id": tool_args.get("coin_id"),
            }

    return {
        "messages": [response],
        "selected_coin_id": state.get("selected_coin_id"),
    }


async def _process_tool_call(tool_name: str, tool_args: Dict[str, Any]) -> Dict[str, Any]:
    """Process tool calls with a unified approach"""

    coin_id = tool_args.get("coin_id", "")

    if tool_name == "get_price":
        price = cg.get_price(ids=coin_id, vs_currencies="usd")

        return {
            "coin_id": tool_args.get("coin_id", ""),
            "price": price[coin_id]["usd"],
        }
    elif tool_name == "get_trends":
        trends = cg.get_search_trending()

        return {
            "trends": [coin["name"] for coin in trends["coins"]],
        }
    elif tool_name == "get_insights":
        insights = cg.get_coin_market_chart_by_id(coin_id, vs_currency="usd", days=30)

        return {
            "coin_id": tool_args.get("coin_id", ""),
            "market_caps": insights["market_caps"][-1][1],
            "volume": insights["total_volumes"][-1][1],
        }
    elif tool_name == "get_history":
        date = (datetime.now() - timedelta(days=1)).strftime("%d-%m-%Y")
        history = cg.get_coin_history_by_id(coin_id, date=date, localization=False)

        return {
            "coin_id": tool_args.get("coin_id", ""),
            "price": history["market_data"]["current_price"]["usd"],
            "date": date,
        }
    return {}


def route(state: AgentState):
    """Route the conversation flow based on the last message"""
    messages = state.get("messages", [])

    if not messages:
        return END

    last_message = messages[-1]

    if isinstance(last_message, AIMessage) and last_message.tool_calls:
        tool_name = last_message.tool_calls[0]["name"]

        if tool_name in ["get_price", "get_trends"]:
            return "prices_node"
        if tool_name in ["get_insights"]:
            return "insights_node"
        if tool_name in ["add_cryptos", "delete_cryptos", "update_cryptos"]:
            return "cryptos_node"

        return "chat_node"

    if isinstance(last_message, ToolMessage):
        return "chat_node"

    return END
