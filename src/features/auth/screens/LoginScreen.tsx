import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppDispatch } from "../../../app/hooks";
import { ScreenContainer } from "../../../components";
import { setAuthError, setCredentials } from "../authSlice";
import { toApiError } from "../../../services/api";
import { useTheme } from "../../../theme";
import type { AuthStackParamList } from "../../../navigation/types";
import { login, register } from "../services/authService";
interface Props {
  registerMode?: boolean;
}
export const LoginScreen: React.FC<Props> = ({ registerMode = false }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (registerMode && password !== confirm) {
      dispatch(setAuthError({ message: "Passwords do not match." }));
      return;
    }
    setLoading(true);
    try {
      if (registerMode) {
        await register(email, password);
        navigation.goBack();
      } else {
        const tokens = await login(email, password);
        dispatch(setCredentials({ tokens }));
      }
    } catch (error) {
      dispatch(setAuthError(toApiError(error)));
    } finally {
      setLoading(false);
    }
  };

  const input = (
    label: string,
    value: string,
    setter: (text: string) => void,
    secure = false,
  ) => (
    <View>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View
        style={[
          styles.inputWrap,
          { backgroundColor: colors.input, borderColor: colors.primary },
        ]}
      >
        <Ionicons
          name={secure ? "lock-closed-outline" : "person"}
          size={20}
          color="#B6AAAC"
        />
        <TextInput
          value={value}
          onChangeText={setter}
          autoCapitalize="none"
          secureTextEntry={secure}
          keyboardType={secure ? "default" : "email-address"}
          placeholder={label === "Email" ? "Email Address" : label}
          placeholderTextColor="#B6AAAC"
          style={[styles.input, { color: colors.text }]}
        />
      </View>
    </View>
  );
  return (
    <ScreenContainer>
      <View style={styles.root}>
        <View style={styles.heading}>
          <Text style={[styles.welcome, { color: colors.text }]}>
            {registerMode ? "Welcome" : "Welcome Back"}
          </Text>
          <Text style={[styles.tagline, { color: colors.textSoft }]}>
            Where Sound Comes Alive
          </Text>
        </View>
        <View style={styles.formTitle}>
          <View style={[styles.iconCircle, { backgroundColor: colors.input }]}>
            <Ionicons name="log-in-outline" color={colors.primary} size={23} />
          </View>
          <View>
            <Text style={[styles.formHeading, { color: colors.text }]}>
              {registerMode ? "Sign Up" : "Log In"}
            </Text>
            <Text style={[styles.formSubtitle, { color: colors.textSoft }]}>
              Enter Your Credentials to continue
            </Text>
          </View>
        </View>
        <View style={[styles.rule, { backgroundColor: colors.text }]} />
        {input("Email", email, setEmail)}
        {input("Password", password, setPassword, true)}
        {registerMode && input("Confirm Password", confirm, setConfirm, true)}
        <Pressable
          disabled={loading}
          onPress={submit}
          style={[styles.submit, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.submitText}>
            {loading ? "Please wait…" : "Let's Start"}
          </Text>
          <Ionicons
            name="play"
            color="#fff"
            size={18}
            style={styles.submitIcon}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            if (registerMode) navigation.navigate("Login");
            else navigation.navigate("Register");
          }}
        >
          <Text style={[styles.switchText, { color: colors.textSoft }]}>
            {registerMode
              ? "Already have an account? Log In"
              : "New here? Sign Up"}
          </Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
};
const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 13 },
  heading: { alignItems: "center", marginTop: 36 },
  welcome: { fontSize: 29, fontWeight: "700" },
  tagline: { fontSize: 16, fontWeight: "600" },
  formTitle: {
    marginTop: 68,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  formHeading: { fontSize: 27, fontWeight: "700" },
  formSubtitle: { fontSize: 12, fontWeight: "600" },
  rule: { height: StyleSheet.hairlineWidth, marginTop: 31, marginBottom: 22 },
  label: { marginLeft: 16, fontSize: 16, fontWeight: "700", marginBottom: 10 },
  inputWrap: {
    height: 40,
    borderWidth: 2,
    borderRadius: 11,
    marginHorizontal: 15,
    marginBottom: 15,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  input: { flex: 1, fontSize: 16, fontWeight: "600" },
  submit: {
    height: 52,
    borderRadius: 14,
    marginTop: "auto",
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: { color: "#fff", fontSize: 20, fontWeight: "700" },
  submitIcon: { position: "absolute", right: 24 },
  switchText: { textAlign: "center", fontSize: 13, paddingBottom: 12 },
});
