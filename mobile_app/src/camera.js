import React, { useState, useEffect } from "react";
import {
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,Clipboard,ScrollView
    
} from "react-native";
import { Camera } from "expo-camera";
import { Button } from "react-native-paper";
const CameraModule = (props) => {
    const [cameraRef, setCameraRef] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={true}
                onRequestClose={() => {
                    props.setModalVisible();
                }}
            >
                <Camera
                    style={{ flex: 1 }}
                    ratio="16:9"
                    flashMode={Camera.Constants.FlashMode.off}
                    type={type}
                    ref={(ref) => {
                        setCameraRef(ref);
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: "transparent",
                            justifyContent: "flex-end",
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: "black",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Button
                                icon="close"
                                style={{ marginLeft: 12 }}
                                mode="outlined"
                                color="white"
                                onPress={() => {
                                props.setModalVisible();
                                }}
                            >
                                Close
                            </Button>
                        <TouchableOpacity
                                onPress={async () => {
                                    if (cameraRef) {
                                        const options  = {quality:0.5, base64:true}
                                        let photo = await cameraRef.takePictureAsync(options);
                                        const src = photo['base64']

                                        async function fetch_function() {
                                            const response = await fetch("http://192.168.20.156:3000/api/predict",{
                                                            mode: 'no-cors',
                                                            method: "POST",
                                                            headers: {
                                                                'Accept': 'application/json',
                                                                'Content-Type': 'application/json'
                                                            },
                                                            body: JSON.stringify({
                                                                "url": "http://192.168.20.156:3000/api/predict",
                                                                "src":  JSON.stringify(src),
                                                                "name": "fetch_image"
                                                                })
                                                            })
                                            let result = await response.json();
                                            result = result['text'];
                                            result = JSON.stringify(result); 
                                            return result
                                    }
                                    async function call_fetch()
                                    {
                                        let photo = await fetch_function()
                                        props.setImage(photo);

                                    }
                                    call_fetch();
                                    props.setModalVisible();

                                        
                                        // .then(function(res){
                                        //     return res.json();
                                        // }).then(function(data){ 
                                        //     result = JSON.stringify(data);
                                        //     console.log(result);
                                            // props.setImage(String (result['text']));
                                        //     return result; 
                                        // })
                                         // props.setImage(photo);
                                    }
                                }}
                            >
                                <View
                                    style={{
                                        borderWidth: 2,
                                        borderRadius: 50,
                                        borderColor: "white",
                                        height: 50,
                                        width: 50,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginBottom: 16,
                                        marginTop: 16,
                                    }}
                                >
                                    <View
                                        style={{
                                            borderWidth: 2,
                                            borderRadius: 50,
                                            borderColor: "white",
                                            height: 40,
                                            width: 40,
                                            backgroundColor: "white",
                                        }}
                                    ></View>
                                </View>
                            </TouchableOpacity>
                            <Button
                                icon="axis-z-rotate-clockwise"
                                style={{ marginRight: 12 }}
                                mode="outlined"
                                color="white"
                                onPress={() => {
                                    setType(
                                        type === Camera.Constants.Type.back
                                            ? Camera.Constants.Type.front
                                            : Camera.Constants.Type.back
                                    );
                                }}
                            >
                        {type === Camera.Constants.Type.back ? "Front" : "Back "}
                            </Button>
                        </View>
                    </View>
                </Camera>
            </Modal>
        );
    };


    
export default function ImagePickerExample() {
    const [image, setImage] = useState(null);
    const [camera, setShowCamera] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    /* biến chứa nội dung của ảnh sau khi lấy từ API về */
    var content_file = image
    /*copy text */
    const [copiedText, setCopiedText] = useState('')

    const copyToClipboard = () => {
        Clipboard.setString(content_file)
    }

    const fetchCopiedText = async () => {
        const text = await Clipboard.getString()
        setCopiedText(text)
    }

    useEffect(() => {
            (async () => {
                const { status } = await Camera.requestPermissionsAsync();
                setHasPermission(status === "granted");
            })();
        }, []);
    if (hasPermission === null) {
            return <View />;
        }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
        }
    // console.log("image: ", image) /*biến lưu path chứa anh*/
    return (
        
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ScrollView>
                <View
                    style={{
                        backgroundColor: "#eeee",
                        width: 393,
                        flex:1, 
                    }}
                >
                    
                    <Text style={{margin: 35,borderRadius: 4,paddingHorizontal: 8, paddingVertical: 6, alignSelf: 'center',fontSize: 30,color:'#FFFFFF',fontWeight: 'bold',backgroundColor: '#6600FF'}}>
                        OCR cho tiếng Việt                    
                    </Text>
                    {/* <Text style={{fontSize:20 ,margin: 5, fontWeight: 'bold', padding: 1}}>
                        Chào mừng đến với ứng dụng OCR cho tiếng Việt
                    </Text> */}
                                 


                    <Text style={{fontSize: 25, fontWeight: 'bold', margin: 5}}>Nội dung trong ảnh:</Text>

                    <Text style={{fontSize: 20, margin: 5}}>
                        {content_file}
                    </Text>
                    <TouchableOpacity onPress={() => copyToClipboard()}>
                        <Text style={{margin: 35,fontSize:20 ,borderRadius: 4,paddingHorizontal: 8, paddingVertical: 6,margin: 5,color:'#FFFFFF', fontWeight: 'bold', padding: 1,alignSelf: 'center',backgroundColor: '#6600FF'}}>Sao chép nội dung</Text>
                    </TouchableOpacity>
                    {/* <Image                
                        source={{ uri: image }}
                        style={{ flex:1}}
                    /> */}
                </View>
            </ScrollView>
                <Button
                    style={{ width: "30%", marginTop: 16 }}
                    icon="camera"
                    mode="contained"
                    onPress={() => {
                        setShowCamera(true);
                    }}
                >
                    Camera
                </Button>
            {camera && (
                    <CameraModule
                        showModal={camera}                        
                        setModalVisible={() => setShowCamera(false)}
                        setImage={(result) => setImage(result)}
                    />
                )}
            </View>
            
        );
    
    }