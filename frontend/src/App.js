import React from "react";
import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./contexts/AuthContext";
import { UIProvider } from "./contexts/UIContext";

function App() {
  return (
    <div className="App">
      <UIProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </UIProvider>
    </div>
  );
}

export default App;