import * as React from 'react';
import { Text, View, Button, Platform, TouchableOpacity, TextInput, Image, Alert, ActivityIndicator } from 'react-native';


import { Header } from '@rneui/themed';
import styled from 'styled-components'
import UserService from '../service/UserService';
import { registerForPushNotificationsAsync } from '../service/PushNotification';
const Page = styled(View)`
    padding : 40px 30px 0 30px;
    display:flex;
    justify-content: center;
    height:50%;
`

const Heading = styled(Text)`
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    margin-bottom : 16px;
`

const InputMessage = styled(TextInput)`
    margin-left: 10px;
    borderBottomWidth: 1px;

    width: 90%;
    padding : 6px 15px;
    font-size: 14px;
`
const SubmitBTN = styled(TouchableOpacity)`
  margin-top: 10px;
  border: 1px solid black;
  padding : 8px 15px;
  width: 30%;
  height:40px;
  background-color: green;
  border-radius  : 15px;

`
const InfoBlock = styled(View)`
    width: 100%;
    padding: 5px 0;
    margin-bottom: 12px;
`
const InputInfo = styled(View)`
    width:100%;

`

const UsersInfor = styled(View)`
    
    border:1px solid black;
    padding : 45px 10px;
    padding-bottom:25px;
    border-radius: 15px;
    
`
const ButtonContainer = styled(View)`
    margin-top:20px; 
    padding:0 15px;   
    width:100%;
    display:flex;
    flexDirection:row;
    justify-content:space-between;
`

const LogoImg = styled(Image)`
    width:300px;
    height:110px;
    margin:50px auto;
    margin-top:100px;
    
`


type RegisterScreenProps = {
    navigation: any;
};

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {

    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [nickname, setNickname] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [nameErr, setNameErr] = React.useState(false);
    const [emailErr, setEmailErr] = React.useState(false);
    const [passwordErr, setPasswordErr] = React.useState(false);
    const [token, setToken] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    React.useEffect(() => {
        const getToken = async () => {
            const newToken = await registerForPushNotificationsAsync();

            setToken(newToken);
            // NotifyTokenService.AddProductToCart(newToken);
        };

        getToken();
    }, []);
    const Register = () => {
        if (name === '') {
            setNameErr(true);
        }
        if (email === '') {
            setEmailErr(true);
        }
        if (password === '') {
            setPasswordErr(true);
        }
        if (email !== '' && name !== '' && password !== '') {
            setLoading(true)
            UserService.RegisterAccount(name, email, nickname, password, token)
                .then((response) => {
                    Alert.alert('Successfully', JSON.stringify(response.data), [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                        { text: 'OK' },
                    ]);
                    setNameErr(false);
                    setEmailErr(false);
                    setPasswordErr(false);
                    setLoading(false);
                    navigation.navigate('Login');

                })
                .catch((error) => {
                    Alert.alert(error);
                    setLoading(false);

                })
               
        }


    }



    return (

        <View>
            <LogoImg

                source={require('../../assets/image/logo-no-background.png')}
            />
            {loading ?
                <View style={{ height: 400, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#00ff00" />
                </View> :
                <Page>

                    <UsersInfor>
                        <Heading>Register</Heading>
                        <InfoBlock>
                            <InputInfo>
                                <InputMessage
                                    onChangeText={newText => setName(newText)}
                                    value={name}
                                    placeholder="Name"
                                    style={nameErr ? { borderColor: 'red' } : { borderColor: 'black' }}
                                />
                            </InputInfo>

                        </InfoBlock>
                        <InfoBlock>
                            <InputInfo>
                                <InputMessage
                                    onChangeText={newText => setEmail(newText)}
                                    value={email}
                                    placeholder="Email"
                                    style={emailErr ? { borderColor: 'red' } : { borderColor: 'black' }}
                                />
                            </InputInfo>

                        </InfoBlock>
                        <InfoBlock>
                            <InputInfo>
                                <InputMessage
                                    onChangeText={newText => setNickname(newText)}
                                    value={nickname}
                                    placeholder="Nick Name"
                                />
                            </InputInfo>

                        </InfoBlock>
                        <InfoBlock>
                            <InputInfo>
                                <InputMessage
                                    onChangeText={newText => setPassword(newText)}
                                    value={password}
                                    placeholder="Password"
                                    secureTextEntry={true}
                                    style={passwordErr ? { borderColor: 'red' } : { borderColor: 'black' }}
                                />
                            </InputInfo>

                        </InfoBlock>
                        <ButtonContainer>
                            <TouchableOpacity style={{ width: 100 }} onPress={() => { navigation.navigate('Login') }}>
                                <Text style={{ color: '#000', fontWeight: 'bold', textAlign: 'center', fontSize: 10, lineHeight: 20 }}>Có acc rồi thì login đi</Text>
                            </TouchableOpacity>
                            <SubmitBTN onPress={() => Register()}>
                                <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 12, lineHeight: 20 }}>Register</Text>
                            </SubmitBTN>

                        </ButtonContainer>

                    </UsersInfor>




                </Page>
            }


        </View>
    );
}


export default RegisterScreen;


