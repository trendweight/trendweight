import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { createUser } from "./db";
import firebase from "./firebase";

const authContext = createContext<ReturnType<typeof useProviderAuth> | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useProviderAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = () => {
  return useContext(authContext)!;
};

const formatUser = (user: firebase.User) => {
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    provider: user.providerData[0]?.providerId,
  };
};

type User = ReturnType<typeof formatUser>;

export const useProviderAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const handleUser = (rawUser: firebase.User | null) => {
    if (rawUser) {
      const user = formatUser(rawUser);
      createUser(user.uid, user);
      setUser(user);
      return user;
    } else {
      setUser(null);
      return null;
    }
  };

  const signInWithPassword = async (email: string, password: string) => {
    const { user } = await firebase.auth().signInWithEmailAndPassword(email, password);
    handleUser(user);
  };

  const signOut = async () => {
    await firebase.auth().signOut();
    handleUser(null);
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        handleUser(user);
      } else {
        handleUser(null);
      }
      if (isInitializing) {
        setIsInitializing(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    isInitializing,
    user,
    signInWithPassword,
    signOut,
  };
};
