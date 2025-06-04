"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: ChatLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
      router.push("/login");
    }
  }, [router]);

  return <>{children}</>;
}
