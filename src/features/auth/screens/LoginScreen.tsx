import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../../store/store";

import { LoginScreen } from "../authSlice";

export const LoginScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogin = async () => {
    if (!email || !password) {
      return;
    }

    await dispatch(
      login({
        email,
        password,
      })
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>

      <Text style={styles.label}>Email</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            Login
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },

  button: {
    height: 50,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  error: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
});


export const login = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  {
    rejectValue: string;
  }
>(
  "auth/login",

  async (
    credentials,
    { rejectWithValue }
  ) => {
    try {
      const response =
        await loginUser(credentials);

      await saveTokens(
        response.access,
        response.refresh
      );

      return response;

    } catch (error: any) {

      if (error.response?.data) {
        const backendError =
          error.response.data;

        if (backendError.detail) {
          return rejectWithValue(
            backendError.detail
          );
        }

        if (backendError.message) {
          return rejectWithValue(
            backendError.message
          );
        }
      }

      return rejectWithValue(
        "Unable to connect to the server."
      );
    }
  }
);

extraReducers: (builder) => {
  builder

    // LOGIN STARTED
    .addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    })

    // LOGIN SUCCESS
    .addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;

      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
    })

    // LOGIN FAILED
    .addCase(login.rejected, (state, action) => {
      state.loading = false;

      state.error =
        action.payload ??
        "Login failed.";
    });
}