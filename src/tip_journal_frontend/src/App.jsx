import React from "react";
import AppHeader from "./layouts/AppHeader";
import AppContent from "./layouts/AppContent";
import { AuthProvider } from "./hooks/use-auth-client";
import PostList from "./components/PostList";

function App() {
  AuthProvider
  
  return (
    <AuthProvider>
      <AppHeader />
      <AppContent>
        <PostList />
      </AppContent>
    </AuthProvider>
  );
}

export default App;
