'use client';
import { authenticate } from "@/actions/auth/login";
import { useEffect } from "react";
import { useFormState } from "react-dom";

export const LoginForm = () => {

    const [state, dispatch] = useFormState(authenticate, undefined);

    useEffect(() => {
        if (state === 'Success') {
            window.location.replace('/admin');
        }
    }, [state]);

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2 className="modal-title">Iniciar Sesión</h2>
                <p className="modal-subtitle">
                    Introduce estos datos para iniciar sesión como administrador
                </p>
                <form action={dispatch} className="login-form">
                    <label htmlFor="email" className="login-label">Email</label>
                    <input 
                        type="text" 
                        id="email" 
                        name="email" 
                        className="login-input" 
                        placeholder="Email" 
                        required 
                    />
                    <label htmlFor="password" className="login-label">Contraseña</label>
                    <div className="password-container">
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            className="login-input" 
                            placeholder="Contraseña" 
                            required 
                        />
                    </div>
                    <div className="modal-actions">
                        <a href="/" className="cancel-link">Cancel</a>
                        <button type="submit" className="submit-button">Iniciar Sesión</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
