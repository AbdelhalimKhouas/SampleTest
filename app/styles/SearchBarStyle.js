import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get("window");
const fullWidth = width;

const styles =  StyleSheet.create({
    loader:{
        alignItems: "center",
        justifyContent: "center",
        flex: 1
    },  
      searchContainerStyle: {
        backgroundColor: "transparent",
        borderTopWidth: 0,
        borderBottomWidth: 0,
        //elevation: 8
      },
      searchInputContainerStyle:{
          backgroundColor: "white",
          elevation: 2,
      },
      scrollingMenuStyle:{ 
          padding: 15,
          alignSelf: "flex-start", 
          flexDirection: "row", 
          flexGrow: 0, 
          flexShrink: 0 ,
          borderRadius: 0,
          
    },
});
export default styles