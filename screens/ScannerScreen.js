import React, {useEffect, useState} from 'react';
import {BarCodeScanner} from "expo-barcode-scanner";
import {Button, Text, View, StyleSheet, TouchableOpacity} from "react-native";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";
import Colors from "../constants/Colors";


const ScannerScreen = (props) => {

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [confirm, setConfirm] = useState(null)

    // useEffect(()=> {
    //     console.log(props)
    // })
    useEffect(() => {
        (async () => {
            let unmount = false
            if(unmount !== true){
                const {status} = await BarCodeScanner.requestPermissionsAsync();
                setHasPermission(status === 'granted');
            }
            return ()=> {
                unmount = true
            }
        })();
    }, []);

    const handleBarCodeScanned = ({type, data}) => {
        setScanned(true);
        setTimeout(() => {
            props.navigation.navigate('EventDetail', {QRcode: data})
            console.log(data)
        }, 500)
        // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    const test = () => {
        setTimeout(() => {
            setScanned(false)
        }, 3000)
    }

    return (
        <View style={styles.container}>
            {/*<View style={{position: 'absolute', width: '100%', height:'100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex:50, justifyContent: 'center', alignItems: 'center'}}>*/}
            {/*    <View style={{width: 300, height: 300, borderRadius: 10, backgroundColor: Colors.white,justifyContent: 'center', alignItems: 'center'}}>*/}
            {/*    </View>*/}
            {/*</View>*/}
            <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.primary, paddingBottom: 10}}>สแกนคิวอาร์โค้ดเพื่อเช็คอินกิจกรรม</Text>
            <View style={{
                height: 300,
                width: '90%',
                borderRadius: 15,
                overflow: 'hidden',
                borderWidth: 3,
                borderColor: scanned ? 'green' : 'red'
            }}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={{flex: 1, width: '100%'}}
                />
                {scanned}
            </View>
            <View style={{position: "absolute", flex: 1,  bottom: -600, left: 0, top:0, right: 0, justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity onPress={()=> props.navigation.pop()}>
                    <View>
                        <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.big, color: Colors.red}}>
                            ยกเลิก
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default ScannerScreen;