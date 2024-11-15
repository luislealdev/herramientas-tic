import React from 'react';

const ContactPage = () => {
    return (
        <div className="contact-page">
            <div className="contact-container">
                <div className="contact-left">
                    <h1 className="contact-title">Contáctanos</h1>
                    <div className="contact-options">
                        <div className="contact-option">
                        <i className="fa-solid fa-location-dot"></i>
                            <p>Centro Histórico, Claustro San Agustín, Cra. 6 No. 36-100</p>
                        </div>
                        <div className="contact-option">
                          <i className="fa-solid fa-envelope"></i>
                            <p>atencionalciudadano @unicartagena. edu.co</p>
                        </div>
                        <div className="contact-option">
                        <i className="fa-solid fa-clock"></i>
                            <p>7AM - 5PM de Lunes a Viernes </p>
                        </div>
                    </div>
                </div>
                <div className="contact-right">
                    <p className="contact-text">
                        ¿Tienes dudas? No dudes en contactarnos y con gusto te atenderemos
                    </p>
                    <a target="_blank" href="https://www.unicartagena.edu.co/de-interes/contacto-general" >
                        <button className="contact-button">Link</button>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;