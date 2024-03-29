import { StatusBar } from 'expo-status-bar';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import app from "../firestoreConfig";
import LoggedUserManager from "../LoggedUserManager";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const db = getFirestore(app);
  const auth = getAuth();

  const instance = LoggedUserManager.getInstance();

  const updateInputVal = (val, prop) => {
    if (prop === 'email') setEmail(val);
    else setPassword(val);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        instance.setEmail(user.email);
        searchUser(user.email);
      }
    })

    return unsubscribe;
  }, []);
  const searchUser = async (email) => {
    const qRef = query(collection(db, "users"), where("email", "==", email));
    const qSnap = await getDocs(qRef);
    qSnap.forEach((doc) => {
      console.log(doc.id);
      const identyfikator = doc.id;
      instance.setId(identyfikator);
      const cosik = instance.getId();
      console.log(cosik);
    });
  }

  const userLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log("Signed in: ", user.email);
        navigation.navigate("Books", {
          screen: "Popularne"
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });

  }

  if (isLoading) {
    return (
      <View style={styles.preloader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("../assets/log2.png")} />
      <Text style={styles.mytext}>Witamy ponownie</Text>
      <StatusBar style="auto" />
      <Text style={styles.newtext}>Email</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Wprowadź swój email"
          value={email}
          onChangeText={(val) => updateInputVal(val, 'email')}
          placeholderTextColor="#acaebd"
        //onChangeText={(login) => setLogin(login)}
        />
      </View>
      <Text style={styles.newtext}>Hasło</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Wprowadź swoje hasło"
          placeholderTextColor="#acaebd"
          value={password}
          onChangeText={(val) => updateInputVal(val, 'password')}
          maxLength={15}
          secureTextEntry={true}
        //onChangeText={(password) => setPassword(password)}
        />
      </View>

      <TouchableOpacity style={styles.loginBtn} onPress={() => userLogin()}>
        <Text style={styles.loginText}>Zaloguj</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Rejestracja", { language: "english" })}>
        <Text style={styles.forgot_button}>Rejestracja</Text>
      </TouchableOpacity>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    marginBottom: 85,

  },

  loginText: {
    placeholderTextColor: "#FFFFFF",
    color: "white",
  },

  mytext: {
    height: 30,
    marginBottom: 20,
  },

  newtext: {
    marginRight: 220,
    marginBottom: 10,
  },

  inputView: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    width: "70%",
    height: 40,
    marginBottom: 20,
    alignItems: "flex-start",
    borderColor: "#d4d5d9",
    borderWidth: 1,
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 10,
  },

  forgot_button: {
    height: 30,
    marginBottom: 30,
    marginLeft: 180,
    marginTop: 10,
  },

  loginBtn: {
    width: "70%",
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#1D33DE",
  },
});