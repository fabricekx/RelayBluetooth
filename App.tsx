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
const [poussoir, setPoussoir] = useState(true) // true pour boutton poussoir, false pour boutton bascule
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
            <Text style={styles.heartRateTitleText}>Type de boutton: </Text>
            <TouchableOpacity style={styles.ctaButtonOff} onPress={() => setPoussoir(!poussoir)}><Text>{poussoir === true ? "Poussoir" : "Bascule"}</Text></TouchableOpacity>
            { poussoir ? (<View>
              <TouchableOpacity style={relais1State=== false ? styles.ctaButtonOff : styles.ctaButtonOn} 
              onPressIn={ () => relais1Close(connectedDevice)} onPressOut={() => relais1Open(connectedDevice)}>
                 <Text style={styles.ctaButtonText}>{relais1State === false ? "Relais 1 Off" : "Relais 1 On" }</Text>
                 </TouchableOpacity>
              <TouchableOpacity style={relais2State=== false ? styles.ctaButtonOff : styles.ctaButtonOn}
               onPressIn={ () => relais2Close(connectedDevice) } onPressOut={() => relais2Open(connectedDevice)}>
                 <Text style={styles.ctaButtonText}>{relais2State === false ? "Relais 2 Off" : "Relais 2 On" }</Text>
                 </TouchableOpacity>
            </View>) : (<View>
              <TouchableOpacity style={relais1State=== false ? styles.ctaButtonOff : styles.ctaButtonOn} onPress={relais1State=== false ? () => relais1Close(connectedDevice) : () => relais1Open(connectedDevice)}> <Text style={styles.ctaButtonText}>{relais1State === false ? "Relais 1 Off" : "Relais 1 On" }</Text></TouchableOpacity>
              <TouchableOpacity style={relais2State=== false ? styles.ctaButtonOff : styles.ctaButtonOn} onPress={relais2State=== false ? () => relais2Close(connectedDevice) : () => relais2Open(connectedDevice)}> <Text style={styles.ctaButtonText}>{relais2State === false ? "Relais 2 Off" : "Relais 2 On" }</Text></TouchableOpacity>
            </View> )
            
             }
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
  ctaButtonOn: {
    backgroundColor: "#1ee617",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
    padding :5

  },
  ctaButtonOff: {
    backgroundColor: "#495249",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
    padding :5
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default App;