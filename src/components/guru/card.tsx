"use client";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

function Card({ children }: CardProps) {
  return (
    <>
      <div className="mb-4 w-full rounded-lg border border-gray-200 bg-white object-fill p-6 shadow">{children}</div>
    </>
  );
}

export default Card;
