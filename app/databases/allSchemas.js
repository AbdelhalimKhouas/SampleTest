import Realm from 'realm';

export const USERS_SCHEMA = "userSchema"
export const Users = {
    name: USERS_SCHEMA,
    primaryKey: 'id',
    properties:{
        id: 'int',
        name: {type: 'string', indexed: true},
        avatar: 'string',
    }
} 

const dataBaseOptions = {
    path: 'sampleTest.realm',
    schema: [Users],
    schemaVersion: 1,
}


export const LikeUser = newUser => new Promise((resolve, reject) => {
    Realm.open(dataBaseOptions)
    .then(realm =>{
        realm.write(() => {
            realm.create(USERS_SCHEMA, newUser)
            resolve(newUser)
        });
    }).catch((error) => reject(error))
}); 

export const UnlikeUser = userId => new Promise((resolve, reject) => {
    Realm.open(dataBaseOptions)
    .then(realm =>{
        realm.write(()=>{
            let deletingUser = realm.objectForPrimaryKey(USERS_SCHEMA, userId)
            realm.delete(deletingUser)
            resolve()
        });
    }).catch((error) => reject(error))
}); 

export const GetUsers = () => new Promise((resolve, reject) => {
    Realm.open(dataBaseOptions)
    .then(realm =>{
        realm.write(()=>{
            let allUsers = realm.objects(USERS_SCHEMA)
            resolve(allUsers)
        });
    }).catch((error) => reject(error))
}); 


export const FilterUsers = (userId) => new Promise((resolve, reject) => {
    Realm.open(dataBaseOptions)
    .then(realm =>{
        realm.write(()=>{
            let filteredUsers = realm.objects(USERS_SCHEMA).filtered("id == " +userId).length
            resolve(filteredUsers)
        });
    }).catch((error) => reject(error))
});

export default new Realm (dataBaseOptions)