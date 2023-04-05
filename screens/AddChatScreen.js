import { View, Text ,TextInput ,SafeAreaView ,StyleSheet} from 'react-native'
import React,{useState ,useLayoutEffect} from 'react'
import { Button } from 'react-native'
import {db} from "../firebase"
import { collection , addDoc, serverTimestamp } from "firebase/firestore";
const AddChatScreen = ({navigation}) => {
    const[input , setInput] = useState("")

   

    const createChat =  async()=>{
        try {
            const docRef = await addDoc(collection(db, "chats"), {
              chatName : input,
              timestamp: serverTimestamp(),

            }).then(()=>{
                navigation.goBack();
            })
          } catch (e) {
            console.error("Error adding document: ", e);
          }
    }
  return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Add a new Chat</Text>
        <View>
       <TextInput style={styles.input}
         placeholder='Add a chat name'
         value={input} onChangeText={(text)=>setInput(text)}
         onSubmitEditing={createChat}
      />
      <View style={{top:30 ,margin:10}}>
      <Button 
      style={styles.button}
      title="Add"
      color="darkgreen"
      onPress={createChat}
      />
      </View>
      </View>
    </SafeAreaView>
  )
}

export default AddChatScreen

const styles = StyleSheet.create({
    title:{
        top:20,
        textAlign:"center",
        fontSize:20,
        fontWeight:"bold",
        color:"darkgreen"
    },
    container:{
        

    },
input:{
    top:30,
    height:50,
    margin:10,
    backgroundColor:"white",
    marginLeft:10,
    padding:10,
    borderWidth:2,
    borderColor:"darkgreen"
},
button:{
    marginTop:20,
    color:"darkgreen"
}
})