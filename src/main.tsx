import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.css";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import supabase from "./lib/supabase";
import { setSession } from "./features/sessionSlice";
import ModalProvider from "./pages/provider/modal-provider";

const queryClient = new QueryClient();

supabase.auth.onAuthStateChange((_event, session) => {
  store.dispatch(setSession(session));
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <ModalProvider>
        <RouterProvider router={router} />
      </ModalProvider>
    </Provider>
  </QueryClientProvider>,
);
