import React, { useEffect, useState, useRef } from "react";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Pressable, StyleSheet, Text, View, Alert } from "react-native";
import { useRouter } from "expo-router";

const CameraScreen = () => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false); 
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  useEffect(() => {
    if (permission && !permission?.granted && permission?.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission?.granted) {
    return <View />;
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const handleBarCodeScanned = ({ type, data }: { type: string, data: string }) => {
    if (scanned) return; 
    setScanned(true);
    Alert.alert(`Code-barres scanné! Type: ${type}, Données: ${data}`);
    
    router.push(`/add?product=${data}`); 
  };

  return (
    <CameraView
      style={styles.camera}
      facing={facing}
      ref={cameraRef}
      onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} 
    >
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </Pressable>
      </View>

      {scanned && (
        <Pressable style={styles.button} onPress={() => setScanned(false)}>
          <Text style={styles.text}>Scanner à nouveau</Text>
        </Pressable>
      )}
    </CameraView>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    width: "100%",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    left: 50,
    right: 50,
    alignItems: "center",
  },
  button: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 50,
    marginBottom: 20,
  },
  text: {
    color: "white",
    fontSize: 18,
  },
});

export default CameraScreen;
