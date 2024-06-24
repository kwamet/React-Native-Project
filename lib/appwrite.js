import { Client, Account, ID, Avatars, Databases, Query, Storage } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.jsm.aora868',
    projectId: '6676b842001f039f153d',
    databaseId: '6676b9a6001ae5a2026f',
    userCollectionId: '6676b9f40014f869d90b',
    videoCollectionId: '6676ba39002b33e25c15',
    storageId: '6676bbbd002f6722120b',
}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId,
} = appwriteConfig;

const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) 
    .setProject(appwriteConfig.projectId) 
    .setPlatform(appwriteConfig.platform) 
;


const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username,
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        );
        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export async function signIn(email, password) {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );
        if (!currentUser) throw Error;
        return currentUser.documents[0];
        
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export async function getAllPosts(){
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt')]
        );
        return posts.documents;
        
    } catch (error) {
        throw new Error(error);
    }
}

export async function getTrendingPosts(){
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        );
        return posts.documents;
        
    } catch (error) {
        throw new Error(error);
    }
}

export async function searchPosts(query){
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('title', query)]
        );
        
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getUserPosts(userId){
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('users', userId)]
        );
        
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export async function signOut(){
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getFilePreview(fileId, type){
    let fileUrl;

    try {
        if(type === 'video'){
            fileUrl = await storage.getFileView(storageId, fileId);
        }else if(type === 'image'){
            fileUrl = await storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100);
        }else{
            throw new Error('Invalid file type');
        }
        if(!fileUrl) throw Error;
        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export async function uploadFile(file, type){
    if(!file) throw new Error('No file provided');
    const { mimeType, ...rest } = file;
    const asset =  {
        name: file.name,
        type: mimeType,
        size: file.size,
        uri: file.uri,
    }
    
    try {
        const uploadedFile = await storage.createFile(
            storageId, 
            ID.unique(), 
            asset
        );
        const fileUrl = await getFilePreview(uploadedFile.$id, type);
        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export async function createVideo(form){
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video')
        ])
        const newPost = await databases.createDocument(
            databaseId,
            videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                prompt: form.prompt,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                users: form.userId
            }
        );
        return newPost;
    } catch (error) {
        throw new Error(error);
    }
}