import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons, Feather, MaterialIcons, AntDesign } from '@expo/vector-icons';

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  navigation?: any;
}

export const SideMenu: React.FC<SideMenuProps> = ({ visible, onClose, isDarkMode, onToggleTheme }) => {
  const themeStyles = {
    background: isDarkMode ? '#121212' : '#F8F9FA',
    textColor: isDarkMode ? '#FFF' : '#333',
    iconColor: isDarkMode ? '#BBB' : '#333',
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.menuContainer, { backgroundColor: themeStyles.background }]}>
          {/* Top Actions: Close & Theme Toggle */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={24} color={themeStyles.iconColor} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onToggleTheme}>
              <Ionicons 
                name={isDarkMode ? "sunny-outline" : "moon-outline"} 
                size={22} 
                color={isDarkMode ? "#FFD700" : "#555"} 
              />
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <View style={styles.menuItems}>
            <TouchableOpacity style={styles.item}>
              <Ionicons name="home-outline" size={22} color={themeStyles.iconColor} />
              <Text style={[styles.itemText, { color: themeStyles.textColor }]}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item}>
              <Ionicons name="heart-outline" size={22} color={themeStyles.iconColor} />
              <Text style={[styles.itemText, { color: themeStyles.textColor }]}>Liked Songs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item}>
              <MaterialIcons name="playlist-play" size={24} color={themeStyles.iconColor} />
              <Text style={[styles.itemText, { color: themeStyles.textColor }]}>Playlists</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item}>
              <Feather name="message-square" size={20} color={themeStyles.iconColor} />
              <Text style={[styles.itemText, { color: themeStyles.textColor }]}>Contact Us</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item}>
              <Ionicons name="bulb-outline" size={22} color={themeStyles.iconColor} />
              <Text style={[styles.itemText, { color: themeStyles.textColor }]}>Learn More</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item}>
              <Ionicons name="settings-outline" size={22} color={themeStyles.iconColor} />
              <Text style={[styles.itemText, { color: themeStyles.textColor }]}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.backdropTouch} onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  menuContainer: {
    width: '75%',
    paddingTop: 50,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  menuItems: {
    gap: 25,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  backdropTouch: {
    flex: 1,
  },
});