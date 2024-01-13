import * as React from 'react';
import { Text, View, Button, Platform, TouchableOpacity, Alert, Modal, StyleSheet, TextInput } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { sendPushNotification } from '../service/PushNotification';
import { Header } from '@rneui/themed';
import styled from 'styled-components'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from 'react-native-elements';
import ColorPalette from 'react-native-color-palette'
const DEFAULT_NOTIFY = `[{"content": "Chơi game không ku?", "title": "GAMEEE"}, {"content": "Đi chơi đi ani ơi", "title": "Chán quá"},\
 {"content": "Qua đây chơi điii", "title": "Ê cu"}, {"content": "Nhớ ngiu ghê", "title": "Missing u"}]`
const DEFAULT_COLOR = '[{"color": "#A6D4A7"},{"color": "#A6D4A7"},{"color": "#A6D4A7"},{"color": "#A6D4A7"}]'
const Page = styled(View)`
    padding : 40px 30px 0 30px
`
const SummonButton = styled(TouchableOpacity)`
    background-color :red;
    flex: 48% 0 0;
    border-radius: 5px;
    text-align: center;
    margin-bottom: 10px;
    display: flex;
    height: 150px;
    align-items: center;
    justify-content: center;
    color:white
`
const SummotButtonContainer = styled(View)`
    display : flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
`
const Heading = styled(Text)`
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    margin-bottom : 16px;
`
const SaveBtn = styled(TouchableOpacity)`
    background-color:#A6D4A7;
    padding : 15px 20px;
    border-radius:15px;
`
const InputMessage = styled(TextInput)`
    border: 1px solid black;
    border-radius: 50px;
    padding : 6px 15px;
    font-size: 16px;
    margin-bottom:20px;
`
const ModalHeader = styled(Text)`
    textAlign:center;
    fontSize:20px;
    fontWeight:500;
    marginBottom:20px
`
const ChangeColorBtn = styled(TouchableOpacity)`
  margin-left : 15px;
  width:30px;
  height:30px;
  background-color:red;
  border-radius:50px;
`
const ChangeColor = styled(View)`
  flex-direction: row;
  align-items : flex-end;
  margin-bottom : 20px;
`
const ColorPicker = styled(View)`
  background-color: #e1e1e1;
  margin-bottom: 25px;
  border-radius: 25px;
`
const styles = StyleSheet.create({
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
})

type ControlScreenProps = {
    navigation: any;
};
const ControlScreen: React.FC<ControlScreenProps> = ({ navigation }) => {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalDataID, setModalDataId] = React.useState(Number);
    const [title, setTitle] = React.useState('');
    const [content, setContent] = React.useState('');
    const [pickcolor, setPickColor] = React.useState(false)
    const [bgColorBtn, setBgColorBtn] = React.useState(null);
    const [ColorBtn, SetColorBtn] = React.useState(null);
    const [notify, setNotify] = React.useState(null);
    const [changePickColor, SetChangePickColor] = React.useState(false);

    React.useEffect(() => {
        const fetchData = async () => {
            let notify = JSON.parse(await AsyncStorage.getItem('notify'));

            if (notify === null) {
                await AsyncStorage.setItem('notify', DEFAULT_NOTIFY);
                notify = JSON.parse(DEFAULT_NOTIFY);
            }
            // AsyncStorage.removeItem('bgColorBtn')
            let ArrColor = JSON.parse(await AsyncStorage.getItem('bgColorBtn'));


            if (ArrColor === null) {
                await AsyncStorage.setItem('bgColorBtn', DEFAULT_COLOR);
                ArrColor = JSON.parse(DEFAULT_COLOR);
            }
            // Sử dụng hàm cập nhật trạng thái
            setNotify(notify);
            setBgColorBtn(ArrColor);


        };
        fetchData();
    }, []);

    const getToken = async () => {
        try {
            const value = await AsyncStorage.getItem('pushNotifyToken');
            if (value !== null) {
                return value;
            } else {
                Alert.alert("Warning", "Bạn chưa có partner vui lòng thêm mã số ở profile")
            }
        } catch (e) {
            // error reading value
        }
    };

    const getTitle = async (numOfBtn: number) => {
        try {
            let notify = JSON.parse(await AsyncStorage.getItem('notify'))
            return (notify[numOfBtn]['title'])
        } catch (e) {


        }
    }
    const getContent = async (numOfBtn: number) => {
        try {
            let notify = JSON.parse(await AsyncStorage.getItem('notify'))
            return notify[numOfBtn]['content']
        } catch (e) {


        }
    }
    const setModalData = async (modalDataID: number) => {
        try {

            let notify = JSON.parse(await AsyncStorage.getItem('notify'))

            notify[modalDataID]['content'] = content;
            notify[modalDataID]['title'] = title;
            await AsyncStorage.setItem('notify', JSON.stringify(notify));
            // notifyRef.current = notify
            setModalVisible(false)
            if(ColorBtn !== null){
                setBgColorBtn(ColorBtn);
                SetColorBtn(null)

            }
            SetChangePickColor(false);
            setNotify(notify)
            // await AsyncStorage.setItem('notify',"")
        } catch (e) {
            Alert.alert("Warning", "Error when save data to notify!")

        }
    }

    const updatebgColorBtn = async (newColor: string) => {
        let bgColor = JSON.parse(await AsyncStorage.getItem('bgColorBtn'));
        bgColor[modalDataID]['color'] = newColor;
        await AsyncStorage.setItem('bgColorBtn', JSON.stringify(bgColor))
        // setBgColorBtn(bgColor);
        SetChangePickColor(true);
        SetColorBtn(bgColor)
    }
    const getbgColorBtn = (newColor: string) => {

    }

    return (bgColorBtn) ? (
        <View>
            <Header backgroundColor='#A5D4A6' centerComponent={{ text: 'Triệu hồiiiii', style: { fontSize: 20, fontWeight: "bold" } }}
                rightComponent={
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{ padding: 5 }}>
                        <Icon
                            name='info'
                            size={25}
                        />
                    </TouchableOpacity>
                }></Header>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}
                onShow={async () => {
                    setTitle(await getTitle(modalDataID))
                    setContent(await getContent(modalDataID))
                }}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 22,
                }}>
                    <View style={styles.modalView}>
                        <View style={{ width: 250 }}>
                            <View style={{alignItems : 'flex-end'}}>
                                <TouchableOpacity onPress={() =>  {setModalVisible(false);SetColorBtn(null)}}>
                                    <Text>✖️</Text>
                                </TouchableOpacity>
                            </View>

                            <ModalHeader >Set notify</ModalHeader>
                            <Text style={{ fontWeight: 'bold', fontSize: 14, paddingLeft: 15, marginBottom: 5 }}>Title</Text>
                            <InputMessage
                                value={title}
                                onChangeText={newText => setTitle(newText)}
                                placeholder="Title"
                                style={{ width: '100%' }}
                            />
                            <Text style={{ fontWeight: 'bold', fontSize: 14, paddingLeft: 15, marginBottom: 5 }}>Content</Text>
                            <InputMessage
                                value={content}
                                onChangeText={newText => setContent(newText)}
                                placeholder="Content"
                                style={{ width: '100%' }}
                            />
                            <ChangeColor>
                                <Text style={{ fontWeight: 'bold', fontSize: 14, paddingLeft: 15, marginBottom: 5 }}>Color : </Text>
                                {ColorBtn ? <ChangeColorBtn style={{ backgroundColor: ColorBtn[modalDataID]['color'] }} onPress={() => { setPickColor(!pickcolor) }} />
                                    : <ChangeColorBtn style={{ backgroundColor: bgColorBtn[modalDataID]['color'] }} onPress={() => { setPickColor(!pickcolor) }} />}

                            </ChangeColor>
                            {pickcolor && <ColorPicker >
                                <ColorPalette
                                    onChange={color => { updatebgColorBtn(color) }}
                                    defaultColor={bgColorBtn[modalDataID]['color']}
                                    colors={['#A6D4A7', '#94CAEE', '#D0EE5F', '#038811', '#5AD1C5']}
                                    icon={
                                        <Text>✔</Text>}
                                />
                            </ColorPicker>}

                        </View>
                        <SaveBtn onPress={() => setModalData(modalDataID)}>
                            <Text>Save</Text>
                        </SaveBtn>
                    </View>
                </View>
            </Modal>
            <Page>
                <Heading>Muốn gì thì ấn =))</Heading>
                <SummotButtonContainer>
                    <SummonButton style={{ backgroundColor: bgColorBtn[0]['color'] }} onPress={async () => sendPushNotification(await getToken(), await getTitle(0), await getContent(0))}
                        onLongPress={() => { setModalDataId(0); setModalVisible(true) }}>
                        {notify && notify[0] && (<Text>{notify[0]['content']}</Text>)}
                    </SummonButton>
                    <SummonButton style={{ backgroundColor: bgColorBtn[1]['color'] }} onPress={async () => sendPushNotification(await getToken(), await getTitle(1), await getContent(1))}
                        onLongPress={() => { setModalDataId(1); setModalVisible(true) }}>
                        {notify && notify[0] && (<Text>{notify[1]['content']}</Text>)}
                    </SummonButton>
                    <SummonButton style={{ backgroundColor: bgColorBtn[2]['color'] }} onPress={async () => sendPushNotification(await getToken(), await getTitle(2), await getContent(3))}
                        onLongPress={() => { setModalDataId(2); setModalVisible(true) }}>
                        {notify && notify[0] && (<Text>{notify[2]['content']}</Text>)}
                    </SummonButton>
                    <SummonButton style={{ backgroundColor: bgColorBtn[3]['color'] }} onPress={async () => sendPushNotification(await getToken(), await getTitle(3), await getContent(3))}
                        onLongPress={() => { setModalDataId(3); setModalVisible(true) }}>
                        {notify && notify[0] && (<Text>{notify[3]['content']}</Text>)}
                    </SummonButton>
                </SummotButtonContainer>


            </Page>

        </View>
    )
        : null
}
export default ControlScreen;

