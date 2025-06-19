import streamlit as st

from src.langgraphnodes.ui.streamlit.loadui import LoadStreamlitUI


def load_langgraph_agenticai_app():
    """
    Loads and runs the LangGraph AgenticAI app
    """
    ui = LoadStreamlitUI()
    user_input = ui.load_sreamlit_ui()

    if not user_input:
        st.error(
            "Error: Failed to load user input. Please check your inputs and try again."
        )
        return

    user_message = st.chat_input("Enter your message: ")
    if user_message:
        pass
