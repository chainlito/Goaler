import app, { auth } from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
// Initialize Firebase
const config = {
    apiKey: process.env.REACT_APP_FIREBASE_apiKey,
    authDomain: process.env.REACT_APP_FIREBASE_authDomain,
    databaseURL: process.env.REACT_APP_FIREBASE_databaseURL,
    projectId: process.env.REACT_APP_FIREBASE_projectId,
    storageBucket: process.env.REACT_APP_FIREBASE_storageBucket,
    messagingSenderId: process.env.REACT_APP_FIREBASE_messagingSenderId
};

class Firebase {
    constructor() {
        app.initializeApp(config);
        this.auth = app.auth();
        this.db = app.firestore();
        // const settings = {/* your settings... */ timestampsInSnapshots: true};
        this.db.settings({});
        // this.userRef = null;
        // this.goalsRef = null;
    }
    signIn = () => {
        const provider = new auth.GoogleAuthProvider();
        return this.auth.signInWithRedirect(provider).catch(err => console.log(err));
        // return this.auth.signInWithPopup(provider).catch(err => console.log(err));
    }
    logout = () => {
        return this.auth.signOut();
    }
    redirect = () => {
        return this.auth.getRedirectResult();
    }
    initializeUser = (uid) => {
        this.goalsRef = this.db.collection(`users/${uid}/goals`);
        this.settingsRef = this.db.collection(`users/${uid}/settings`)
        // this.db.collection(`users/${uid}/goals/${goalid}/subgoals`);
        // this.goalsRef = this.userRef.collection("goals");
    }
}

export default Firebase;