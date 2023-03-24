import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { Back } from "../components/Back";
import { Checkbox } from "../components/Checkbox";
import { Loading } from "../components/Loading";
import { ProgressBar } from "../components/ProgressBar";
import { HabitsEmpty } from "../components/HabitsEmpty";
import { api } from "../lib/axios";
import { generateProgressPercentage } from '../utils/generateProgressPercentage';
import clsx from "clsx";

interface HabitParams {
  date: string;
}

interface DayInfoProps {
  completedHabits: string[];
  possibleHabits: {
    id: string;
    title: string;
  }[]
}


export function Habit() {
  const [isLoading, setIsLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null); 
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);

  const route = useRoute();
  const { date } = route.params as HabitParams;

  const parsedDate = dayjs(date);
  const isDateInPast = parsedDate.endOf('day').isBefore(new Date());
  const dayOfWeek = parsedDate.format("dddd");
  const dayAndMount = parsedDate.format("DD/MM");

  const habitsProgress = dayInfo?.possibleHabits.length ? 
  generateProgressPercentage(dayInfo.possibleHabits.length, completedHabits.length) : 0;

  const fetchHabits = async () => {
    try {
      setIsLoading(true);

      const response = await api.get('/day', {params: {date}});
      setDayInfo(response.data);
      setCompletedHabits(response.data.completedHabits);
      setIsLoading(false);
    }catch(error){
      setIsLoading(false);
      console.log(error);
      Alert.alert("Error", "Error fetching habits information");
    }
  } 

  const handleToggleHabit = async (habitId: string) => {
    try {
      await api.patch(`/habits/${habitId}/toggle`);
      if(completedHabits.includes(habitId)){
        setCompletedHabits(prevState => prevState.filter(habit => habit !== habitId))
      }else {
        setCompletedHabits(prevState => [...prevState, habitId]);
      }
    }catch(error) {
      console.log(error);
      Alert.alert("Error", "Error updating habit status");
    }
   
  }

  useEffect(() => {
    fetchHabits()
  }, [])
  
  if(isLoading){
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Back />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>

        <Text className="text-white font-extrabold text-3xl">
          {dayAndMount}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View className={clsx("mt-6", {
          ["opacity-50"]: isDateInPast
        })}>

          {
            dayInfo?.possibleHabits ?
              dayInfo.possibleHabits.map(habit => 
                <Checkbox 
                  key={habit.id}
                  title={habit.title}
                  checked={completedHabits.includes(habit.id)}
                  disabled={isDateInPast}
                  onPress={() => handleToggleHabit(habit.id)}
                />
              )
              : <HabitsEmpty />
          }

          {
            isDateInPast && (
              <Text className="text-white mt-10 text-center">
                  You cannot edit habits in the past
              </Text>
            )
          }

        </View>
      </ScrollView>
    </View>
  );
}
