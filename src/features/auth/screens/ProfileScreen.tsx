import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Button, ErrorView, Loader, ScreenContainer, ScreenHeader } from "../../../components";
import { useTheme } from "../../../theme";
import type { User } from "../../../types";
import { fetchMe, logout } from "../authSlice";

const AVATAR = 96;

const initials = (user: User | null): string => {
  const source = user?.username || user?.email || "";
  return source.trim().charAt(0).toUpperCase() || "?";
};

export const ProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { user, userStatus, userError } = useAppSelector((state) => state.auth);
  const { colors, radius, spacing, typography } = useTheme();
  const [imageFailed, setImageFailed] = useState(false);

  const confirmLogout = () => {
    Alert.alert("Log out", "You'll need to sign in again to keep listening.", [
      { text: "Cancel", style: "cancel" },
      // RootNavigator swaps to the auth stack as soon as the tokens clear.
      { text: "Log out", style: "destructive", onPress: () => void dispatch(logout()) },
    ]);
  };

  const showAvatar = Boolean(user?.avatar_url) && !imageFailed;

  const body = () => {
    if (userStatus === "loading" && !user) {
      return <Loader label="Loading your profile…" />;
    }
    if (userStatus === "failed" && !user) {
      // Still offer Log out — a broken /auth/me/ must not strand the user here.
      return (
        <ErrorView
          message={userError ?? "Unable to load your profile."}
          onRetry={() => void dispatch(fetchMe())}
        />
      );
    }
    return (
      <View style={styles.details}>
        {showAvatar && user?.avatar_url ? (
          <Image
            source={{ uri: user.avatar_url }}
            onError={() => setImageFailed(true)}
            style={styles.avatar}
          />
        ) : (
          <View
            style={[
              styles.avatar,
              styles.avatarFallback,
              { backgroundColor: colors.surfaceMuted },
            ]}
          >
            <Text style={[typography.screenTitle, { color: colors.textMuted }]}>
              {initials(user)}
            </Text>
          </View>
        )}
        <Text style={[typography.screenTitle, { color: colors.text, marginTop: spacing.lg }]}>
          {user?.username ?? "Your account"}
        </Text>
        <Text style={[typography.body, { color: colors.textMuted, marginTop: spacing.xs }]}>
          {user?.email ?? ""}
        </Text>
      </View>
    );
  };

  return (
    <ScreenContainer padded={false}>
      <ScreenHeader onBack={() => navigation.navigate("Main", { screen: "Discover" } as never)} />
      <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
      {body()}
      <View style={[styles.footer, { padding: spacing.lg }]}>
        <Button
          title="Log out"
          variant="secondary"
          onPress={confirmLogout}
          style={{ borderRadius: radius.pill }}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: { marginTop: 36, marginLeft: 30, fontSize: 26, fontWeight: "700" },
  details: { flex: 1, alignItems: "center", paddingTop: 48 },
  avatar: { width: AVATAR, height: AVATAR, borderRadius: AVATAR / 2 },
  avatarFallback: { alignItems: "center", justifyContent: "center" },
  footer: { marginTop: "auto" },
});
