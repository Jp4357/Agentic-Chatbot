from pydantic import BaseModel, Field
from typing_extensions import TypedDict
from langgraph.graph import add_messages
from typing import Annotated, List
from langchain_core.messages import BaseMessage


class State(TypedDict):
    """
    Represent the structure of the state used in graph
    """

    messages: Annotated[List[BaseMessage], add_messages]
