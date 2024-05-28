"use client";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  borderColor: string;
}

function DashboardCard({ children, borderColor }: CardProps) {
  return (
    <>
      <div className={`min-h-44 w-full overflow-hidden rounded-sm border-t-4 ${borderColor} bg-white font-medium shadow-md`}>
        <div className="h-full w-full">{children}</div>
      </div>
    </>
  );
}

export default DashboardCard;
