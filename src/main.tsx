import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./index.css";
import supabase from "@/lib/supabase";
import { setSession } from "./features/sessionSlice";

const queryClient = new QueryClient();

supabase.auth.onAuthStateChange((event, session) => {
  store.dispatch(setSession(session)); // 로그인 / 로그아웃 이벤트 모두 반영
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </QueryClientProvider>,
);
