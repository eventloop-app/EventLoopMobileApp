import React, {useEffect, useState} from 'react';
import {Button, Platform, ScrollView, Text, TouchableOpacity, View} from "react-native";
import api from "../services/api/api";
import Colors from "../constants/Colors";
import fonts from "../constants/Fonts";
import fontSize from "../constants/FontSize";

const EventReportScreen = (props) => {

  const [eventInfo, setEventInfo] = useState(null)
  const [reports, setReports] = useState(null)
  const [isLoad, setIsLoad] = useState(false)

  useEffect(() => {
    console.log(props)
    getReports()
  }, [])

  const getReports = () => {
    api.getReportDetailById(props.route.params.memId, props.route.params.eveId).then(res => {
      if (res.status === 200) {
        console.log(res.data)
        setEventInfo(res.data[0])
        setReports(res.data[0].reports)
      }
    })
  }

  const onStampReview = (eve) => {
    setReports([...reports])
    api.stampReport(props.route.params.memId, eve.id, !eve.isReview).then(res => {
      if (res.status === 200) {
        let newReport = reports
        newReport[reports.findIndex(r => r.id === eve.id)] = {...eve, isReview: !eve.isReview}
        setReports(newReport)
      }
    })
  }

  const suspendEvent = () => {
    let data = {
      eventId: eventInfo?.id,
      adminId: props.route.params.memId,
      status: "SUSPEND",
      type: "กิจกรรมมีเนื้อหาเข้าค่ายมั่วสุ่ม",
      remark: ""
    }
    api.suspendEvent(data).then(res => {
      console.log(res.status)
      if (res.status === 200) {
        getReports()
      }
    })
  }

  const closeEvent = () => {
    let data = {
      eventId: eventInfo?.id,
      adminId: props.route.params.memId,
      status: "SHUTDOWN",
      type: "กิจกรรมมีเนื้อหาเข้าค่ายมั่วสุ่ม",
      remark: ""
    }
    api.suspendEvent(data).then(res => {
      console.log(res.status)
      if (res.status === 200) {
        getReports()
        props.navigation.pop()
      }
    })
  }


  const unSuspendEvent = () => {
    let data = {
      eventId: eventInfo.id,
      adminId: props.route.params.memId,
      status: "NORMAL",
      type: "กิจกรรมมีเนื้อหาเข้าค่ายมั่วสุ่ม",
      remark: ""
    }
    api.suspendEvent(data).then(res => {
      console.log(res.status)
      if (res.status === 200) {
        console.log(res)
        props.navigation.pop()
      }
    })
  }

  return (!isLoad &&
    <View style={{flex: 1, marginTop: Platform.OS === 'ios' ? 80 : 60}}>
      <ScrollView
        style={{marginTop: 30}}
        contentContainerStyle={{paddingBottom: 100}}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        {
          reports?.map((rep, inx) => (
            <View
              key={inx}
              style={{
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
                margin: 6,
                marginVertical: 3,
                borderRadius: 15,
              }}
            >
              <View style={{
                width: "100%",
                height: 300,
                backgroundColor: Colors.white,
                overflow: "hidden",
                borderRadius: 15,
                padding: 4,
                flexDirection: "column",
                alignItems: 'center'
              }}>

                <View style={{
                  width: "95%",
                  height: "100%",
                }}>
                  <Text style={{
                    textAlign: 'center',
                    fontFamily: fonts.primary,
                    fontSize: fontSize.small,
                    color: rep.isReview ? 'green' : Colors.black
                  }}>{rep.description}</Text>
                </View>

                <TouchableOpacity disabled={rep.isReview} style={{position: 'relative', left: 0, bottom: 50}}
                                  onPress={() => onStampReview(rep)}>
                  <Text style={{
                    fontFamily: fonts.bold,
                    fontSize: fontSize.primary,
                    color: rep.isReview ? Colors.gray2 : Colors.primary
                  }}>รับทราบปัญหา</Text>
                </TouchableOpacity>
              </View>

            </View>
          ))
        }
      </ScrollView>

      {
        eventInfo?.status === 'SUSPEND' &&
        <View style={{
          position: 'absolute',
          display: 'flex',
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          bottom: 0
        }}>
          <TouchableOpacity
            disabled={!(eventInfo?.updateAt > eventInfo?.createAt)}
            style={{margin: 5}}
            onPress={() => unSuspendEvent()}>
            <View style={{
              width: 180,
              height: 50,
              backgroundColor: Colors.primary,
              borderRadius: 8,
              marginBottom: 10,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{
                fontFamily: fonts.bold,
                fontSize: fontSize.primary,
                color: Colors.white
              }}>ยุติการระงับกิจกรรม</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={!(eventInfo?.updateAt > eventInfo?.createAt)}
            style={{margin: 5, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => colseEvent()}>
            <View style={{
              width: 180,
              height: 50,
              backgroundColor: eventInfo?.updateAt > eventInfo?.createAt ? Colors.red : Colors.gray2,
              borderRadius: 8,
              marginBottom: 10,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{
                fontFamily: fonts.bold,
                fontSize: fontSize.primary,
                color: Colors.white
              }}>ปิดกิจกรรม</Text>
            </View>
          </TouchableOpacity>
        </View>
      }

      {
        eventInfo?.status !== 'SUSPEND' &&
        <View style={{
          position: 'absolute',
          display: 'flex',
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          bottom: 0
        }}>
          <TouchableOpacity disabled={!(reports?.filter(rp => rp.isReview === true).length > reports?.length / 2)}
                            style={{margin: 5}} onPress={() => suspendEvent()}>
            <View style={{
              width: 180,
              height: 50,
              backgroundColor: (reports?.filter(rp => rp.isReview === true).length > reports?.length / 2) ? Colors.yellow : Colors.gray2,
              borderRadius: 8,
              marginBottom: 10,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{
                fontFamily: fonts.bold,
                fontSize: fontSize.primary,
                color: Colors.white
              }}>ระงับกิจกรรมชั่วคราว</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity disabled={!(reports?.filter(rp => rp.isReview === true).length > reports?.length / 2)}
                            style={{margin: 5, justifyContent: 'center', alignItems: 'center'}}
                            onPress={() => closeEvent()}>
            <View style={{
              width: 180,
              height: 50,
              backgroundColor: (reports?.filter(rp => rp.isReview === true).length > reports?.length / 2) ? Colors.red : Colors.gray2,
              borderRadius: 8,
              marginBottom: 10,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{
                fontFamily: fonts.bold,
                fontSize: fontSize.primary,
                color: Colors.white
              }}>ปิดกิจกรรม</Text>
            </View>
          </TouchableOpacity>
        </View>
      }


      {/*<Button title={'ระงับกิจกรรมชั่วคราว'} onPress={() => suspendEvent()}></Button>*/}
      {/*<Button color={'red'} title={'ปิดกิจกรรม'}></Button>*/}
    </View>
  );
};

export default EventReportScreen;