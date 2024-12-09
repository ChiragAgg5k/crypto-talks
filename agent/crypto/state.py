from typing import List, Optional, TypedDict

from langgraph.graph import MessagesState


END = "END"


class Crypto(TypedDict):
    """A cryptocurrency."""

    id: str
    name: str
    symbol: str
    current_price: float
    market_cap: Optional[float]
    volume: Optional[float]
    description: Optional[str]


class SearchProgress(TypedDict):
    """The progress of a cryptocurrency search."""

    query: str
    results: List[str]
    done: bool


class PlanningProgress(TypedDict):
    """The progress of planning, if applicable."""

    crypto: Crypto
    done: bool


class AgentState(MessagesState):
    """The state of the cryptocurrency agent."""

    selected_crypto_id: Optional[str]
    cryptos: List[Crypto]
    search_progress: List[SearchProgress]
    planning_progress: List[PlanningProgress]
