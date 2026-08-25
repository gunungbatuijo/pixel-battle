import React from "react";
import { useAuth } from "@/lib/AuthContext";
import Home from "@/pages/Home";
import Arcade from "@/pages/Arcade";

// Public root: logged-in users see their dashboard, guests (e.g. CrazyGames
// players) land straight in the arcade — no login wall.
export default function RootGate() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Home /> : <Arcade />;
}