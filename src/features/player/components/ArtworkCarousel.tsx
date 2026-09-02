import React, { useCallback, useEffect, useRef } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from "react-native";
import { useTheme } from "../../../theme";
import type { Track } from "../../../types";

/**
 * Figma nodes 1:500 / 1:611 / 1:560 differ only by which queue entry is
 * centred, so the three "Playing Now" states are one carousel: the active
 * artwork is 261pt and its neighbours peek at 230pt on either side.
 */
const ACTIVE = 261;
const NEIGHBOUR = 230;
const GAP = 19;
const PAGE = ACTIVE + GAP;

interface Props {
  queue: Track[];
  currentIndex: number;
  /** Fired when a swipe settles on a different track. */
  onIndexChange: (index: number) => void;
}

export const ArtworkCarousel: React.FC<Props> = ({ queue, currentIndex, onIndexChange }) => {
  const { radius, colors } = useTheme();
  const listRef = useRef<FlatList<Track>>(null);
  // Programmatic scrolls also emit onMomentumScrollEnd; without this guard the
  // settle handler would echo the change back as a fresh track selection.
  const isProgrammaticRef = useRef(false);
  const screenWidth = Dimensions.get("window").width;
  const sidePadding = (screenWidth - ACTIVE) / 2;

  // Follow queue changes driven from elsewhere (skip buttons, mini player).
  useEffect(() => {
    if (currentIndex >= 0 && currentIndex < queue.length) {
      isProgrammaticRef.current = true;
      listRef.current?.scrollToOffset({ offset: currentIndex * PAGE, animated: true });
    }
  }, [currentIndex, queue.length]);

  const handleMomentumEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isProgrammaticRef.current) {
        isProgrammaticRef.current = false;
        return;
      }
      const index = Math.round(event.nativeEvent.contentOffset.x / PAGE);
      if (index !== currentIndex && index >= 0 && index < queue.length) {
        onIndexChange(index);
      }
    },
    [currentIndex, onIndexChange, queue.length],
  );

  return (
    <FlatList
      ref={listRef}
      data={queue}
      horizontal
      pagingEnabled={false}
      snapToInterval={PAGE}
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => String(item.id)}
      getItemLayout={(_, index) => ({ length: PAGE, offset: PAGE * index, index })}
      initialScrollIndex={currentIndex > 0 ? currentIndex : 0}
      onMomentumScrollEnd={handleMomentumEnd}
      contentContainerStyle={{ paddingHorizontal: sidePadding }}
      style={styles.list}
      renderItem={({ item, index }) => {
        const isActive = index === currentIndex;
        const edge = isActive ? ACTIVE : NEIGHBOUR;
        return (
          <View style={[styles.page, { width: ACTIVE, marginRight: GAP }]}>
            <Image
              source={{ uri: item.cover_url }}
              style={{
                width: edge,
                height: edge,
                borderRadius: radius.card,
                backgroundColor: colors.surfaceMuted,
              }}
            />
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  list: { flexGrow: 0, height: ACTIVE },
  page: { alignItems: "center", justifyContent: "center", height: ACTIVE },
});
