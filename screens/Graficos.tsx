import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

const Graficos = ({ navigation }) => {
  const [userId, setUserId] = useState("");
  const [otherInput, setOtherInput] = useState(""); // Si necesitas otro campo de entrada

  const handleGenerateGraph = () => {
    console.log("Generando gráfico para el ID:", userId);
    // Aquí puedes navegar a otra pantalla o generar el gráfico directamente
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ingrese ID de usuario"
          value={userId}
          onChangeText={setUserId}
        />
        <TextInput
          style={styles.input}
          placeholder="Otro parámetro"
          value={otherInput}
          onChangeText={setOtherInput}
        />
      </View>
      <Button title="Generar Gráfico" onPress={handleGenerateGraph} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginHorizontal: 5,
    paddingHorizontal: 10,
  },
});

export default Graficos;
