
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { GoogleUser, AuthContextType } from '../types';

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

// --- CONFIGURACIÓN ---
// IMPORTANTE: Reemplaza esto con tu Client ID real obtenido de Google Cloud Console
// https://console.cloud.google.com/apis/credentials
const CLIENT_ID = 'PON_TU_CLIENT_ID_AQUI.apps.googleusercontent.com'; 
const SCOPES = 'https://www.googleapis.com/auth/drive.file email profile';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [tokenClient, setTokenClient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDriveReady, setIsDriveReady] = useState(false);

  // Inicializar Google Identity Services y GAPI
  useEffect(() => {
    const initializeGoogle = async () => {
      if (typeof window === 'undefined') return;

      // Esperar a que los scripts se carguen
      const waitForScripts = () => {
        return new Promise<void>((resolve) => {
          const check = () => {
            if (window.google?.accounts?.oauth2 && window.gapi) {
              resolve();
            } else {
              setTimeout(check, 100);
            }
          };
          check();
        });
      };

      try {
        await waitForScripts();

        // 1. Inicializar Token Client (Identity Services)
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: (response: any) => {
            if (response.error !== undefined) {
              throw (response);
            }
            // Al recibir el token, obtener info del usuario
            fetchUserProfile(response.access_token);
            setIsDriveReady(true);
          },
        });
        setTokenClient(client);

        // 2. Inicializar GAPI Client (para hacer llamadas a Drive)
        window.gapi.load('client', async () => {
          try {
            await window.gapi.client.init({
                // API Key no es estrictamente necesaria si usamos solo flujo implícito con token, 
                // pero GAPI init lo suele pedir. Para este caso simple de Drive, 
                // la autorización OAuth es lo crítico.
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
            });
          } catch(e) {
              console.warn("Error inicializando GAPI client (probablemente falta API Key o Client ID inválido)", e);
          }
        });

        // Intentar recuperar sesión previa (simulado, ya que el token expira)
        const storedUser = localStorage.getItem('google_user');
        if (storedUser) {
           setUser(JSON.parse(storedUser));
        }

      } catch (error) {
        console.error("Error initializing Google Auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeGoogle();
  }, []);

  const fetchUserProfile = async (accessToken: string) => {
      try {
          const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${accessToken}` }
          });
          const data = await response.json();
          const userData: GoogleUser = {
              name: data.name,
              email: data.email,
              picture: data.picture
          };
          setUser(userData);
          localStorage.setItem('google_user', JSON.stringify(userData));
      } catch (e) {
          console.error("Error fetching user profile", e);
      }
  };

  const login = useCallback(() => {
    if (CLIENT_ID.includes('PON_TU_CLIENT_ID')) {
        alert("Error de Configuración: Debes configurar un CLIENT_ID válido en contexts/AuthContext.tsx para usar Google Auth.");
        return;
    }
    if (tokenClient) {
      // Solicita permiso. Si el usuario ya autorizó, puede que lo salte o pida re-confirmar.
      tokenClient.requestAccessToken({ prompt: 'consent' });
    }
  }, [tokenClient]);

  const logout = useCallback(() => {
    const token = window.gapi?.client?.getToken();
    if (token && window.google?.accounts?.oauth2) {
        window.google.accounts.oauth2.revoke(token.access_token, () => {});
    }
    window.gapi?.client?.setToken(null);
    setUser(null);
    setIsDriveReady(false);
    localStorage.removeItem('google_user');
  }, []);

  const uploadFileToDrive = async (content: string, filename: string, mimeType: string) => {
      if (!isDriveReady || !user) {
          throw new Error("Usuario no autenticado o API no lista.");
      }

      try {
        // Metadatos del archivo
        const metadata = {
            name: filename,
            mimeType: mimeType,
        };

        // Cuerpo del archivo
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        const multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: ' + mimeType + '\r\n\r\n' +
            content +
            close_delim;

        const request = window.gapi.client.request({
            'path': '/upload/drive/v3/files',
            'method': 'POST',
            'params': {'uploadType': 'multipart'},
            'headers': {
            'Content-Type': 'multipart/related; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody
        });

        await request;
        // Si no lanza error, fue exitoso
      } catch (e: any) {
          console.error("Error subiendo a Drive", e);
          if (e.status === 401) {
             // Token expirado
             logout();
             throw new Error("La sesión expiró. Por favor inicia sesión nuevamente.");
          }
          throw new Error("Error al subir el archivo a Google Drive.");
      }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, uploadFileToDrive, isDriveReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
