import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DeviceModal from "./deviceConnectionModal";
// import { PulseIndicator } from "./PulseIndicator";
import useBLE from "./useBLE";
import relais from "./relais";

const App = () => {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    // heartRate,
    disconnectFromDevice,
  } = useBLE();
  const {relais1Close, relais1Open, relais2Close, relais2Open, relais1State, relais2State} = relais();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) { console.log("appel de scanForPeripherals")
      scanForPeripherals();
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heartRateTitleWrapper}>
        {connectedDevice ? (
          <>
            {/* <PulseIndicator /> */}
            <Text style={styles.heartRateTitleText}>Test des relais</Text>
            <View>
              <TouchableOpacity style={styles.ctaButton} onPress={relais1State=== false ? () => relais1Close(connectedDevice) : () => relais1Open(connectedDevice)}> <Text>{relais1State === false ? "Relais 1 on" : "Relais 1 off" }</Text></TouchableOpacity>
              <TouchableOpacity style={styles.ctaButton} onPress={relais2State=== false ? () => relais2Close(connectedDevice) : () => relais2Open(connectedDevice)}> <Text>{relais2State === false ? "Relais 2 on" : "Relais 2 off" }</Text></TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={styles.heartRateTitleText}>
            Please Connect to a Bluetoot peripherical
          </Text>
        )}
      </View>
      <TouchableOpacity
        onPress={connectedDevice ? disconnectFromDevice : openModal}
        style={styles.ctaButton}
      >
        <Text style={styles.ctaButtonText}>
          {connectedDevice ? "Disconnect" : "Connect"}
        </Text>
      </TouchableOpacity>
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    color: "black",
  },
  heartRateText: {
    fontSize: 25,
    marginTop: 15,
  },
  ctaButton: {
    backgroundColor: "#FF6060",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default App;