import * as React from 'react';
import { Text, View, Button, Platform, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Alert, ActivityIndicator, PanResponder, Animated } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Header } from '@rneui/themed';
import styled from 'styled-components'
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { TextEncoder } from 'text-encoding';
import { Icon, Image } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import UserService from '../service/UserService';
import * as Animatable from 'react-native-animatable';
import { sendPushNotification } from '../service/PushNotification';
import { AppRegistry } from 'react-native';
import '../Global';
global.TextEncoder = TextEncoder;

const Page = styled(View)`
    flex: 1;
    position: relative;
`

const InputMessage = styled(TextInput)`
    border: 1px solid black;
    width: 87%;
    border-radius: 50px;
    padding : 0 15px;
    font-size: 16px;
`

const SendButton = styled(TouchableOpacity)`
  width: 13%;
`
const ContainerContent = styled(ScrollView)`
  margin-top: 30px;
  padding: 0 8px;
  right:0;
  left:0;

`
const InputChat = styled(View)`
    padding: 0 5px;
    width: 100%;
    position: fixed;
    display: flex;
    top:5px;
    height:50px;
    justify-content: space-between;
    flex-direction: row;
`
const SendIcon = styled(Image)`
  width: 50px;
  height: 50px;
`
const Content = styled(Text)`
  padding : 8px 10px;
  height: auto;
  font-size: 16px;
  color: #fff;
`
const ReplyContent = styled(View)`
  background-color: #3C3C3C;
  border-radius: 45px;

  margin-bottom: 5px;
  alignSelf: flex-start
`
const SendContent = styled(View)`
  margin-bottom: 5px;
  background-color: #69d3ba;
  border-radius: 45px;

  alignSelf: flex-end
`

var stompClient = null;
type ChatScreenProps = {
    navigation: any;
};
interface ContentItem {
    senderId: Number,
    recipientId: Number,
    content: string,
    createAt: Date
}
const SendContentAnimatable = Animatable.createAnimatableComponent(SendContent);
const ReplyContentAnimatable = Animatable.createAnimatableComponent(ReplyContent);
const ChatScreen: React.FC<ChatScreenProps> = ({ navigation }) => {
    const [message, setMessage] = React.useState('');
    const [contentData, setContentData] = React.useState<ContentItem[]>([])
    const [usernickname, setUserNickname] = React.useState('');
    const [userId, setuserID] = React.useState(Number);
    const [partnerId, setpartnerId] = React.useState(Number);
    const [isAtBottom, setIsAtBottom] = React.useState(true);
    const scrollViewRef = React.useRef<ScrollView | null>(null);
    const [isReplyMsg, SetReplyMsg] = React.useState(true);
    const [contentReply, SetcontentReply] = React.useState('');


    const fetchData = () => {
        UserService.GetUser()
            .then((response) => {
                let user = response.data;
                console.log(user);
                setpartnerId(user.idPartner)
                setuserID(user.id)
                setUserNickname(user.nickname)
                getChatMessage(new Date(), user.id, user.idPartner, false);

            })
            .catch((error) => {
                console.log(error);
            });
    };
    const getChatMessage = async (timestamp: Date, senderId: number, recipientId: number, getOldMessage: boolean) => {
        await UserService.getChatMessage(timestamp, senderId, recipientId)
            .then((response) => {
                if (response.data) {
                    if (getOldMessage) {
                        for (let i = response.data.length - 1; i >= 0; i--) {
                            setContentData(prevContentData => [response.data[i], ...prevContentData]);
                        }

                    } else {
                        setContentData(prevContentData => prevContentData.concat(response.data).flat());
                    }
                }
            })

            .catch((error) => {
                return { error: true, msg: error };
            });
    }


    const [hasFetched, setHasFetched] = React.useState(false);

    useFocusEffect(
        React.useCallback(() => {

            if (contentData.length === 0 && !hasFetched) {

                fetchData();
                setHasFetched(true);
            }
            if (stompClient === null) {
                connect();
            }

        }, [usernickname, hasFetched])
    );

    const connect = async () => {
        try {
            if (usernickname !== '') {

                const sockJSFactory = () => new SockJS(global.host_ws);
                stompClient = Stomp.over(sockJSFactory);
                stompClient.connect({}, onConnected, onError);
            }
        } catch (e) {
            return { error: true, msg: (e as any).response.data };
        }
    }

    const onConnected = async () => {

        stompClient.subscribe(`/user/${userId}/queue/messages`, onMessageReceived);

        stompClient.subscribe(`/user/public`, onMessageReceived);
        stompClient.send("/app/chat.addUser",
            {},
            JSON.stringify({ sender: usernickname, type: 'JOIN' })
        )
    }
    const onError = (err) => {
        return { error: true, msg: err };

    }
    const onMessageReceived = async (payload) => {
        var message = JSON.parse(payload.body);
        if (message.content !== null) {
            setContentData(prevContentData => [...prevContentData, message]);
        }
    }
    const sendMessage = async (event) => {
        if (message !== '') {

            const chatMessage = {
                senderId: userId,
                recipientId: partnerId,
                content: message,
                createAt: new Date()
            };
            setContentData(prevContentData => [...prevContentData, chatMessage]);
            stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
            setMessage('');
        }

    }
    const isCloseToTop = ({ contentOffset }) => {
        return contentOffset.y == 0;
    };
    const DraggableContent = ({ children, userid, contentReply }) => {
        const pan = React.useRef(new Animated.ValueXY()).current;
        let dragX = 0;

        pan.x.addListener(({ value }) => dragX = value);

        const panResponder = React.useRef(
            PanResponder.create({
                onMoveShouldSetPanResponder: () => true,
                onPanResponderMove: (e, gestureState) => {
                    Animated.event([null, { dx: pan.x }], { useNativeDriver: false })(e, gestureState);
                },
                onPanResponderRelease: () => {
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: false
                    }).start();


                    if ((dragX <= -50 && userid === userId) || (dragX > 50 && userid !== userId)) {
                        SetReplyMsg(true);
                        SetcontentReply(contentReply)

                    }

                },
            }),
        ).current;

        const panX_sender = pan.x.interpolate({
            inputRange: [-120, 0],
            outputRange: [-120, 0],
            extrapolate: 'clamp'
        });
        const panX_recipientId = pan.x.interpolate({
            inputRange: [0, 120],
            outputRange: [0, 120],
            extrapolate: 'clamp'
        });

        return (userid === userId) ?
            (<Animated.View style={{ transform: [{ translateX: panX_sender }], }}{...panResponder.panHandlers}>{children}</Animated.View>)
            : (<Animated.View style={{ transform: [{ translateX: panX_recipientId }], }}{...panResponder.panHandlers}>{children}</Animated.View>)

    };

    return (
        <View style={{ flex: 1 }}>
            <Header backgroundColor='#A5D4A6' centerComponent={{ text: 'Chatting', style: { fontSize: 25, fontWeight: "bold" } }}
                rightComponent={
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{ padding: 5 }}>
                        <Icon
                            name='info'
                            size={25}
                        />
                    </TouchableOpacity>
                }
            ></Header>
            <Page>
                <ContainerContent
                    ref={scrollViewRef}
                    onContentSizeChange={() => isAtBottom && scrollViewRef.current.scrollToEnd({ animated: true })}
                    onScroll={({ nativeEvent }) => {
                        if (isCloseToTop(nativeEvent)) {
                            setIsAtBottom(false)
                            getChatMessage(contentData[0].createAt, userId, partnerId, true);
                        } else {
                            setIsAtBottom(true)

                        }
                    }}
                >


                    {contentData.map((item, index) => {

                        return (item.senderId == userId) ? (
                            <DraggableContent key={index} userid={item.senderId} contentReply={item.content}>
                                <SendContentAnimatable
                                    animation="fadeInUp"
                                    duration={200}
                                >
                                    <Content>{item.content}</Content>
                                </SendContentAnimatable>
                            </DraggableContent>
                        ) : (
                            <DraggableContent key={index} userid={item.senderId} contentReply={item.content}>

                                <ReplyContentAnimatable
                                    key={index}
                                    animation="fadeInUp"
                                    duration={200}>
                                    <Content>{item.content}</Content>
                                </ReplyContentAnimatable>
                            </DraggableContent>

                        )
                    })}
                
                    {!(contentData.length === 0) ? null :
                        (<View style={{ height: 500, justifyContent: 'center' }}>
                            <ActivityIndicator size="large" color="#00ff00" />
                        </View>)
                    }

                </ContainerContent>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                  
                    <InputChat>
                        <InputMessage
                            style={{ height: 40 }}
                            placeholder="Nhắn tin"
                            value={message}
                            onChangeText={newText => setMessage(newText)}
                        />
                        <SendButton onPress={sendMessage} >
                            <SendIcon
                                source={require('../../assets/icon/submit.png')}
                            />
                        </SendButton>
                    </InputChat>
                </KeyboardAvoidingView>
            </Page>
        </View >
    );
}
export default ChatScreen;
