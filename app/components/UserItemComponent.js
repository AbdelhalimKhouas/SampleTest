import React,{PureComponent} from 'react';
import {View, Image, Text} from 'react-native';
import { Icon } from "native-base";
import styles from '../styles/UserItemStyles'

export default class UserItemComponent extends PureComponent{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <View style={styles.containerStyle}>
                <Image style={styles.avatar} source={{uri: this.props.avatar}}/>
                <Text style={styles.userName}>{this.props.userName}</Text>
                <Icon name='heart' onPress={this.props.onPress} style={[styles.iconStyle, { fontSize: 25, color: this.props.iconColor }]}/>
            </View>
        )
    }
}