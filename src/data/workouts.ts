import { db } from "@/db";
import { workouts, workoutExercises, exercises, sets } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, gte, lt, count, asc } from "drizzle-orm";
import { startOfDay, endOfDay } from "date-fns";

export async function createWorkout(name: string, startedAt: Date) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [workout] = await db
    .insert(workouts)
    .values({ userId, name, startedAt })
    .returning();

  return workout;
}

export async function getWorkoutsByDate(date: Date) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  const rows = await db
    .select({
      workoutId: workouts.id,
      workoutName: workouts.name,
      startedAt: workouts.startedAt,
      completedAt: workouts.completedAt,
      exerciseName: exercises.name,
      exerciseOrder: workoutExercises.order,
      workoutExerciseId: workoutExercises.id,
      setCount: count(sets.id),
    })
    .from(workouts)
    .leftJoin(workoutExercises, eq(workoutExercises.workoutId, workouts.id))
    .leftJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
    .leftJoin(sets, eq(sets.workoutExerciseId, workoutExercises.id))
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.startedAt, dayStart),
        lt(workouts.startedAt, dayEnd)
      )
    )
    .groupBy(
      workouts.id,
      workouts.name,
      workouts.startedAt,
      workouts.completedAt,
      exercises.name,
      workoutExercises.order,
      workoutExercises.id
    )
    .orderBy(asc(workouts.startedAt), asc(workoutExercises.order));

  const workoutMap = new Map<
    string,
    {
      id: string;
      name: string;
      startedAt: Date;
      completedAt: Date | null;
      exercises: { name: string; sets: number }[];
    }
  >();

  for (const row of rows) {
    if (!workoutMap.has(row.workoutId)) {
      workoutMap.set(row.workoutId, {
        id: row.workoutId,
        name: row.workoutName,
        startedAt: row.startedAt,
        completedAt: row.completedAt,
        exercises: [],
      });
    }

    if (row.exerciseName) {
      workoutMap.get(row.workoutId)!.exercises.push({
        name: row.exerciseName,
        sets: Number(row.setCount),
      });
    }
  }

  return Array.from(workoutMap.values());
}
