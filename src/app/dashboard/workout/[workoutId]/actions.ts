"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { updateWorkout } from "@/data/workouts";

const updateWorkoutSchema = z.object({
  workoutId: z.string().uuid(),
  name: z.string().min(1, "Workout name is required"),
  startedAt: z.coerce.date(),
});

export async function updateWorkoutAction(params: {
  workoutId: string;
  name: string;
  startedAt: Date;
}) {
  const validated = updateWorkoutSchema.parse(params);
  await updateWorkout(validated.workoutId, validated.name, validated.startedAt);
  revalidatePath("/dashboard");
}
