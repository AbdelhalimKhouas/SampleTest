import { StyleSheet } from 'react-native';
const styles =  StyleSheet.create({
    containerStyle: {
        //flex: 1,
        backgroundColor: "#FFF",
        flexDirection: 'row',
        elevation: 8,
        margin: 5,
        padding: 10,
        borderRadius:5,
        justifyContent: 'center',
        alignItems:'center',
       
      },
      avatar: {
        width: 50,
        height: 50,
        marginRight: 10,
      },
      userName: {
        flex: 1
      },
      iconStyle: {
        fontSize: 20,
        marginRight: 10,
      },
});
export default styles