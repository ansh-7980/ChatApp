import React, { useState, useEffect ,useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { doc, collection, addDoc, serverTimestamp, onSnapshot, orderBy, query } from "firebase/firestore"
import { db } from "../firebase"
import { getAuth, signOut } from "firebase/auth";
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { AntDesign } from '@expo/vector-icons';

export default function App({route ,navigation}) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const {cameras}= route.params;
//   console.log(cameras)
useEffect(() => {
    (async () => {
      const  cameraStatus  = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
      const  galleryStatus  = await   ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted')
})();
  }, []);
const takePicture = async () => {
    if(camera){
      const data = await camera.takePictureAsync(null);
    //   console.log(data.uri)
      setSelectedImage(data.uri)
    //   uploadImage(data.uri)
      
    }
  }
  const pickImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setSelectedImage(result.uri);
        uploadImage(result.uri);
      }
      if (hasCameraPermission === null || hasGalleryPermission === false) {
        return <View />;
    }
    if (hasCameraPermission === false || hasGalleryPermission === false) {
        return <Text>No access to camera</Text>;
    }
    } catch (error) {
      console.log(error);
    }
    

  }, [uploadImage]);

  const uploadImage = async () => {
    navigation.goBack()
    const storage = getStorage();
    const response = await fetch(selectedImage);
    const blob = await response.blob();
    const storageRef = ref(storage, `Ansh/${Date.now()}`);
    await uploadBytes(storageRef, blob);
    url = await getDownloadURL(storageRef);
    sendImage();
    // return url;

  };

  const sendImage = useCallback(async () => {
    const messagesRef = collection(db, 'chats', cameras.id, 'messages');
    await addDoc(messagesRef, {
      timestamp: serverTimestamp(),
      //   message: input.trim(),
      uid: cameras.currentUser.user.uid,
      name: cameras.currentUser._tokenResponse.displayName,
      imageUrl: url,
    });

    // setInput('');
    setSelectedImage(null);
    // setModalVisible(false)
    
    
  }, [cameras.id, selectedImage]);

return (
   
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera 
          ref={ref => setCamera(ref)} 
          style={styles.camera} 
          type={type} 
          ratio={'1:1'} 
        />
      </View>
      
      <Button
        style={styles.button}
        title="Flip Image"
        onPress={() => {
          setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          );
        }}>
      </Button>
      
      <Button title="Take Picture" onPress={() => takePicture()} />
      {/* <Button title="Pick an Image From Gallery" onPress={() => pickImage()} /> */}
      {selectedImage && 
      <View style={{flex:1}}>
          
          <Image source={{uri: selectedImage}} style={{flex:1 }}  />
          <TouchableOpacity style={{position:"absolute" ,right:10,top:7 ,backgroundColor:"black" ,color:"white" ,height:28}}>

          <AntDesign name="checkcircle" size={20} color="white"  onPress={uploadImage}  >Send Image</AntDesign>
          </TouchableOpacity>
      </View>
      }
      </View>
    
  );
  
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center'
  },
  camera: {
    flex: 1,
    aspectRatio: 1,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  button: {
    flex: 1,
  },
});

