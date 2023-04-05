import { View, Text, Button, StyleSheet, TouchableOpacity ,ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'

import { onAuthStateChanged, signOut } from 'firebase/auth'
// import { auth } from '../firebase'
import { getAuth } from "firebase/auth";
import { collection, getDocs, doc, onSnapshot, query, getDoc , } from "firebase/firestore";
import { db } from "../firebase"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListItem } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
const auth = getAuth();
const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem('userData');
    //   console.log(userData);
  } catch (error) {
    console.log(error);
  }
};

const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    if (userData !== null) {
      return JSON.parse(userData);
    }
  } catch (error) {
    console.log(error);
  }
};
const HomeScreen = ({ navigation }) => {
  const [chats, setChats] = useState([])
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(()=>{
    const unsubscribe = onSnapshot(
      collection(db, "chats"), 
      (snapshot) => {
        setChats(
          snapshot.docs.map((doc)=>({
            id: doc.id,
            data: doc.data(),
          }))
        )
      });

      return unsubscribe;

},[]);
useEffect(() => {
      
  getUserData().then((userData) => {
    if (userData) {
      setCurrentUser(userData);
    }
  });
}, []);

// useEffect(() => {
//   const unsubscribe = onAuthStateChanged(auth, (user) => {
//     setCurrentUser(user);
//   });

//   return unsubscribe;
// }, []);
console.log(currentUser);

  const onSignOut = () => {
    signOut(auth).then(
      clearUserData(),
      navigation.replace('Login')
    )
  }


  return (
    <>
    <SafeAreaView style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: "white" ,padding:10 }}>
          <Text style={styles.text}>Chats</Text>
        <View style={{ marginRight: 10 ,flexDirection:"row" ,padding:10 ,textAlign:"center" }}>
          <TouchableOpacity onPress={() => navigation.navigate("AddChat")} activeOpacity={0.5} style={{marginRight:10}}>
            <Entypo name="pencil" size={24} color="black" />
          </TouchableOpacity>
            <FontAwesome name="power-off"onPress={onSignOut} size={24} color="black" style={{marginLeft:10}}/>
          
        </View>
        {/* <Button title="Signout" color="red" size={20} onPress={onSignOut}>Signout</Button> */}
        {/* <View style={{justifyContent: "center" ,backgroundColor:"black"}}>
          {currentUser && <Text>{currentUser.email}</Text>}
        </View> */}

    
    </SafeAreaView>
  
     <ScrollView>
      {chats.map((item)=>{
        return(
      <TouchableOpacity onPress={()=>navigation.navigate("ChatScreen",{

        data:{
          id:item.id,
          chatName :item.data.chatName,
          currentUser,
        }

      })}>
        
      <ListItem style={{ borderColor:"darkgreen"}} bottomDivider>
      <FontAwesome5 name="smile-beam" size={24} color="black"  />
      <ListItem.Content >
        <ListItem.Title key={item.id}>{item.data.chatName}</ListItem.Title>
        {/* <ListItem.Subtitle>CEO, Example.com</ListItem.Subtitle> */}
      </ListItem.Content>
      </ListItem>
     
      </TouchableOpacity>
        )
      })}
    </ScrollView>
  
   </>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  button: {
    color: 'white',
    height: 40,
    // marginLeft: 120,
    marginBottom: 20,
    // marginRight: 10,
    flexDirection: 'row'
  },
  text: {
    top:10,
    textAlign: "center",
    fontWeight: "bold",
    color: "darkgreen",
    fontSize: 18
  },
  chatView:{
    margin:"auto",
    backgroundColor:"white"
  }
})