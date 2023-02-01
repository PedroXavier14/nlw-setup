interface HabitProps {
  completed?: number;
}

export function Habit({ completed }: HabitProps) {
  return <p className="bg-slate-500">Habit {completed}</p>;
}
