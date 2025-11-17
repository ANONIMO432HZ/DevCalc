import React, { useState, useEffect, useCallback, useRef } from 'react';
import CryptoJS from 'crypto-js';
import TextareaGroup from './TextareaGroup';
import InputGroup from './InputGroup';

// Helper para convertir un ArrayBuffer a una cadena hexadecimal
const bufferToHex = (buffer: ArrayBuffer): string => {
  return [...new Uint8Array(buffer)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

const detectHashType = (hash: string): string => {
    const trimmedHash = hash.trim().toLowerCase();
    if (!/^[a-f0-9]+$/.test(trimmedHash)) {
        return 'Desconocido';
    }
    switch (trimmedHash.length) {
        case 32: return 'MD5';
        case 40: return 'SHA-1';
        case 64: return 'SHA-256';
        case 128: return 'SHA-512';
        default: return 'Desconocido';
    }
};


const HashGenerator: React.FC = () => {
    const [input, setInput] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [md5, setMd5] = useState('');
    const [sha1, setSha1] = useState('');
    const [sha256, setSha256] = useState('');
    const [sha512, setSha512] = useState('');
    const [isHashing, setIsHashing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [detectedType, setDetectedType] = useState('Desconocido');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const clearHashes = () => {
        setMd5('');
        setSha1('');
        setSha256('');
        setSha512('');
    };
    
    const clearAll = useCallback(() => {
        setInput('');
        setFile(null);
        clearHashes();
        setError(null);
        setDetectedType('Desconocido');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    // Efecto para el hash de texto y detección de tipo
    useEffect(() => {
        setError(null);
        setDetectedType(detectHashType(input));
        
        if (file || input.trim() === '') {
            if (!file && input.trim() === '') clearHashes();
            return;
        }

        const calculateTextHashes = async () => {
            setIsHashing(true);
            try {
                setMd5(CryptoJS.MD5(input).toString());
                
                const encoder = new TextEncoder();
                const data = encoder.encode(input);

                const [hash1, hash256, hash512] = await Promise.all([
                    crypto.subtle.digest('SHA-1', data),
                    crypto.subtle.digest('SHA-256', data),
                    crypto.subtle.digest('SHA-512', data),
                ]);

                setSha1(bufferToHex(hash1));
                setSha256(bufferToHex(hash256));
                setSha512(bufferToHex(hash512));
            } catch (err) {
                console.error("Error al generar hash:", err);
                setError('Ocurrió un error al calcular los hashes del texto.');
                clearHashes();
            } finally {
                setIsHashing(false);
            }
        };
        
        const handler = setTimeout(calculateTextHashes, 250);
        return () => clearTimeout(handler);
    }, [input, file]);

    // Efecto para el hash de archivos
    useEffect(() => {
        if (!file) return;
        
        setError(null);

        const calculateFileHashes = () => {
            setIsHashing(true);
            clearHashes();
            setDetectedType('N/A (Archivo)');
            const reader = new FileReader();
            
            reader.onload = async (event) => {
                try {
                    const arrayBuffer = event.target?.result as ArrayBuffer;
                    if (!arrayBuffer) throw new Error("No se pudo leer el archivo.");

                    const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
                    setMd5(CryptoJS.MD5(wordArray).toString());

                    const [hash1, hash256, hash512] = await Promise.all([
                        crypto.subtle.digest('SHA-1', arrayBuffer),
                        crypto.subtle.digest('SHA-256', arrayBuffer),
                        crypto.subtle.digest('SHA-512', arrayBuffer),
                    ]);

                    setSha1(bufferToHex(hash1));
                    setSha256(bufferToHex(hash256));
                    setSha512(bufferToHex(hash512));
                } catch (err) {
                    console.error("Error al generar hash del archivo:", err);
                    setError("Error al procesar el archivo. Puede que sea demasiado grande o esté corrupto.");
                    clearHashes();
                } finally {
                    setIsHashing(false);
                }
            };

            reader.onerror = () => {
                console.error("Error al leer el archivo.");
                setError("Ocurrió un error al leer el archivo.");
                clearHashes();
                setIsHashing(false);
            };

            reader.readAsArrayBuffer(file);
        };

        calculateFileHashes();
    }, [file]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        setError(null);
        if (file) {
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [file]);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setInput('');
            setError(null);
        }
    };
    
    const handleFileButtonClick = () => fileInputRef.current?.click();
    
    const clearFile = () => {
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setDetectedType('Desconocido');
        setError(null);
    };

    const noOp = () => {};

    return (
        <div className="space-y-6">
            <TextareaGroup
                id="hash-input"
                label="Entrada de Texto"
                value={input}
                onChange={handleInputChange}
                placeholder="Escribe texto aquí o selecciona un archivo abajo..."
                rows={5}
                disabled={!!file}
            />

            <div className="border border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 text-center">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                {!file ? (
                    <>
                        <p className="text-slate-500 dark:text-slate-400 mb-2 text-sm">o</p>
                        <button onClick={handleFileButtonClick} className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-2 px-4 rounded-md transition-colors duration-200">
                            Seleccionar un Archivo
                        </button>
                    </>
                ) : (
                    <div className="text-left text-sm flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">{file.name}</p>
                            <p className="text-slate-500 dark:text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                        <button onClick={clearFile} className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-semibold text-sm">
                            Quitar
                        </button>
                    </div>
                )}
            </div>
            
            {error && <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>}

            <div className="space-y-4">
                <InputGroup id="detected-hash-type" label="Tipo de Hash Detectado" value={detectedType} onChange={noOp} placeholder="El tipo se detectará aquí" readOnly />
                <hr className="border-slate-300 dark:border-slate-700" />
                <InputGroup id="md5-output" label="MD5" value={md5} onChange={noOp} placeholder={isHashing ? 'Calculando...' : ''} readOnly />
                <InputGroup id="sha1-output" label="SHA-1" value={sha1} onChange={noOp} placeholder={isHashing ? 'Calculando...' : ''} readOnly />
                <InputGroup id="sha256-output" label="SHA-256" value={sha256} onChange={noOp} placeholder={isHashing ? 'Calculando...' : ''} readOnly />
                <InputGroup id="sha512-output" label="SHA-512" value={sha512} onChange={noOp} placeholder={isHashing ? 'Calculando...' : ''} readOnly />
            </div>

            <div className="flex justify-end">
                 <button 
                    onClick={clearAll}
                    className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-2 px-4 rounded-md transition-colors duration-200"
                >
                    Limpiar Todo
                </button>
            </div>
        </div>
    );
};

export default HashGenerator;