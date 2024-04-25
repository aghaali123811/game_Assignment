import { StatusBar } from "expo-status-bar";
import { useMemo, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import materials from "./gameData.json";

export default function App() {
  const video = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reload, setReload] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const renderData = useMemo(() => {
    const { strong_materials, weak_materials } = materials;

    // Randomly select two strong materials
    const randomStrongMaterials = [];
    while (randomStrongMaterials.length < 2) {
      const randomIndex = Math.floor(Math.random() * strong_materials.length);
      const randomStrongMaterial = strong_materials[randomIndex];
      if (
        !randomStrongMaterials.some(
          (material) => material?.name === randomStrongMaterial?.name
        )
      ) {
        randomStrongMaterials.push(randomStrongMaterial);
      }
    }

    // Randomly select two weak materials
    const randomWeakMaterials = [];
    while (randomWeakMaterials.length < 2) {
      const randomIndex = Math.floor(Math.random() * weak_materials.length);
      const randomWeakMaterial = weak_materials[randomIndex];
      if (
        !randomWeakMaterials.some(
          (material) => material?.name === randomWeakMaterial?.name
        )
      ) {
        randomWeakMaterials.push(randomWeakMaterial);
      }
    }

    return [...randomStrongMaterials, ...randomWeakMaterials];
  }, [materials, reload]);
  return (
    <ImageBackground
      source={require("./background.png")}
      style={styles.container}
    >
      <StatusBar style="auto" />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Pick a strong compound</Text>
      </View>

      <FlatList
        data={renderData}
        style={styles.flatlist}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={[
                styles.buttons,
                {
                  backgroundColor:
                    selectedItem?.name === item?.name ? "orange" : "#0D7B60",
                },
              ]}
              onPress={() => {
                setSelectedItem(item);
                setIsModalVisible(true);
              }}
            >
              <Text style={styles.text}>{item?.name}</Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index) => index}
        showsVerticalScrollIndicator={false}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setIsModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeBtnContainer}
              onPress={() => {
                setIsModalVisible(!isModalVisible);
                setSelectedItem(null);
                setReload(!reload);
              }}
            >
              <FontAwesome name="close" size={22} />
            </TouchableOpacity>

            <View style={styles.container2}>
              <Text style={styles.subTitle}>
                Let's see the {selectedItem?.name} compound
              </Text>
            </View>
            <Video
              ref={video}
              style={styles.video}
              source={require("./placeholderVideo.mp4")}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
              onPlaybackStatusUpdate={(status) => console.log(status)}
            />
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
    justifyContent: "center",
    marginTop: 6,
    color: "#78252D",
  },
  flatlist: { width: "100%", marginTop: "90%" },
  buttons: {
    width: "80%",
    height: 50,
    alignSelf: "center",
    marginTop: 10,
    borderRadius: 6,
  },
  text: {
    color: "#fff",
    alignSelf: "center",
    justifyContent: "center",
    textAlign: "center",
    marginTop: 11,
    fontSize: 16,
    fontWeight: "bold",
  },
  // Modal styles
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#E4FCFD",
    borderRadius: 20,
    padding: 25,
    paddingHorizontal: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 40,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  titleContainer: {
    width: "80%",
    borderRadius: 5,
    opacity: 0.8,
    paddingHorizontal: 10,
    height: 50,
    backgroundColor: "#F7B784",
    alignSelf: "center",
    marginTop: "30%",
    marginBottom: 20,
  },
  closeBtnContainer: {
    position: "absolute",
    top: 10,
    right: 5,
    width: 25,
    height: 25,
  },
  container2: {
    width: "60%",
    minHeight: 28,
    backgroundColor: "#F4DECC",
    zIndex: 1000,
    borderRadius: 6,
    position: "absolute",
    top: 40,
  },
  subTitle: {
    fontSize: 14,
    width: "100%",
    color: "#78252D",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 3,
  },
  video: { width: 300, height: 300 },
});
