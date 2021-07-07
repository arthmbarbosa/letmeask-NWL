import { createContext, ReactNode, useState, useEffect } from "react";
import { auth, firebase } from "../services/firebase";

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);


export function AuthContextProvider(props: AuthContextProviderProps) {

  const [user, setUser] = useState<User>();

  //função que executa quando um evento acontecer. Usada para exibir as dados de login do usuário em outras telas
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid } = user

        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account.');
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        })
      }
    })


    return () => {
      unsubscribe();
    }

  }, [user])

  async function signInWithGoogle() {
    console.log('Entes provider')
    const provider = new firebase.auth.GoogleAuthProvider();
    console.log(provider)
    const result = await auth.signInWithPopup(provider);
    console.log(result)
    if (result.user) {
      const { displayName, photoURL, uid } = result.user

      if (!displayName || !photoURL) {
        throw new Error('Missing information from Google Account.');
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      })

    }

  }
  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  );
}