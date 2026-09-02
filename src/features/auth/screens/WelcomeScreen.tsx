import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScreenContainer } from "../../../components";
import { useTheme } from "../../../theme";
import type { AuthStackParamList } from "../../../navigation/types";
const art = require("../../../../assets/figma/onboarding.png");
type Props = NativeStackScreenProps<AuthStackParamList, "Welcome">;
export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  return (
    <ScreenContainer padded={false}>
      <View style={styles.root}>
        <Image source={art} resizeMode="contain" style={styles.art} />
        <View style={styles.copy}>
          <Text style={[styles.title, { color: colors.text }]}>
            Music Player App
          </Text>
          <Text style={[styles.description, { color: colors.textSoft }]}>
            A sleek, modern music app that brings your favorite songs, artists,
            and playlists together
          </Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate("Login")}
          style={[styles.button, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.buttonText}>Let's Start</Text>
          <Ionicons name="play" size={19} color="#FFFFFF" style={styles.buttonIcon} />
        </Pressable>
      </View>
    </ScreenContainer>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 22,
    paddingBottom: 74,
  },
  art: { marginTop: 56, height: 380, width: "100%" },
  copy: { alignItems: "center" },
  title: { fontSize: 24, fontWeight: "700" },
  description: {
    maxWidth: 285,
    marginTop: 25,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 18,
  },
  button: {
    marginTop: "auto",
    height: 52,
    width: "100%",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#FFFFFF", fontSize: 20, fontWeight: "700" },
  buttonIcon: { position: "absolute", right: 24 },
});
