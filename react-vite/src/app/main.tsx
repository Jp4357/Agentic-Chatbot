import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./features/store";

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