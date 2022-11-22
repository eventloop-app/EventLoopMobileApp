import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import fontSize from "../constants/FontSize";
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import moment from "moment";
import { toBuddhistYear } from "../constants/Buddhist-year";
import { LinearGradient } from 'expo-linear-gradient';
const EventCardHorizon = ({ item, onPress }) => {
    const eventName = item.eventName
    const [isLoading, setIsLoading] = useState(false)
    const eventDate = toBuddhistYear(moment(item.startDate), "DD/MM/YYYY")
    const eventTime = moment(item.startDate).format("HH:mm") + " - " + moment(item.endDate).format("HH:mm") + " น."
    const eventLocation = item.location?.name
    const ImageCover = item?.coverImageUrl

    return (
        <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={[styles.shadowsButton]} >

            <LinearGradient colors={[Colors.yellow, Colors.skyBlue, Colors.pink,]} style={{ padding: 6, borderRadius: 15 }}>


                <View style={[styles.Container,]}>
                    <View style={styles.ImageCover}>
                        <Image
                            style={styles.Image}
                            source={{
                                uri: (ImageCover)
                            }}
                        />
                        <View style={styles.DateBox}>
                            <Text style={styles.TextDateBoxNum}>{moment(item.startDate).format("D")}</Text>
                            <Text style={styles.TextDateBox}>{moment.monthsShort(moment(item.startDate).month())}</Text>
                        </View>
                        {/*<View style={styles.BookmarkBox}>*/}
                        {/*    <Ionicons name={'md-bookmark-outline'} size={24} color={Colors.red} />*/}
                        {/*</View>*/}
                    </View>

                    <View style={{ width: "100%", height: "35%", paddingHorizontal: 8, paddingTop: 4 }}>
                        <View >
                            <Text numberOfLines={1} style={styles.TextTitle}>{eventName}</Text>
                        </View>

                        <View style={{ flexDirection: "row" }}>
                            <View style={styles.Date} >
                                <Ionicons name={'calendar-sharp'} size={24} color={Colors.primary} />
                                <Text style={styles.TextDate}>{eventDate}</Text>
                            </View>
                            <View style={styles.Time} >
                                <Ionicons name={'ios-time-outline'} size={24} color={Colors.primary} />
                                <Text style={styles.TextDate}>{eventTime}</Text>
                            </View>
                        </View>

                        <View style={styles.Location} >
                            <Ionicons name={item.type === 'ONSITE' ? 'ios-location-outline' : 'laptop-outline'} size={25} color={Colors.primary} />
                            <Text numberOfLines={1} style={styles.TextLocation}>{eventLocation}</Text>
                        </View>
                    </View>

                </View>
            </LinearGradient>
        </TouchableOpacity >)
}
const styles = StyleSheet.create({
    Container: {
        width: 350,
        height: 290,
        backgroundColor: Colors.white,
        alignItems: "center",
        overflow: "hidden",
        borderRadius: 15,
        padding: 8
    },
    ImageCover: {
        position: "relative",
        borderRadius: 15,
        width: 335,
        height: "65%",
        backgroundColor: "white",
        padding: 2
    },
    Image: {
        borderRadius: 15,
        width: '100%',
        height: '100%',
    },
    DateBox: {
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        left: 10,
        top: 10,
        borderRadius: 8,
        width: 55,
        height: 55,
        backgroundColor: "white",
    },
    BookmarkBox: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        right: 10,
        top: 10,
        borderRadius: 6,
        width: 30,
        height: 30,
        backgroundColor: "white",
    },
    Title: {


    },
    Date: {
        marginRight: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    Time: {
        flexDirection: "row",
        overflow: "scroll",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    Location: {
        flexDirection: "row",
        alignItems: "center",
    },
    TextTitle: {
        fontFamily: Fonts.bold,
        fontSize: fontSize.medium,
        color: Colors.black,

    },
    TextTime: {
        fontFamily: Fonts.primary,
        fontSize: fontSize.primary,
        color: Colors.black,
        textAlign: 'left',
        marginLeft: 5
    },
    TextDate: {
        fontFamily: Fonts.primary,
        fontSize: fontSize.primary,
        color: Colors.black,
        textAlign: 'left',
        marginLeft: 5
    },
    TextLocation: {
        fontFamily: Fonts.primary,
        fontSize: fontSize.primary,
        color: Colors.black,
        marginLeft: 5,

    },
    TextDateBoxNum: {
        fontFamily: Fonts.bold,
        fontSize: fontSize.big,
        color: Colors.black,
        textAlign: 'center',
    },
    TextDateBox: {
        fontFamily: Fonts.bold,
        fontSize: fontSize.medium,
        color: Colors.black,
        textAlign: 'center',
        marginTop: -15
    },
    shadowsButton: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        margin: 8,
        borderRadius: 15,
    },



});

export default EventCardHorizon;
