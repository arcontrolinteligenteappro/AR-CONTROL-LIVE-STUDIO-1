import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, Lock, ShieldCheck, X } from 'lucide-react';

interface LoginModalProps {
    platformName: string;
    permissions: string[];
    onSuccess: () => void;
    onCancel: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ platformName, permissions, onSuccess, onCancel }) => {
    const [step, setStep] = useState<'REDIRECT' | 'AUTH' | 'SUCCESS'>('REDIRECT');

    useEffect(() => {
        let timer: any;
        
        // Step 1: Redirecting to Platform
        if (step === 'REDIRECT') {
            timer = setTimeout(() => {
                setStep('AUTH');
            }, 1500);
        }

        // Step 2: Simulating User Login / Permission Grant
        if (step === 'AUTH') {
            timer = setTimeout(() => {
                setStep('SUCCESS');
            }, 2000);
        }

        // Step 3: Success & Close
        if (step === 'SUCCESS') {
            timer = setTimeout(() => {
                onSuccess();
            }, 1000);
        }

        return () => clearTimeout(timer);
    }, [step, onSuccess]);

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white text-black rounded-xl max-w-sm w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300 relative">
                
                {/* Close Button (only available early) */}
                {step === 'REDIRECT' && (
                    <button onClick={onCancel} className="absolute top-2 right-2 p-2 text-zinc-400 hover:text-black">
                        <X className="w-5 h-5" />
                    </button>
                )}

                <div className="p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
                    
                    {/* Platform Logo / Icon Placeholder */}
                    <div className="mb-6">
                        {step === 'SUCCESS' ? (
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in spin-in-12">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                        ) : (
                            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center animate-pulse">
                                <Lock className="w-8 h-8 text-zinc-400" />
                            </div>
                        )}
                    </div>

                    <h2 className="text-xl font-bold mb-2">
                        {step === 'REDIRECT' && `Contactando a ${platformName}...`}
                        {step === 'AUTH' && `Autenticando...`}
                        {step === 'SUCCESS' && `¡Conectado!`}
                    </h2>

                    <p className="text-zinc-500 text-sm mb-6 px-4">
                        {step === 'REDIRECT' && "Te estamos redirigiendo para iniciar sesión de forma segura."}
                        {step === 'AUTH' && "Validando credenciales y permisos de transmisión."}
                        {step === 'SUCCESS' && `Regresando a ARControl Sport.`}
                    </p>

                    {/* Permission List */}
                    {step === 'AUTH' && (
                        <div className="w-full bg-zinc-50 p-3 rounded text-left mb-4 border border-zinc-200">
                            <div className="text-[10px] uppercase font-bold text-zinc-400 mb-2">Permisos Solicitados:</div>
                            {permissions.map((perm, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs font-medium text-zinc-700 py-0.5">
                                    <ShieldCheck className="w-3 h-3 text-blue-500" /> {perm}
                                </div>
                            ))}
                        </div>
                    )}

                    {step !== 'SUCCESS' && (
                        <div className="flex items-center justify-center gap-2 text-zinc-400 text-xs mt-4">
                            <Loader2 className="w-4 h-4 animate-spin" /> Procesando
                        </div>
                    )}
                </div>
                
                {/* Mock Browser URL Bar */}
                <div className="bg-zinc-100 p-2 border-t border-zinc-200 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-zinc-300"></div>
                    <div className="flex-1 bg-white border border-zinc-200 rounded px-2 py-1 text-[10px] text-zinc-400 font-mono truncate">
                        https://auth.{platformName.toLowerCase()}.com/oauth2/authorize?client_id=arcontrol...
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;