"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createWorkoutAction } from "./actions";

export function WorkoutForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [startedAt, setStartedAt] = useState(
    () => new Date().toISOString().slice(0, 16)
  );
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    try {
      await createWorkoutAction({ name, startedAt: new Date(startedAt) });
      router.push("/dashboard");
    } catch {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">New Workout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Workout Name</Label>
            <Input
              id="name"
              placeholder="e.g. Morning Push Day"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startedAt">Started At</Label>
            <Input
              id="startedAt"
              type="datetime-local"
              value={startedAt}
              onChange={(e) => setStartedAt(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Workout"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
