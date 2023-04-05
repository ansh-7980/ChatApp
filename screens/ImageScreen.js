import { View, Text ,Image } from 'react-native'
import React ,{useLayoutEffect} from 'react'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';




const ImageScreen = ({route}) => {
    const navigation = useNavigation();
    const {data} = route.params;
    // console.log(data.data.imageUrl)
    useLayoutEffect(()=>{
        navigation.setOptions({
            title:"Image Viewer"
        })
    })
  return (
    <SafeAreaView style={{justifyContent:"center"}}>
      <Image 
      source={{uri:`${data.data.imageUrl}`}}
      style={{height:200,width:250 ,margin:"auto" ,marginLeft:50}}
      ></Image>
    </SafeAreaView>
  )
}

export default ImageScreen