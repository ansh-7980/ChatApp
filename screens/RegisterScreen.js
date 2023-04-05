import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged ,updateProfile } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { addDoc, collection ,setDoc ,doc } from 'firebase/firestore';
import {db} from "../firebase"
const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')
    const navigation = useNavigation();

    const [isLoading, setIsLoading] = useState(false);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    const auth = getAuth();

   
    const handleRegistration = (email, password) => {
        // try {
        //     const res = await createUserWithEmailAndPassword(auth, email, password).then((userCredentials)=>{
        //         console.log(userCredentials.name);
        //         updateProfile(user,{
        //             displayName: name,
        //         })
        //     });
        //     const user = res.user;
        //     await addDoc(collection(db, "users"), {
        //         uid: user.uid,
        //         name,
        //         authProvider: "local",
        //         email,
        //     });

        //     navigation.replace('Home')
        // } catch (err) {
        //     console.error(err);
        //     alert(err.message);
        // }
        if (!email || !emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }
        // Password validation
        if (!password || password.length < 6) {
            alert("Password should be at least 6 characters long.");
            return;
        }
        createUserWithEmailAndPassword(auth, email, password)
        
            .then((userCredential) => {
                const user = userCredential.user;
                updateProfile(user, {
                    displayName: name
                })
                navigation.navigate("Home");
                const myUserUid = auth.currentUser.uid;

                //   const name 
                setDoc(doc(db, "users", `${myUserUid}`), {
                    uid: myUserUid,
                    email: email,
                    name,
                });
            })
            .catch((err)=>{
                setIsLoading(false);
                // setError("Invalid Credentials");
                alert(err);
              })
    };

    return (
        <View style={styles.container}>
            <Image source={require("../assets/ChatApp.png")} style={styles.image}/>
     

            <Text style={styles.title}>Registration Page</Text>
        {error.length>0 && <Text style={styles.error}>{error}</Text>}

            <TextInput
                style={styles.input}
                placeholder="Name"
                onChangeText={setName}
                value={name}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={setPassword}
                value={password}
            />
            <TouchableOpacity style={styles.button} onPress={() => handleRegistration(email, password)}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop:50,
        position: "absolute",
        alignItems: 'center',
        justifyContent: 'center',
        alignself: 'center',
        width: "100%",
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'darkgreen'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        width: '80%',
    },
    button: {
        width: '80%',
        height: 40,
        backgroundColor: 'darkgreen',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
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
});

export default RegisterScreen