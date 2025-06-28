import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, database } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';

class UserServices {
    // Cache to store display name and photoURL of users.
    private static userCache: Record<string, { displayName: string; photoURL: string }> = {};

    static async register(displayName: string, email: string, password: string): Promise<User> {
        if (displayName === '' || !displayName) {
            throw new Error('Display name cannot be empty.');
        }
        const user = (await createUserWithEmailAndPassword(auth, email, password)).user;

        const photoURL = UserServices.randomPhotoURL(); // TODO: Remove.
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
        return 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70);
    }

    static async getUserDisplayName(uid: string): Promise<string> {
        let userInfo = UserServices.userCache[uid];

        if (!userInfo) {
            // If data is not cached, we query from Firestore.
            const userDoc = await getDoc(doc(database, 'users', uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                // We can cache displayName and photoURL together.
                userInfo = { displayName: data.displayName, photoURL: data.photoURL };
                UserServices.userCache[uid] = userInfo;
            } else {
                return 'Unknown User';
            }
        }

        return userInfo.displayName;
    }

    static async getUserPhotoURL(uid: string): Promise<string> {
        let userInfo = UserServices.userCache[uid];

        if (!userInfo) {
            // If data is not cached, we query from Firestore.
            const userDoc = await getDoc(doc(database, 'users', uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                // We can cache displayName and photoURL together.
                userInfo = { displayName: data.displayName, photoURL: data.photoURL };
                UserServices.userCache[uid] = userInfo;
            } else {
                return '';
            }
        }

        return userInfo.photoURL;
    }

    static async updateUserProfile(uid: string, displayName?: string, photoURL?: string): Promise<void> {
        if (!displayName && !photoURL) {
            return;
        }

        if (displayName === '') {
            throw new Error('Display name cannot be empty.');
        }

        // Updates user's display name and profile picture
        await setDoc(doc(database, 'users', uid),
            {
                displayName,
                photoURL
            });
    }
}

export default UserServices;