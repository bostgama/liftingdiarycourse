"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data — will be replaced with real data fetching later
const MOCK_WORKOUTS = [
  {
    id: "1",
    name: "Upper Body Push",
    startedAt: new Date(),
    completedAt: new Date(),
    exercises: [
      { name: "Bench Press", sets: 4 },
      { name: "Overhead Press", sets: 3 },
      { name: "Incline Dumbbell Press", sets: 3 },
    ],
  },
  {
    id: "2",
    name: "Lower Body",
    startedAt: new Date(),
    completedAt: null,
    exercises: [
      { name: "Squat", sets: 5 },
      { name: "Romanian Deadlift", sets: 4 },
      { name: "Leg Press", sets: 3 },
    ],
  },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Workouts</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <CalendarIcon className="size-4" />
              {format(date, "do MMM yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => d && setDate(d)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {MOCK_WORKOUTS.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <Dumbbell className="mb-3 size-10 text-muted-foreground" />
          <p className="text-lg font-medium">No workouts</p>
          <p className="text-sm text-muted-foreground">
            No workouts logged for {format(date, "do MMM yyyy")}.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {MOCK_WORKOUTS.map((workout) => (
            <Card key={workout.id}>
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
          ))}
        </div>
      )}
    </main>
  );
}
