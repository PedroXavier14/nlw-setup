import { useNavigation } from "@react-navigation/native";
import { Text } from "react-native";

export function HabitsEmpty(){
  const {navigate} = useNavigation();

  return (
    <Text className="text-zinc-400 text-base" >
      No habits to list 😱 {'. '}

      <Text className="text-violet-400 text-base active:text-violet-500" onPress={() => navigate('new')}>
        Create your first habit 🏆.
      </Text>
    </Text>
  );
}