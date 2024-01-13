import * as React from 'react';
import { Text, View, Button, Platform, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { Header } from '@rneui/themed';
import styled from 'styled-components'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import UserService from '../service/UserService';
import RegisterScreen from './RegisterScreen';

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
type LoginScreenProps = {
    navigation: any;
};
const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const [userName, setUserName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const { onLogin } = useAuth();


    const Login = async () => {
        const result = await onLogin!(userName, password)
        UserService.UpdateToken();
        UserService.GetNotifyToken()
        .then(async (response) => {
            await AsyncStorage.setItem('pushNotifyToken',response.data.pushNotifyToken)
          })
          .catch((error) => {
            console.log(error);
          });
        
        if (result && result.error) {
            Alert.alert('Tèoooo', "Tài khoản hoặc mật khẩu đéo đúng thử lại đi nhé ku", [
                { text: 'OK' },
            ]);
        }

    }
    return (

        <View>
            <LogoImg

                source={require('../../assets/image/logo-no-background.png')}
            />
            <Page>
                <UsersInfor>
                    <Heading>Login đi cu</Heading>
                    <InfoBlock>
                        <InputInfo>
                            <InputMessage
                                onChangeText={newText => setUserName(newText)}
                                value={userName}
                                placeholder="Email"
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
                            />
                        </InputInfo>

                    </InfoBlock>
                    <ButtonContainer>
                        <TouchableOpacity style={{ width: 100 }} onPress={() => { navigation.navigate('Register') }}>
                            <Text style={{ color: '#000', fontWeight: 'bold', textAlign: 'center', fontSize: 10, lineHeight: 20 }}>Chưa có acc thì đăng kí ở đây</Text>
                        </TouchableOpacity>
                        <SubmitBTN onPress={Login}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 12, lineHeight: 20 }}>Login</Text>
                        </SubmitBTN>

                    </ButtonContainer>

                </UsersInfor>




            </Page>
        </View>
    );
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function LoginStack() {
    return (
        <Stack.Navigator screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerShown: false
        }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>

    );
}

