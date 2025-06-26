import ReactDOM from "react-dom/client";
import App from "./App";
import '/src/styles/index.css'
import '/src/styles/App.css'
import { Provider } from "react-redux";
import { store } from "./store/store";

// Ensure root element exists and is not null
const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <Provider store={store}>
      <App />
    </Provider>
  );
} else {
  throw new Error("Root element not found");
}