import { ImagePicker } from 'expo';
import Rutas from './Rutas';
import { AsyncStorage } from 'react-native';
import CryotoJs from 'crypto-js';

export async function setDatos(Data, Key) {
    return await AsyncStorage.setItem(Key, CryotoJs.AES.encrypt(JSON.stringify(Data), Rutas.KeyEncriptar));
}

export async function getDatos(Key) {
    return new Promise((resolve, reject) => {
        await AsyncStorage.getItem(Key).then(User => {
            var bytes = CryptoJs.AES.decrypt(User, Rutas.KeyEncriptar);
            var decryptedData = JSON.parse(bytes.toString(CryptoJs.enc.Utf8));
            resolve(decryptedData);
        }).catch(err => {
            reject();
        })
    })
}

export async function RegistrarUser(Usuario) {
    return PostSinToken(Rutas.Registrar, Usuario);
}

export async function LoginUser(Usuario) {
    return PostSinToken(Rutas.Login, Usuario);
}

export async function Restablecer(Email) {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({Email: Email}),
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
        }).then(json => json.json()).then(user => {
            user.Error ? reject(user.Error) : resolve(user);
        }).catch(err => {
            reject('Ha ocurrido un error vuelva a intentar');
        })
    });
}

function PostSinToken(url, Data) {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(Data),
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
        }).then(json => json.json()).then(user => {
            user.Error ? reject(user.Error) : resolve(user);
        }).catch(err => {
            reject('Ha ocurrido un error vuelva a intentar');
        })
    });
}

export async function CambiarImagen() {
    return new Promise((resolve, reject) => {
        try {
            let result = ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [1, 1],
                mediaTypes: 'Images'
            });
            if (!result.cancelled) {
                result.then(img => {
                    resolve(fetchImg(img));
                }).catch(() => {
                    reject({ message: 'Ha ocurrido un error vuelva a intentar' });
                })
            }
        } catch (error) {
            reject({ message: 'Ha ocurrido un error vuelva a intentar' });
        }
    })
}

function fetchImg(img) {
    return new Promise((resolve, reject) => {
        fetch(img.uri).then(res => {
            res.blob().then(blob => {
                resolve(SubirFoto(blob));
            }).catch(() => {
                reject({ message: 'Ha ocurrido un error vuelva a intentar' });
            })
        }).catch(() => {
            reject({ message: 'Ha ocurrido un error vuelva a intentar' });
        })
    })
}


