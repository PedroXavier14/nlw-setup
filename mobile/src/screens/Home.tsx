import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { View, Text, ScrollView, Alert } from "react-native";
import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Header } from "../components/Header";
import { generateDatesFromYearBeginning } from "../utils/generateDatesFromYearBeginning";
import {api} from "../lib/axios";
import { useState, useCallback } from "react";
import { Loading } from "../components/Loading";
import dayjs from "dayjs";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const datesFromYearStart = generateDatesFromYearBeginning();
const minimunSummaryDatesSizes = 18 * 5;
const amountOfDaysToFill = minimunSummaryDatesSizes - datesFromYearStart.length;

interface ISummary {
  id: string;
  date: string;
  amount: number;
  completed: number;
}

export function Home() {
  const [loading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<ISummary[] | null>([]);
  const { navigate } = useNavigation();

  async function fetchSummary(){
    try {
      setIsLoading(true);
      const response = await api.get('/summary');
      setSummary(response.data);
    }catch(error){
      Alert.alert('Error', 'Error fetching habbit summary');
      console.log(error);
    } finally{
      setIsLoading(false);
    }
  }

  useFocusEffect(useCallback(() => {
    fetchSummary()
  }, []));

  if(loading){
    return <Loading />
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-row mt-6 mb-2">
          {weekDays.map((weekDay, index) => (
            <Text
              key={`${weekDay}-${index}`}
              className="text-zinc-400 text-xl font-bold text-center mx-1"
              style={{ width: DAY_SIZE }}
            >
              {weekDay}
            </Text>
          ))}
        </View>

        {
          summary && 
            <View className="flex-row flex-wrap">
            <>
              {
                datesFromYearStart.map((date) => {
                  const dayWithHabits = summary.find((day) => {
                    return dayjs(date).isSame(day.date, 'day');
                  })

                  return (<HabitDay
                    key={date.toISOString()}
                    date={date}
                    amount={dayWithHabits?.amount}
                    completed={dayWithHabits?.completed}
                    onPress={() =>
                      navigate("habit", { date: date.toISOString() })
                    }
                  />)
                })
              }

              {amountOfDaysToFill > 0 &&
                Array.from({ length: amountOfDaysToFill }).map((_, index) => {
                  <View
                    key={index}
                    className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                    style={{ width: DAY_SIZE, height: DAY_SIZE }}
                  />;
                })}
            </>
          </View>
        }
        
      </ScrollView>
    </View>
  );
}
