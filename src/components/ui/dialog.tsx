"use client";

import * as React from "react";

export function Dialog({ children }: { children: React.ReactNode }) {
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">{children}</div>;
}

export function DialogContent({ children }: { children: React.ReactNode }) {
  return <div className="bg-white p-6 rounded-lg">{children}</div>;
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="text-lg font-semibold">{children}</div>;
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold">{children}</h2>;
}

export function DialogTrigger({ children }: { children: React.ReactNode }) {
  return <button className="text-blue-500">{children}</button>;
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 flex justify-end">{children}</div>;
}

export function DialogClose({ children }: { children: React.ReactNode }) {
  return <button className="text-gray-500">{children}</button>;
}
