from src.langgraphnodes.state.state import State


class BasicChatbotNode:
    """
    Basic chatbot logic implementation
    """

    def __init__(self, model):
        self.llm = model

    def process(self, state: State) -> dict:
        """
        Process the input state and return the next state
        """
        print(f"Input state messages: {state['messages']}")
        print(f"Number of messages: {len(state['messages'])}")

        # Invoke LLM with current conversation
        ai_response = self.llm.invoke(state["messages"])

        print(f"AI response type: {type(ai_response)}")
        print(f"AI response: {ai_response}")

        # Return the new AI message - add_messages will append it
        return {"messages": [ai_response]}
