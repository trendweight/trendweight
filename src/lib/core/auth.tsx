import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { setDefaultFetchOptions } from "~/lib/api/fetch";
import firebase, { auth } from "~/lib/firebase";

interface User {
  uid: string;
  email: string | null;
  token: string;
}

const authContext = createContext<ReturnType<typeof useCreateAuth> | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useCreateAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = () => {
  const auth = useContext(authContext);
  if (!auth) {
    throw new Error("Called useAuth() when the provider is not present.");
  }
  return auth;
};

export const useCreateAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const handleUserChange = async (rawUser: firebase.User | null) => {
    if (rawUser) {
      const { uid, email } = rawUser;
      const token = await rawUser.getIdToken();
      const user: User = { uid, email, token };
      console.log("user", user);
      setUser(user);
      setDefaultFetchOptions({ token }, true);
      return user;
    } else {
      setUser(null);
      setDefaultFetchOptions({ token: null });
      return null;
    }
  };

  const signInWithPassword = async (email: string, password: string) => {
    const { user } = await auth.signInWithEmailAndPassword(email, password);
    handleUserChange(user);
  };

  const signOut = async () => {
    await auth.signOut();
    handleUserChange(null);
  };

  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      if (user) {
        await handleUserChange(user);
      } else {
        await handleUserChange(null);
      }
      setIsInitializing(false);
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
