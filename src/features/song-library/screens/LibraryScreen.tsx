import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  RootState,
  AppDispatch,
} from "../../../store/store";

import {
  fetchSongs,
  searchSongs,
  clearSearch,
} from "../slice/songLibrarySlice";

import SearchBar from "../components/SearchBar";
import SongCard from "../components/SongCard";

export default function LibraryScreen() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    songs,
    loading,
    error,
  } = useSelector(
    (state: RootState) =>
      state.songLibrary
  );

  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(fetchSongs());
  }, [dispatch]);

  const handleSearch = (text: string) => {
    setQuery(text);

    if (text.trim() === "") {
      dispatch(clearSearch());
      dispatch(fetchSongs());
      return;
    }

    dispatch(searchSongs(text));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Music Library
      </Text>

      <SearchBar
        value={query}
        onChangeText={handleSearch}
      />

      {loading && (
        <ActivityIndicator
          size="large"
          style={styles.loader}
        />
      )}

      {error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      {!loading &&
        !error &&
        songs.length === 0 && (
          <Text style={styles.empty}>
            No songs found.
          </Text>
        )}

      {!loading && (
        <FlatList
          data={songs}
          keyExtractor={(item) =>
            item.id.toString()
          }
          renderItem={({ item }) => (
            <SongCard
              song={item}
              onPress={() => {
                console.log(
                  "Selected song:",
                  item.id
                );
              }}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  loader: {
    marginVertical: 20,
  },

  error: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
  },

  empty: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
  },
});