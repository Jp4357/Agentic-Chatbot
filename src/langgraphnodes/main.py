import streamlit as st

from src.langgraphnodes.ui.streamlit.loadui import LoadStreamlitUI
from src.langgraphnodes.LLMS.groqllm import GroqLLM
from src.langgraphnodes.graph.graph_builder import GraphBuilder
from src.langgraphnodes.ui.streamlit.display_result import DisplayResultStreamlit


def initialize_session_state():
    """Initialize session state variables"""
    if "conversation_messages" not in st.session_state:
        st.session_state.conversation_messages = []
    if "current_graph" not in st.session_state:
        st.session_state.current_graph = None
    if "current_config" not in st.session_state:
        st.session_state.current_config = None


def display_chat_history():
    """Display existing conversation history"""
    for message in st.session_state.conversation_messages:
        if hasattr(message, "type"):
            if message.type == "human":
                with st.chat_message("user"):
                    st.write(message.content)
            elif message.type == "ai":
                with st.chat_message("assistant"):
                    st.write(message.content)


def config_changed(user_input):
    """Check if configuration has changed"""
    current_config = {
        "llm": user_input.get("selected_llm"),
        "model": user_input.get("selected_groq_model"),
        "usecase": user_input.get("selected_usecase"),
    }
    return st.session_state.current_config != current_config


def load_langgraph_agenticai_app():
    """
    Loads and runs the LangGraph AgenticAI app
    """
    # Initialize session state
    initialize_session_state()

    ui = LoadStreamlitUI()
    user_input = ui.load_sreamlit_ui()

    if not user_input:
        st.error(
            "Error: Failed to load user input. Please check your inputs and try again."
        )
        return

    # Check if API key is required and provided
    if user_input.get("selected_llm") == "Groq":
        if not user_input.get("GROQ_API_KEY"):
            st.stop()

    # Add clear chat button
    col1, col2 = st.columns([1, 4])
    with col1:
        if st.button("Clear Chat"):
            st.session_state.conversation_messages = []
            st.rerun()

    # Display existing conversation
    display_chat_history()

    # Initialize or update graph if configuration changed
    if st.session_state.current_graph is None or config_changed(user_input):
        try:
            # Configure the LLM
            obj_llm_config = GroqLLM(user_controls_input=user_input)
            model = obj_llm_config.get_llm_model()

            if not model:
                st.error("Error: LLM model could not be initialized")
                return

            # Get usecase
            usecase = user_input.get("selected_usecase")
            if not usecase:
                st.error("Error: Usecase could not be initialized")
                return

            # Build graph
            graph_builder = GraphBuilder(model)
            st.session_state.current_graph = graph_builder.setup_graph(usecase)

            # Update current config
            st.session_state.current_config = {
                "llm": user_input.get("selected_llm"),
                "model": user_input.get("selected_groq_model"),
                "usecase": user_input.get("selected_usecase"),
            }

        except Exception as e:
            st.error(f"Error: Graph setup failed - {e}")
            return

    # Handle new user input
    user_message = st.chat_input("Enter your message: ")
    if user_message:
        try:
            usecase = user_input.get("selected_usecase")
            DisplayResultStreamlit(
                usecase, st.session_state.current_graph, user_message
            ).display_result_on_ui()
        except Exception as e:
            st.error(f"Error: Message processing failed - {e}")
            return
