import json
import os
from typing import cast

from crypto.gecko import cg
from crypto.state import AgentState
from langchain.tools import tool
from langchain_core.messages import AIMessage, ToolMessage
from langchain_core.runnables import RunnableConfig


@tool
def search_for_cryptos(queries: list[str]) -> list[dict]:
    """Search for cryptocurrencies based on queries, returns a list of coins with their name, symbol, and market data."""
    pass  # Remove if not needed


async def search_node(state: AgentState, config: RunnableConfig):
    """
    The search node is responsible for searching for cryptocurrencies based on queries.
    """
    ai_message = cast(AIMessage, state["messages"][-1])

    state["search_progress"] = state.get("search_progress", [])
    queries = ai_message.tool_calls[0]["args"]["queries"]

    for query in queries:
        state["search_progress"].append({"query": query, "results": [], "done": False})

    cryptos = []
    for i, query in enumerate(queries):
        try:
            search_results = cg.get_search(query)
            for result in search_results.get("coins", []):
                crypto = {
                    "id": result.get("id", ""),
                    "name": result.get("name", ""),
                    "symbol": result.get("symbol", ""),
                    "current_price": cg.get_price(
                        ids=result["id"], vs_currencies="usd"
                    )[result["id"]]["usd"],
                    "market_cap": result.get("market_cap", "N/A"),
                    "volume": result.get("total_volume", "N/A"),
                }
                cryptos.append(crypto)
        except Exception as e:
            cryptos.append({"error": f"Error fetching data for {query}: {str(e)}"})

        state["search_progress"][i]["done"] = True

    state["search_progress"] = []

    state["messages"].append(
        ToolMessage(
            tool_call_id=ai_message.tool_calls[0]["id"],
            content=f"Added the following cryptocurrency results: {json.dumps(cryptos)}",
        )
    )

    return state
