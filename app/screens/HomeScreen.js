import React,{Component} from 'react';
import {View, ActivityIndicator, FlatList} from 'react-native';
import { SearchBar } from 'react-native-elements';
import UserItemComponent from '../components/UserItemComponent';
import HeaderComponent from '../components/HeaderComponent';
import Toast from 'react-native-easy-toast'
import {users,searchUsers} from '../environment';
// import {LikeUser, GetUsers, UnlikeUser, FilterUsers} from '../databases/allSchemas';
// import realm from '../databases/allSchemas'; 
import styles from '../styles/SearchBarStyle';
import firebase from 'firebase';


export default class HomeScreen extends Component{
    static navigationOptions = {
        title: 'Home',
      };

    constructor(props){
        super(props);
        this.state ={
            dataSource: [],
            isLoading: true,
            isLodingFooter: false,
            offset: 0,
            page: 0,
            search: '',
            refreshing: false,
        }
    }

    componentWillMount(){
        var config = {
            apiKey: "AIzaSyA8TxsvInIAPP1JCXHNXOXzoMkbN-r66xA",
            authDomain: "sampletest-f11d7.firebaseapp.com",
            databaseURL: "https://sampletest-f11d7.firebaseio.com",
            projectId: "sampletest-f11d7",
            storageBucket: "sampletest-f11d7.appspot.com",
            messagingSenderId: "215827999461"
          };
          firebase.initializeApp(config);
        //Load users from api.github.com/users for good UX when seach is empty
        this.fetchUsers(0)
    }

    //fetch users if request = 0 load data from api.github.com/users else load data from api.github.com/search/users
    fetchUsers(request){
        var requestLink = ''
        this.setState({isLodingFooter: true, refreshing: true})
        //Check if the request type is search or pagination to determine the API endpoint to call with the proper params
        request === 0 ? requestLink = users + this.state.offset : requestLink = searchUsers + this.state.search + '&page=' + this.state.page
        return fetch(requestLink)
        .then(response => response.json())
        .then(responseJson => {
            this.setState({
                isLoading: false,
                isLodingFooter: false,
                refreshing: false,
                //fill dataSource with data according to the request type  
                dataSource: request === 0 ? (this.state.offset === 0 ? responseJson : [...this.state.dataSource, ...responseJson])
                            : (this.state.page === 0 ? responseJson.items : [...this.state.dataSource, ...responseJson.items]),
            })
        })
    }
    handleLoadMore = () => {
          this.setState(
            {
              offset: this.state.offset + 30, //get the next 30 rows, in case it is pagination we pass the offset to 'since' see Github V3 Rest API doc
              page: this.state.page + 1, //get the next page, in case it is search 
              refreshing: true,
            },
            () => {
                if(this.state.search === ''){
                    this.fetchUsers(0); 
                }
                else{
                    this.fetchUsers(1);
                }
              
            }
          );
        }
    
    renderUsers = (item) => {
        var heartColor = 'black'
        firebase.database().ref('/users').orderByChild("id").equalTo(item.id).once("value",snapshot => {
            if (snapshot.exists()){
                 heartColor = 'red'//If the user exists in db make the heart red (after refresh)
            }
        });
            return (
                <UserItemComponent
                  avatar={item.avatar_url}
                  userName={item.login}
                  iconColor={heartColor}
                  onPress={()=>this.likeUnlikUser(item)}
                />
              );
      }
      renderFooter = () => {
        if(!this.state.isLodingFooter) return null
        return (
          <View
            style={{
              paddingVertical: 20,
              borderTopWidth: 0
            }}
          >
            <ActivityIndicator animating size="large" color="#08d4fc" />
          </View>
        );
      };

      //Pull to refresh function
      handleRefresh = () =>{
        if(this.state.search === ''){
            this.fetchUsers(0); 
        }
        else{
            this.fetchUsers(1);
        }
      }
    handleRender = () => {
        var i = 0
        if (this.state.isLoading) {
          return (
            <View style={styles.loader}>
              <ActivityIndicator animating size="large" color="#08d4fc" />
            </View>
          );
        } else {
          return (
            <FlatList
              removeClippedSubviews
              data={this.state.dataSource}
              renderItem={({ item }) => this.renderUsers(item)}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => (i++).toString()}
              ListFooterComponent={this.renderFooter}
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
              onEndReached={this.handleLoadMore}
              onEndReachedThreshold={0.5}


            />
          );
        }
      }

      updateSearch = search => {
        this.setState({ 
          search: search,
          page: 0 
        },()=>{
          if(search.length > 2){
            this.fetchUsers(1);
          }
      
        });
      };

      clearSearch = () => {
        this.setState({
          search: '',
          page: 0,
          offset: 0,
        },()=>{
          this.fetchUsers(0);
        })
      }

      likeUnlikUser = (item) =>{
        firebase.database().ref('/users').orderByChild("id").equalTo(item.id).once("value",snapshot => {
            //if the user exists remove from firebase DB on click
            if (snapshot.exists()){
                firebase.database().ref('users/'+item.id).remove();
                this.refs.toast.show('User has been removed succefully',2000);
            }
            //if the user doesn't exist add to firebase DB on click
            else{
                firebase.database().ref('users/'+item.id).set(
                    {
                        id: item.id,
                        name: item.login,
                        avatar: item.avatar_url
                    }
                ).then(() => {
                    this.refs.toast.show('User has been added succefully',2000);
                }).catch((error) => {
                    console.log(error);
                });
            }
        });
        
        //THIS CODE WAS LEFT COMMENTED IN PUPOSE 
        // FilterUsers(item.id).then((count) => {
        //     if (count == 1){
        //         UnlikeUser(item.id)
        //         .then(()=>{
        //             this.refs.toast.show('User has been removed succefully');
        //         })
        //         .catch((error) => {console.log("there has been a problem deleting "+ error)})
        //         //realm.addListener('change',()=>{
                   
        //         //})
        //     }
        //     else if (count == 0){
        //         LikeUser(likedUser).then().catch((error) => {console.log("there has been a problem inserting "+ error)})
        //         realm.addListener('change',()=>{
        //             this.refs.toast.show('User has been added succefully');
        //         })
        //     }
        // })
        // .catch((error) => {console.log(error)})
      }

    render(){
        return(
            <View style={{ flex: 1}}> 
                <HeaderComponent screenTitle={'Home'}/>
                <SearchBar
                    placeholder={"search for users"}
                    onChangeText={this.updateSearch}
                    onClear={this.clearSearch}
                    value={this.state.search}
                    containerStyle={styles.searchContainerStyle}
                    inputContainerStyle={styles.searchInputContainerStyle}
                    placeholderTextColor={'#d2d2d2'}
                />
                {this.handleRender()}
                <Toast ref="toast"/>
            </View>
        )
    }
}