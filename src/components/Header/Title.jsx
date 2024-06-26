import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Title() {
    const location = useLocation();
    const [matn1, setMatn1] = useState("");
    const [matn2, setMatn2] = useState("");
    let subjectName = window.localStorage.getItem("subjectName") || null

    useEffect(() => {
        if (location.pathname === "/") {
            setMatn1("TMozaika interaktiv o‘yinlari orqali <br />Fan modullari bo‘yicha IQni aniqlash");
        }
        else if (location.pathname === "/results") {
            setMatn1("Umumiy natijalar");
            setMatn2("Natijangiz qoniqmayabsizmi? Unda yana urinib ko'ring");
        }
        else if (location.pathname === "/about") {
            setMatn1("Biz haqimizda");
        }
        else if (location.pathname === "/contact") {
            setMatn1("Savollaringiz bo’lsa murojaat qiling");
        }
        else if (location.pathname === "/category-detail" || location.pathname === "/questions") {
            setMatn1(subjectName);
            setMatn2("Savollar 5 ta darajada bo'lib, jami 30 ta savoldan tashkil topgan");
        }
       
        
    }, [location.pathname]); // Only re-run the effect if location.pathname changes

    return (
        <div className="site-hero">
            <div className="site-hero__content">
                <div className="container">
                    <h1 className="site-hero__title" dangerouslySetInnerHTML={{ __html: matn1 }} />
                    <p className="site-hero__desc">
                        {matn2}
                    </p>
                </div>
            </div>
        </div>
    );
}
