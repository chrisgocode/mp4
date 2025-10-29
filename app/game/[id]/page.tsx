"use client";

import { useParams } from "next/navigation";

export default function GamePage() {
  const { id } = useParams();

  return (
    <div>
      <p>Game ID: {id}</p>
    </div>
  );
}
