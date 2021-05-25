import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { setDefaultFetchOptions } from "~/lib/api/fetch";
import firebase, { getAuth } from "~/lib/firebase";

interface User {
  uid: string;
  email: string | null;
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
      const user: User = { uid, email };
      let { token, expirationTime } = await rawUser.getIdTokenResult();
      const getToken = async () => {
        const now = new Date().getTime();
        const expiration = new Date(expirationTime).getTime();
        // now + 300000 ms is 5 minutes from now
        if (now + 300000 > expiration) {
          const newTokenResult = await rawUser.getIdTokenResult();
          token = newTokenResult.token;
          expirationTime = newTokenResult.expirationTime;
        }
        return token;
      };
      setDefaultFetchOptions({ getToken }, true);
      setUser(user);
      return user;
    } else {
      setDefaultFetchOptions({ getToken: async () => null });
      setUser(null);
      return null;
    }
  };

  const signInWithPassword = async (email: string, password: string) => {
    const auth = await getAuth();
    const { user } = await auth.signInWithEmailAndPassword(email, password);
    handleUserChange(user);
  };

  const signOut = async () => {
    const auth = await getAuth();
    await auth.signOut();
    handleUserChange(null);
  };

  useEffect(() => {
    let unsubscribe: firebase.Unsubscribe | undefined = undefined;
    const subscribe = async () => {
      const auth = await getAuth();
      unsubscribe = auth.onIdTokenChanged(async (user) => {
        if (user) {
          await handleUserChange(user);
        } else {
          await handleUserChange(null);
        }
        setIsInitializing(false);
      });
    };
    subscribe();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isInitializing,
    isLoggedIn: !!user,
    user,
    signInWithPassword,
    signOut,
  };
};
