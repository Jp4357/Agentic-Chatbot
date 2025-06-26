import ReactDOM from "react-dom/client";
import App from "./App";
import '../styles/index.css'
import '../styles/App.css'
import { Provider } from "react-redux";
import { store } from "./store/store";
import { BrowserRouter } from "react-router";

// Ensure root element exists and is not null
const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
} else {
  throw new Error("Root element not found");
}