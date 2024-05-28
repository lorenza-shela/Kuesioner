"use client";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

function Container({ children }: CardProps) {
  return (
    <section className="min-h-screen bg-[#F0F0F0]">
      <div className="mx-auto flex flex-col items-center px-6 py-8 lg:py-0">{children}</div>
    </section>
  );
}

export default Container;
