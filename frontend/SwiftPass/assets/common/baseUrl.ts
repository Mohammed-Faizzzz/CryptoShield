import { Platform } from 'react-native'


let baseURL: string = '';

{Platform.OS == 'android'
? baseURL = 'http://10.0.2.2:3000/api/'
: baseURL = 'http://localhost:3000/api/'
}

export default baseURL;