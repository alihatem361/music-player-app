import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";

/**
 * The Playlists design (node 2:728) sits under a soft pink bloom — a 424x370
 * ellipse bleeding off both edges. Rendered from a pre-baked radial PNG so the
 * falloff stays smooth without adding a gradient dependency.
 */
const FRAME_WIDTH = 375;
const GLOW_WIDTH = 424;
const GLOW_HEIGHT = 370;
const GLOW_TOP = -21;

const glow = require("../../assets/figma/pink-glow.png");

export const GlowBackdrop: React.FC = () => {
  const screenWidth = Dimensions.get("window").width;
  const scale = screenWidth / FRAME_WIDTH;
  const width = GLOW_WIDTH * scale;

  return (
    <View pointerEvents="none" style={styles.root}>
      <Image
        source={glow}
        resizeMode="stretch"
        style={{
          position: "absolute",
          width,
          height: GLOW_HEIGHT * scale,
          top: GLOW_TOP * scale,
          left: (screenWidth - width) / 2,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
});
