import { View, Text, SafeAreaView, Modal, TouchableOpacity, StyleSheet, TextInput, Keyboard, FlatList, ScrollView, KeyboardAvoidingView, Image, Pressable, Alert } from 'react-native'
import React, { useLayoutEffect, useState, useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components/native'
import HomeScreen from './HomeScreen';
import { useNavigation } from '@react-navigation/native';
import { doc, collection, addDoc, serverTimestamp, onSnapshot, orderBy, query } from "firebase/firestore"
import { db } from "../firebase"
import { getAuth, signOut } from "firebase/auth";
import { FontAwesome, Foundation } from '@expo/vector-icons';
import { LayoutAnimation, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Camera } from 'expo-camera';
const TInput = styled.TextInput`
border:2px;
width:75%;
color:black;
background-color:white;
padding:10px;
border-radius:10px;

`
const InputView = styled.View`
flex:1;
// background-color:white;
`
const SenderView = styled.View`
align-self: flex-end;
`
const RecieverView = styled.View`
align-self: flex-start;
`

const auth = getAuth();
// console.log(auth.currentUser);
const ChatScreen = ({ route }) => {
  const { data } = route.params;
  // console.log(data.currentUser._tokenResponse.displayName)
  const navigation = useNavigation();
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const flatListRef = useRef(null);
  const inputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
 
  const [modalVisible, setModalVisible] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${data.chatName}`,
      headerBackTitleVisible: false,
      headerTitleAlign: "left",
      
       

    })
  })

  const pickImage = useCallback(async () => {
    setModalVisible(false)
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
    

  }, [uploadImage]);

  const uploadImage = async (uri) => {
    const storage = getStorage();
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `Ansh/${Date.now()}`);
    await uploadBytes(storageRef, blob);
    url = await getDownloadURL(storageRef);
    sendImage();
    // return url;
  };

  const sendImage = useCallback(async () => {
    const messagesRef = collection(db, 'chats', data.id, 'messages');
    await addDoc(messagesRef, {
      timestamp: serverTimestamp(),
      //   message: input.trim(),
      uid: data.currentUser.user.uid,
      name: data.currentUser._tokenResponse.displayName,
      imageUrl: url,
    });

    setInput('');
    setSelectedImage(null);
    setModalVisible(false)
    
    
  }, [data.id, input, selectedImage]);




  const sendMessage = useCallback(() => {
    Keyboard.dismiss();
    const messagesRef = collection(db, "chats", data.id, "messages");
    addDoc(messagesRef, {
      timestamp: serverTimestamp(),
      message: input,
      uid: data.currentUser.user.uid,
      name: data.currentUser._tokenResponse.displayName,
    });
    setInput("");
  }, [data.id, data.currentUser._tokenResponse.displayName, data.currentUser.user.uid, input]);
  // console.log(data);

  useEffect(() => {
    const q = query(
      collection(db, "chats", data.id, "messages"),
      orderBy("timestamp", "asc")
    );
    // console.log(q);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = []
      snapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          data: doc.data()
        })
      });

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMessages(data)
      // console.log(data)
      if (data.length > 0) {
        flatListRef.current.scrollToEnd();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [data.id, flatListRef]);
  // console.log(messages)
  function formatTimestamp(timestamp) {
    if (!timestamp) {
      return '';
    }
    const date = new Date(timestamp.seconds * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  function isUserMessage(message) {

    return message.data.uid === data.currentUser.user.uid;
  }
const openCamera =()=>{
  setModalVisible(false)
  navigation.navigate("CameraScreen",{
    cameras:data,
  })

}
// console.log(data)

  return (

    <KeyboardAvoidingView flex={1} padding={10} >
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Choose an Option</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={pickImage}>
                <Text style={styles.textStyle}>Take Image from Gallery</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={openCamera}
                >
                <Text style={styles.textStyle}>Take Image from Camera</Text>
              </Pressable>
              <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Go Back</Text>
            </Pressable>
            </View>
          </View>
        </Modal>
        
      <View flex={1}  >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          ref={flatListRef}
          renderItem={({ item }) => {
            // console.log(item)
            return (
              <>
                <View style={isUserMessage(item) ? styles.senderView : styles.recieverView}>

                  <Text style={isUserMessage(item) ? styles.senderText : styles.recieverText}>{item.data.name}</Text>

                  {item.data.imageUrl ? (
                    <TouchableOpacity style={styles.imageContainer} onPress={() => navigation.navigate("ImageScreen", {
                      data: item,
                    })}>
                      <Image style={{ height: 200, width: 200, margin: 10 }} source={{ uri: item.data.imageUrl }} />
                      <Text style={{ padding: 2, marginLeft: 'auto' }}>{formatTimestamp(item.data.timestamp)}</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={isUserMessage(item) ? styles.senderText : styles.recieverText}>
                      <Text style={{ padding: 2, fontSize: 15 }}>{item.data.message}</Text>
                      <Text style={{ padding: 2, marginLeft: 'auto' }}>{formatTimestamp(item.data.timestamp)}</Text>
                    </View>
                  )}
                </View>

              </>
            )
          }
          }
        />
      </View>

      <View style={{ backgroundColor: 'white', position: "relative", flexDirection: 'row', padding: 5 }}>
        <TInput value={input}
          ref={inputRef}
          onChangeText={(text) => setInput(text)}
          onSubmitEditing={sendMessage}
          placeholder="Send Message"
          placeholderTextColor="black"
        />
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setModalVisible(true)}>
        <Foundation style={{textAlign:"center" ,marginLeft: 5 }} name="photo" size={30} color="black"  />
        </Pressable>
        <FontAwesome name="send" size={24} color="black" marginVertical={10} marginHorizontal={5} onPress={sendMessage}
        />
      </View>

    </KeyboardAvoidingView>

  )
}

export default ChatScreen

const styles = StyleSheet.create({
  // list:{
  // justifyContent:"space-between",
  // backgroundColor:"red"
  // }
  senderView: {
    // width:"75%",
    borderRadius: 20,
    alignSelf: "flex-end",
    backgroundColor: "skyblue",
    margin: 5,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  recieverView: {
    // width:"70%",
    borderRadius: 20,
    alignSelf: "flex-start",
    backgroundColor: "pink",
    margin: 5
  },
  senderText: {
    fontSize: 18,
    flexDirection: "row",
    maxWidth: 200,
    flexWrap: 'wrap',
    fontWeight: "bold",
    padding: 6,
    marginRight: 5,
  },
  recieverText: {
    fontSize: 18,
    flexDirection: "row",
    flexWrap: 'wrap',
    maxWidth: 200,
    fontWeight: "bold",
    padding: 6,
    marginLeft: 5

  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    // borderRadius: 20,
    margin: 8,

  },
  buttonOpen: {
    // backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    padding:10,
    marginBottom:10
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    color:"red",
    fontWeight:"bold",
    marginBottom: 15,
    textAlign: 'center',
  },
})