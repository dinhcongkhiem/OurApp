import * as React from 'react';
import { Text, View, Button, Platform, TouchableOpacity, TextInput, Alert } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { sendPushNotification } from '../service/PushNotification';
import { Header } from '@rneui/themed';
import styled from 'styled-components'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import UserService from '../service/UserService';


const Page = styled(View)`
    padding : 40px 30px 0 30px;
`

const Heading = styled(Text)`
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    margin-bottom : 16px;
`

const InputMessage = styled(TextInput)`
    border: 1px solid black;
    width: 95%;
    border-radius: 50px;
    padding : 6px 15px;
    font-size: 16px;
`
const SubmitBTN = styled(TouchableOpacity)`
  margin-top: 10px;
  border: 1px solid black;
  padding : 8px 15px;
  width: 100px;
  height:40px;
  background-color: #4ED65E;
  border-radius  : 15px;
  margin-right:20px;

`
const InfoBlock = styled(View)`
    display:flex;
    justify-content: space-between;
    align-items: flex-end;
    width: 100%;
    padding: 5px 0;
    margin-bottom: 12px;
`
const InputInfo = styled(View)`
    width:100%;

`

const UsersInfor = styled(View)`
    border:1px solid black;
    padding : 10px;
    border-radius: 15px;

`

const ProfileScreen: React.FC = () => {
    const [id, setId] = React.useState(Number);
    const [Idtoken, setIdToken] = React.useState(Number);
    const [userName, setUserName] = React.useState('');
    const [nickName, setNickname] = React.useState('');
    const [nameofPartner, SetNameofPartner] = React.useState('');
    const { onLogout } = useAuth();
    const CheckToken = async () => {
  
            UserService.GetNotifyToken()
            .then(async (response) => {
                console.log(response.data.pushNotifyToken);
                await AsyncStorage.setItem('pushNotifyToken',response.data.pushNotifyToken)
              })
              .catch((error) => {
                console.log(error);
              });
        
      
    }

    const UpdateInfor = async () => {
        
        await UserService.UpdateUser(id, userName, nickName, Idtoken)
        .then((response) => {
            GetUser();
            CheckToken();
            Alert.alert('Successfully', 'Cập nhật thành công!', [
                { text: 'OK'},
            ]);
          })
          .catch((error) => {
            Alert.alert('Error', error, [
                { text: 'OK'},
            ]);
          }); 
    }
    
    const GetUser = () => {
        UserService.GetUser()
            .then((response) => {
                let user = response.data;
                setId(user.id)
                setUserName(user.name)
                setNickname(user.nickname)
                setIdToken((user.idPartner) == null ? '' : user.idPartner)
                SetNameofPartner(user.nameOfPartner)
            })
            .catch((error) => {
                console.log(error);
            });
    }
    React.useEffect(() => {
        GetUser();
    }, [])

    const Logout = async () => {
        onLogout();
    }
   
    return (

        <View>
            <Page>
                <Heading>Your Information</Heading>

                <UsersInfor>
                    <InfoBlock>
                        <InfoBlock>
                            <InputInfo>
                                <Text style={{ fontWeight: 'bold', fontSize: 15, paddingLeft: 15, marginBottom: 10 }}>
                                    Mã số của bạn là : {id}{"\n"}
                                    <Text style={{ fontWeight: '400', fontSize: 12,lineHeight:20}} >
                                        (hãy gửi cho partner của bạn mã số này để kết nối với bạn)
                                    </Text>
                                </Text>

                            </InputInfo>

                        </InfoBlock>
                        <InputInfo >
                            <Text style={{ fontWeight: 'bold', fontSize: 14, paddingLeft: 15, marginBottom: 5 }}>Your partner</Text>
                            <View style={{ flexDirection: 'row', width: '100%' }}>
                                <InputMessage
                                    onChangeText={newText => setIdToken(Number(newText))}
                                    value={Idtoken == 0 ? "" : String(Idtoken)}
                                    placeholder="Mã số"
                                    keyboardType="numeric"
                                    style={{ width: '30%' }}
                                />
                                <Text style={{ width: '70%', textAlignVertical: 'center', paddingLeft: 15, fontSize: 16, fontWeight: '500' }}>
                                    {nameofPartner}
                                </Text>
                            </View>

                        </InputInfo>

                    </InfoBlock>

                    <InfoBlock>
                        <InputInfo>
                            <Text style={{ fontWeight: 'bold', fontSize: 14, paddingLeft: 15, marginBottom: 5 }}>Name</Text>
                            <InputMessage
                                onChangeText={newText => setUserName(newText)}
                                value={userName}
                                placeholder="name"
                            />
                        </InputInfo>

                    </InfoBlock>
                    <InfoBlock>
                        <InputInfo>
                            <Text style={{ fontWeight: 'bold', fontSize: 14, paddingLeft: 15, marginBottom: 5 }}>Nick Name</Text>
                            <InputMessage
                                onChangeText={newText => setNickname(newText)}
                                value={nickName}
                                placeholder="nick name"
                            />
                        </InputInfo>

                    </InfoBlock>
                    <InfoBlock>
                        <InputInfo>
                            <Text style={{ fontWeight: 'bold', fontSize: 14, paddingLeft: 15, marginBottom: 5 }}>Chưa nghĩ ra thông tin gì</Text>
                            <InputMessage
                                // onChangeText={newText => setIdToken(newText)}
                                value={""}
                                placeholder="Chưa nghĩ ra thông tin gì"
                                keyboardType="numeric"
                            />
                        </InputInfo>
                        <SubmitBTN onPress={UpdateInfor}>
                            <Text style={{ color: '#000', fontWeight: 'bold', textAlign: 'center', fontSize: 12, lineHeight: 20 }}>UPDATE</Text>
                        </SubmitBTN>
                    </InfoBlock>
                </UsersInfor>
                <SubmitBTN onPress={Logout}>
                    <Text style={{ color: '#000', fontWeight: 'bold', textAlign: 'center', fontSize: 12, lineHeight: 20 }}>LOGOUT</Text>
                </SubmitBTN>




            </Page>
        </View>
    );
}
export default ProfileScreen;