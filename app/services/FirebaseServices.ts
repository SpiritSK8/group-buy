import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, database } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, User } from 'firebase/auth';

class FirebaseServices {
    static async register(displayName: string, email: string, password: string): Promise<User> {
        if (displayName === '' || !displayName) {
            throw new Error('Display name cannot be empty.');
        }
        const user = (await createUserWithEmailAndPassword(auth, email, password)).user;

        const photoURL = FirebaseServices.randomPhotoURL(); // TODO: Remove.
        await updateProfile(user, {
            displayName: displayName,
            photoURL: photoURL // TODO: Remove.
        })

        // Updates user's display name and profile picture
        await setDoc(doc(database, 'users', user.uid),
            {
                displayName,
                photoURL
            });

        return user;
    }

    static async login(email: string, password: string): Promise<User> {
        const user = (await signInWithEmailAndPassword(auth, email, password)).user;
        return user;
    }

    static async logout(): Promise<void> {
        await signOut(auth);
    }

    static randomPhotoURL(): string {
        return "https://i.pravatar.cc/150?img=" + Math.floor(Math.random() * 70);
    }

    static async getUserDisplayName(uid: string): Promise<string> {
        const userDoc = await getDoc(doc(database, 'users', uid));
        if (userDoc.exists()) {
            const data = userDoc.data();
            return data.displayName;
        }
        return 'Unknown User';
    }

    static async getUserPhotoURL(uid: string): Promise<string> {
        const userDoc = await getDoc(doc(database, 'users', uid));
        if (userDoc.exists()) {
            const data = userDoc.data();
            return data.photoURL;
        }
        return '';
    }
}

export default FirebaseServices;