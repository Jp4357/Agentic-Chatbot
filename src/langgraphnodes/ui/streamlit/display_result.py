import streamlit as st
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage
import json


class DisplayResultStreamlit:
    def __init__(self, usecase, graph, user_message):
        self.usecase = usecase
        self.graph = graph
        self.user_message = user_message

    def display_result_on_ui(self):
        usecase = self.usecase
        graph = self.graph
        user_message = self.user_message

        print(f"User message: {user_message}")

        if usecase == "Basic Chatbot":
            # Create proper HumanMessage object
            human_message = HumanMessage(content=user_message)

            # Add user message to conversation history
            st.session_state.conversation_messages.append(human_message)

            # Display user message immediately
            with st.chat_message("user"):
                st.write(user_message)

            # Create state with full conversation history
            initial_state = {"messages": st.session_state.conversation_messages}

            try:
                # Process through graph
                result = graph.invoke(initial_state)

                # Extract the latest AI message
                if "messages" in result:
                    messages = result["messages"]

                    # Find the latest AI message
                    latest_ai_message = None
                    for msg in reversed(messages):
                        if isinstance(msg, AIMessage):
                            latest_ai_message = msg
                            break

                    if latest_ai_message:
                        # Update conversation history with full result
                        st.session_state.conversation_messages = messages

                        # Display AI response
                        with st.chat_message("assistant"):
                            st.write(latest_ai_message.content)
                    else:
                        st.error("No AI response found in result")
                else:
                    st.error("No messages found in graph result")

            except Exception as e:
                st.error(f"Error during graph execution: {str(e)}")
                print(f"Graph execution error: {e}")
                # Remove the user message from history if processing failed
                if (
                    st.session_state.conversation_messages
                    and st.session_state.conversation_messages[-1] == human_message
                ):
                    st.session_state.conversation_messages.pop()
