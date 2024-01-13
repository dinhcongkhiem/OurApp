import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { registerForPushNotificationsAsync } from './PushNotification'
import '../Global'
const USER_API_BASE_URL = global.host_user_api;
const HOST = global.host;
class UserService {

    RegisterAccount(name: string, email: string, nickname: string, password: string, pushNotifyToken: string) {
        let data = JSON.stringify({
            "name": name,
            "email": email,
            "nickname": nickname,
            "password": password,
            "pushNotifyToken": pushNotifyToken,
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: USER_API_BASE_URL + '/register',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        return axios.request(config)

    }
    async GetUser() {
        const ACCESS_TOKEN = await AsyncStorage.getItem('accessToken')


        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: USER_API_BASE_URL + "infor",
            headers: {
                'Authorization': 'Bearer ' + ACCESS_TOKEN
            }
        };
        console.log(config);
        
        return axios.request(config)

    }
    async GetNotifyToken() {
        const ACCESS_TOKEN = await AsyncStorage.getItem('accessToken')

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: USER_API_BASE_URL + "notifytoken",
            headers: {
                'Authorization': 'Bearer ' + ACCESS_TOKEN
            }
        };

        return axios.request(config)
    }
    async UpdateUser(id: number, name: string, nickname: string, idOfPartner: number) {
        const ACCESS_TOKEN = await AsyncStorage.getItem('accessToken')
        let data = JSON.stringify({
            "id": id,
            "name": name,
            "nickname": nickname,
            "idOfPartner": idOfPartner
        });

        let config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: USER_API_BASE_URL + 'update',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + ACCESS_TOKEN
            },
            data: data
        };

        return axios.request(config)

    }
    async UpdateToken() {

        const ACCESS_TOKEN = await AsyncStorage.getItem('accessToken')
        const Token = await registerForPushNotificationsAsync!()
        console.log(Token);
        console.log("Update");


        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: USER_API_BASE_URL + 'update-token?token=' + encodeURIComponent(Token),
            headers: {
                'Authorization': 'Bearer ' + ACCESS_TOKEN
            }
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log(error);
                console.log(config);

            });

    }
    async getChatMessage(timestamp :Date,senderId :number,recipientId:number) {
        const ACCESS_TOKEN = await AsyncStorage.getItem('accessToken')        
        let data = JSON.stringify({
            "createAt":timestamp
          });
          
          let config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: HOST + `/messages/${senderId}/${recipientId}`,
            headers: { 
              'Content-Type': 'application/json', 
              'Authorization': 'Bearer ' + ACCESS_TOKEN
            },
            data : data
          };
          

        
        return axios.request(config)
          
    }

    async UpdateState(isOnline : boolean){
        const ACCESS_TOKEN = await AsyncStorage.getItem('accessToken')
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: USER_API_BASE_URL + "updatestate?State=" + isOnline,
            headers: { 
              'Authorization': 'Bearer ' + ACCESS_TOKEN, 
            }
          };
          
          axios.request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
          })
          .catch((error) => {
            console.log(error);
          });
    }
}

export default new UserService();
