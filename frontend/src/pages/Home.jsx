// src/pages/Home.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import About from "./About";

export default function Home() {
    const aboutRef = useRef(null);
    const [aboutVisible, setAboutVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => {
            if (!aboutRef.current) return;
            const rect = aboutRef.current.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                setAboutVisible(true);
            }
        };
        window.addEventListener("scroll", onScroll);
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleTryNow = () => {
        navigate("/contentgen");
    };

    return (
        <div className="home-container">
            <section className="intro-section" style={{ position: "relative" }}>
                <div className="diamond"></div>
                <div className="diamond"></div>
                <div className="diamond"></div>
                <div className="diamond"></div>
                <div className="diamond"></div>

                <h1>Welcome to EduFace Project</h1>
                <p>FacePrep is an innovative platform...</p>
                <button className="try-now-btn" onClick={handleTryNow}>Try Now</button>
            </section>


            <section
                id="about"
                className={`about-section ${aboutVisible ? "visible" : ""}`}
                ref={aboutRef}
            >
                <About />
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <h3>Contact Us</h3>
                <p>
                    Email: <a href="mailto:support@faceprep.com">support@faceprep.com</a> |{" "}
                    Phone: (+91) 123456789
                </p>
                <p>© 2025 FacePrep. All rights reserved.</p>
            </footer>
        </div>
    );
}
