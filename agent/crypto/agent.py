from typing import cast

from crypto.chat import chat_node
from crypto.cryptos import (
    cryptos_node,
    insights_node,
    perform_cryptos_node,
    prices_node,
)
from crypto.state import AgentState
from langchain_core.messages import AIMessage, ToolMessage

from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph


def route(state: AgentState):
    messages = state.get("messages", [])
    if messages and isinstance(messages[-1], AIMessage):
        ai_message = cast(AIMessage, messages[-1])

        if ai_message.tool_calls:
            tool_name = ai_message.tool_calls[0]["name"]
            if tool_name in ["get_prices", "analyze_coin", "get_trends"]:
                return "prices_node"
            if tool_name in ["get_insights"]:
                return "insights_node"
            if tool_name in ["add_cryptos", "delete_cryptos", "update_cryptos"]:
                return "cryptos_node"
            return "chat_node"

    if messages and isinstance(messages[-1], ToolMessage):
        return "chat_node"

    return END


graph_builder = StateGraph(AgentState)

graph_builder.add_node("chat_node", chat_node)
graph_builder.add_node("cryptos_node", cryptos_node)
graph_builder.add_node("perform_cryptos_node", perform_cryptos_node)
graph_builder.add_node("prices_node", prices_node)
graph_builder.add_node("insights_node", insights_node)

graph_builder.add_conditional_edges(
    "chat_node",
    route,
    ["prices_node", "insights_node", "cryptos_node", "chat_node", END],
)

graph_builder.add_edge(START, "chat_node")
graph_builder.add_edge("prices_node", "chat_node")
graph_builder.add_edge("insights_node", "chat_node")
graph_builder.add_edge("cryptos_node", "perform_cryptos_node")
graph_builder.add_edge("perform_cryptos_node", "chat_node")

graph = graph_builder.compile(
    checkpointer=MemorySaver(),
)
