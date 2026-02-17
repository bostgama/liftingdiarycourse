"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1, "Workout name is required"),
  startedAt: z.coerce.date(),
});

export async function createWorkoutAction(params: {
  name: string;
  startedAt: Date;
}) {
  const validated = createWorkoutSchema.parse(params);
  await createWorkout(validated.name, validated.startedAt);
  revalidatePath("/dashboard");
}
