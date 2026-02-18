import { format } from "date-fns";
import { Dumbbell } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkoutsByDate } from "@/data/workouts";
import { DatePicker } from "./date-picker";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: dateParam } = await searchParams;
  const date = dateParam ? new Date(dateParam + "T00:00:00") : new Date();

  const workouts = await getWorkoutsByDate(date);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Workouts</h2>
        <DatePicker date={date} />
      </div>

      {workouts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <Dumbbell className="mb-3 size-10 text-muted-foreground" />
          <p className="text-lg font-medium">No workouts</p>
          <p className="text-sm text-muted-foreground">
            No workouts logged for {format(date, "do MMM yyyy")}.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {workouts.map((workout) => (
            <Link
              key={workout.id}
              href={`/dashboard/workout/${workout.id}`}
              className="block"
            >
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">{workout.name}</CardTitle>
                  {workout.completedAt ? (
                    <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                      Completed
                    </span>
                  ) : (
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      In Progress
                    </span>
                  )}
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {workout.exercises.map((exercise) => (
                      <li key={exercise.name} className="flex justify-between">
                        <span>{exercise.name}</span>
                        <span>
                          {exercise.sets} {exercise.sets === 1 ? "set" : "sets"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
