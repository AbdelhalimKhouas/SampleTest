import React,{Component} from 'react';
import {View, FlatList} from 'react-native';
import UserItemComponent from '../components/UserItemComponent';
import HeaderComponent from '../components/HeaderComponent';
import Toast from 'react-native-easy-toast';
import firebase from 'firebase';
// import {LikeUser, GetUsers, UnlikeUser, FilterUsers} from '../databases/allSchemas';
// import realm from '../databases/allSchemas';

export default class BookmarkedScreen extends Component{
    static navigationOptions = {
        title: 'Bookmared',
      };
    constructor(props){
        super(props);
        this.state ={
            dataSource: [],
            refreshing: false,
        }
    }   
    
    componentWillMount(){
      this.fetchFromDb();
    }
    fetchFromDb = () => {
        this.setState({
            refreshing: true,
            loading: true,
        })
        // GetUsers().then((users) => {
        //         this.setState({
        //             dataSource : users,
        //             refreshing: false,
        //         })

        // }).catch((error)=>{console.log(error)})
        firebase.database().ref('/users').on('value', (snapshot) => {
          let data = snapshot.val();
          if (snapshot.val() !== null){
            var users = Object.values(data);
          }
          else{
            var users = []
          }
          this.setState({
            dataSource: users,
            refreshing: false,
          });
      })
    }
    unlikUser = (item) =>{
      firebase.database().ref('users/'+item.id).remove();
      this.refs.toast.show('User has been removed succefully',2000);
        // UnlikeUser(item.id).then().catch((error) => {console.log("there has been a problem deleting "+ error)})
        // realm.addListener('change',()=>{
        //     this.refs.toast.show('User has been removed succefully');
        //     this.setState({
        //       refreshing: true
        //     })
        //     // GetUsers().then((users) => {
        //     //   this.refs.toast.show('called');
    
        //     //         this.setState({
        //     //             dataSource : users
        //     //         })
    
        //     // }).catch((error)=>{console.log(error)})
        // })
      }
    renderUsers = (item) => {
        return (
          <UserItemComponent
            avatar={item.avatar}
            userName={item.name}
            iconColor={'red'}
            onPress={()=>this.unlikUser(item)}
          />
        );
      }
    handleRefresh = () =>{
      this.fetchFromDb()
    }
    handleRender = () => {
        if (this.state.isLoading) {
          return (
            <View style={styles.loader}>
              <ActivityIndicator animating size="large" color="red" />
            </View>
          );
        } else {
          return (
            <FlatList
              removeClippedSubviews
              data={this.state.dataSource}
              renderItem={({ item }) => this.renderUsers(item)}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.id.toString()}
              onRefresh={this.handleRefresh}
              refreshing={this.state.refreshing}
            />
          );
        }
      }
    render(){
        return(
            <View style={{flex:1}}>
                <HeaderComponent screenTitle={'Bookmarked'}/>
                {this.handleRender()}
                <Toast ref="toast"/>
            </View>
        )
    }
}