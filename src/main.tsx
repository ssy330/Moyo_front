import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ModalProvider from "./pages/provider/modal-provider";
import SessionProvider from "./pages/provider/session-provider";
import "./index.css";

const queryClient = new QueryClient();

// supabase.auth.onAuthStateChange((_event, session) => {
//   store.dispatch(setSession(session));
// });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <SessionProvider>
        <ModalProvider>
          <RouterProvider router={router} />
        </ModalProvider>
      </SessionProvider>
    </Provider>
  </QueryClientProvider>,
);
