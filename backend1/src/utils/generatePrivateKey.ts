const generatePrivateKey = ():String => {
    const privateKey:Number=Math.floor((Math.random()*10000)+1)
    return privateKey.toString();
}
export default generatePrivateKey;