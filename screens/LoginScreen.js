import React,{useLayoutEffect,useState,useEffect}from "react";
import {TextInput, StyleSheet,Text, View ,TouchableOpacity ,Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from './../firebase';
import { SafeAreaView } from "react-native-safe-area-context";
const saveUserData = async (userData) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    // console.log(userData);
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

export const LoginScreen =()=>
{
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const navigation=useNavigation();
    const [user,setUser]=useState(null);
    const[isLoading,setIsLoading]=useState(false);
    const[error,setError]=useState('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    useEffect(() => {
      
      getUserData().then((userData) => {
        if (userData) {
          setUser(userData);
          navigation.replace("Home")
        }
      });
    }, []);
    // console.log(user);
    
    const onLogin=(email,password)=>{
      if (!email || !emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }
    // Password validation
    if (!password || password.length < 6) {
        alert("Password should be at least 6 characters long.");
        return;
    }
       
      signInWithEmailAndPassword(auth,email,password).then((userData)=>{
       
          setIsLoading(false);
          saveUserData(userData);
          setUser(userData);
          navigation.navigate('Home')
      }).catch((err)=>{
        setIsLoading(false);
        setError("Invalid Credentials");
        console.log(err);
      })
  }
    useLayoutEffect(()=> {
        navigation.setOptions({
            headerShown:false,
        });

    },[]);
  
    return(
     
    <SafeAreaView style={styles.container}>

      <Image
      source={require("../assets/ChatApp.png")}
      style={styles.image}
      />
     
      <Text style={styles.title}>Login</Text>
        {error.length>0 && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Email/Username"
        value={email}
        textContentType="emailAddress"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(t) => setEmail(t)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        textContentType="password"
        secureTextEntry
        autoCapitalize="none"
        onChangeText={(p) => setPassword(p)}
      />
      <TouchableOpacity style={styles.button} 
      onPress={() => onLogin(email,password)} >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

       <TouchableOpacity onPress={()=>navigation.navigate("Register")}>
      <Text style={{color:'black',fontSize:16, marginTop:5}}>Don't Have an account? Click here to register </Text>
      </TouchableOpacity>
    
      </SafeAreaView>
    );
}
const styles = StyleSheet.create({
  
    container: {
      width: "100%",
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    title: {
      fontSize: 40,
      fontWeight: 'bold',
      marginBottom: 30,
      color:'darkgreen'
    },
    input: {
      width: '80%',
      height: 40,
      backgroundColor: '#FFF',
      borderRadius: 5,
      borderWidth: 2,
      borderColor: 'darkgreen',
      marginBottom: 20,
      paddingLeft: 10,
    },
    button: {
      width: '80%',
      height: 40,
      backgroundColor: 'darkgreen',
      borderRadius: 5,
      alignItems: 'center',
      color:'navy',
      justifyContent: 'center',
    },
    buttonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    error:{
        color: 'red',
        fontSize: 20,
        marginBottom: 12,
    },
    image:{
      height:200,
      width:200
    }
    
    })
    