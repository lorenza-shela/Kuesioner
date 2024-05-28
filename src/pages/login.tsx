"use client";
import LoginForm from "../components/loginForm";
import "tailwindcss/tailwind.css";
import { UserProvider } from "../components/userContext";

export default function login() {
  return (
    <>
      <div className="h-full">
        <LoginForm />
      </div>
    </>
  );
}
