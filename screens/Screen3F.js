import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, View, FlatList } from 'react-native';
import React, { useState} from "react";
import { useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';
import {
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";

import { getFirestore } from "firebase/firestore";
import app from "./firestoreConfig"
import { collection, getDocs, addDoc, getDoc, doc } from "firebase/firestore";

export default function Screen3F({navigation}) {
  const [accelerometerData, setAccelerometerData] = useState({});

      useEffect(() => {
        const subscribe = Accelerometer.addListener(accelerometerData => {
          setAccelerometerData(accelerometerData);
        });

        return () => {
          subscribe.remove();
        };
      }, []);

      const [data, setData] = useState([]);
          const [userId, setUserId] = useState('7dtjsgPYcdEoptEirNYD');
          const db = getFirestore(app);
          useEffect(() => {
              getDocs(collection(db, "users", userId, "historia")).then((querySnapshot) => {
                  const newData = [];
                  querySnapshot.forEach((doc) => {
                      const docData = doc.data();
                      newData.push({
                          id: doc.id,
                          nazwa: docData.nazwa,
                          data: docData.data,
                          obraz: docData.obraz,
                      });
                      //rconsole.log(newData);
                  });
                  setData(newData);

              });
          }, []);
  return (
    <SafeAreaView style={styles.container}>
        <Image style={styles.image} source={require("./log2.png")} />
        { accelerometerData.x > 0.53 ? (
                        navigation.navigate("Profil", {language: "english"})
         ) : null }
        <Text style={styles.mytext}>Historia</Text>
        <TouchableOpacity style={styles.loginBtn} onPress={()=>navigation.navigate("Profil", {language: "english"})}>
                        <Text style={styles.loginText}>&lt;-</Text>
        </TouchableOpacity>
             <FlatList
                             data={data}
                             renderItem={(item) => { console.log(item); return(
                                 <View style={styles.sview}>
                                     <Image style={styles.imagek} source={{uri: item.item.obraz}} />
                                     <View>
                                     <Text style={styles.mytexta}>{item.item.nazwa}</Text>
                                     <Text style={styles.mytexta}>{item.item.data}</Text>
                                     </View>
                                 </View>
                             )}}
                             keyExtractor={item => item.id}
                             style={styles.scrollView}
                         />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  scrollView: {
      backgroundColor: 'white',
      marginHorizontal: 20,
    },
    sview: {
       flexDirection: 'row',
    },

  image: {
    marginBottom: 5,
  },

   imagek: {
      marginBottom: 5,
      height: 145,
      width: 80,
      marginRight: 30,
      marginTop: 1,
    },
    imagek2: {
          marginBottom: 5,
          height: 150,
          width: 100,
          marginLeft: 1,
          marginTop: 1,
    },
  loginText:{
    placeholderTextColor: "#FFFFFF",
  },

  mytext:{
    height: 30,
    marginBottom: 20,
  },

  mytexta:{
      height: 30,
      marginTop: 0,
      marginBottom: 0,
      marginRight: 150,
      textAlign: 'left',
    },
 mytextb:{
       height: 30,
       marginTop: 0,
       marginBottom: 0,
       marginLeft:25,
     },

  loginText:{
    color: "white",
  },

  newtext:{
    marginRight: 220,
    marginBottom:10,
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
    width: "10%",
    borderRadius: 10,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 280,
    backgroundColor: "#808080",
  },
});