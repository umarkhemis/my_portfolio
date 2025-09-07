

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Github, Linkedin, Mail, ExternalLink, ChevronDown, Home, User, Code, Briefcase, MessageCircle } from 'lucide-react';
import * as THREE from 'three';
import logo from './assets/my_image.jpg'
import './index.css';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const animationIdRef = useRef(null);

  // Three.js setup
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.8,
      // color: 0x4f46e5,
      color: 'white',
      transparent: true,
      opacity: 0.6
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create geometric shapes
    const geometry1 = new THREE.IcosahedronGeometry(8, 0);
    const material1 = new THREE.MeshBasicMaterial({
      color: 0x4f46e5,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const icosahedron = new THREE.Mesh(geometry1, material1);
    icosahedron.position.set(-30, 10, -20);
    scene.add(icosahedron);

    const geometry2 = new THREE.TorusGeometry(6, 2, 8, 16);
    const material2 = new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const torus = new THREE.Mesh(geometry2, material2);
    torus.position.set(25, -15, -25);
    scene.add(torus);

    const geometry3 = new THREE.OctahedronGeometry(5, 0);
    const material3 = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const octahedron = new THREE.Mesh(geometry3, material3);
    octahedron.position.set(0, 20, -30);
    scene.add(octahedron);

    camera.position.z = 30;

    sceneRef.current = { scene, camera, renderer, particlesMesh, icosahedron, torus, octahedron };

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Rotate particles
      particlesMesh.rotation.x += 0.001;
      particlesMesh.rotation.y += 0.002;

      // Rotate geometric shapes
      icosahedron.rotation.x += 0.01;
      icosahedron.rotation.y += 0.01;

      torus.rotation.x += 0.008;
      torus.rotation.z += 0.005;

      octahedron.rotation.x += 0.006;
      octahedron.rotation.y += 0.008;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Handle scroll to track active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 100;

      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: User },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'contact', label: 'Contact', icon: MessageCircle }
  ];

  return (
    <div className="app">
      {/* 3D Background */}
      <div ref={mountRef} className="threejs-background" />

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-content">
            <div className="logo">
              <div className="logo-circle">
                AUK
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="desktop-nav">
              <div className="nav-links">
                {navItems.map(({ id, label, icon: Icon }) => (
                  <button 
                    key={id}
                    onClick={() => scrollToSection(id)} 
                    className={`nav-link ${activeSection === id ? 'active' : ''}`}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="mobile-menu-button">
              <button onClick={toggleMenu} className="menu-toggle">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-content">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button 
                key={id}
                onClick={() => scrollToSection(id)} 
                className={`mobile-nav-link ${activeSection === id ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-box">
              <h1 className="hero-title">
                Hello, I'm <span className="hero-name">Ahmed Umar Khemis</span>
              </h1>
              <p className="hero-description">
                A passionate and results-driven Computer Science student at Kabale University with a strong foundation in machine learning, web development, and mobile application design. I have a keen interest in solving real-world problems using technology, particularly in the fields of agriculture, healthcare, and smart systems.
                <br /><br />
                My experience spans across AI/ML model development, full-stack web and mobile app development, computer vision, and AIoT. I enjoy turning ideas into scalable software solutions and continuously expanding my knowledge through hands-on projects and collaborative development.
                <br /><br />
                I hold certifications from institutions like Harvard's CS50, Kaggle, and Alison, and I'm always looking forward to contributing to impactful tech solutions, especially in underrepresented communities.
              </p>
            </div>

            <div className="hero-buttons">
              <button 
                onClick={() => scrollToSection('projects')}
                className="btn-primary"
              >
                View My Work
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="btn-secondary"
              >
                Get In Touch
              </button>
            </div>
          </div>
          <div className="hero-chevron">
            <ChevronDown className="chevron-icon" size={32} />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">About Me</h2>
            <p className="section-subtitle">Get to know more about my background and expertise</p>
          </div>
          
          <div className="about-content">
            <div className="about-image">
              <div className="image-placeholder">
               
                <div className="image-placeholder">
                  <span><img src={logo} alt="" style={{marginLeft: '-190px', marginTop: '100px'}}/></span>
                </div>
              </div>
            </div>
            
            <div className="about-text">
              <h3 className="about-title">Passionate Developer & Designer</h3>
              <p className="about-paragraph">
                I'm a passionate and results-driven Computer Science student at Kabale University with a strong foundation in Machine Learning, Deep Learning, Computer Vision, GenAI, web development, mobile application design, and Penetration Testing. I have a keen interest in solving real-world problems using technology, particularly in the fields of agriculture, healthcare, education, and smart systems.
              </p>
              <p className="about-paragraph">
                My experience spans across AI/ML model development, full-stack web and mobile app development, computer vision, and AIoT. I enjoy turning ideas into scalable software solutions and continuously expanding my knowledge through hands-on projects and collaborative development. I hold certifications from institutions like Harvard's CS50, Kaggle, Alison, Udemy, and Coursera, and I'm always looking forward to contributing to impactful tech solutions, especially in underrepresented communities.
              </p>
              
              <div className="skills-grid">
                <div className="skill-item">
                  <h4>AI/ML</h4>
                  <p>Tensorflow, Scikit-learn, OpenCV, YOLO, U-Net</p>
                </div>
                <div className="skill-item">
                  <h4>Hardware Programming</h4>
                  <p>Raspberry pi, Arduino</p>
                </div>
                <div className="skill-item">
                  <h4>Frontend</h4>
                  <p>React, TypeScript</p>
                </div>
                <div className="skill-item">
                  <h4>Backend</h4>
                  <p>Django, Flask</p>
                </div>
                <div className="skill-item">
                  <h4>Mobile Development</h4>
                  <p>Android Studio, React Native</p>
                </div>
                <div className="skill-item">
                  <h4>Databases</h4>
                  <p>SQLServer, PostgreSQL, GraphQL, MySQL</p>
                </div>
                <div className="skill-item">
                  <h4>Tools</h4>
                  <p>Git, Docker, AWS</p>
                </div>
                <div className="skill-item">
                  <h4>Design</h4>
                  <p>Figma, Canva</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="skills-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Skills & Technologies</h2>
            <p className="section-subtitle">Technologies I work with regularly</p>
          </div>
          
          <div className="skills-cards">
            <div className="skill-card">
              <h3>AI/ML/DL</h3>
              <div className="skill-progress">
                <div className="skill-item-progress">
                  <div className="skill-info">
                    <span>Tensorflow</span>
                    <span className="skill-percentage">90%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '90%'}}></div>
                  </div>
                </div>
                <div className="skill-item-progress">
                  <div className="skill-info">
                    <span>Scikit-learn</span>
                    <span className="skill-percentage">85%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '85%'}}></div>
                  </div>
                </div>
                <div className="skill-item-progress">
                  <div className="skill-info">
                    <span>YOLO</span>
                    <span className="skill-percentage">77%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '77%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="skill-card">
              <h3>Hardware Programming</h3>
              <div className="skill-progress">
                <div className="skill-item-progress">
                  <div className="skill-info">
                    <span>Raspberry pi</span>
                    <span className="skill-percentage">84%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '84%'}}></div>
                  </div>
                </div>
                <div className="skill-item-progress">
                  <div className="skill-info">
                    <span>Arduino</span>
                    <span className="skill-percentage">71%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '71%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="skill-card">
              <h3>Frontend Development</h3>
              <div className="skill-progress">
                <div className="skill-item-progress">
                  <div className="skill-info">
                    <span>React</span>
                    <span className="skill-percentage">90%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '90%'}}></div>
                  </div>
                </div>
                <div className="skill-item-progress">
                  <div className="skill-info">
                    <span>TypeScript</span>
                    <span className="skill-percentage">85%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '85%'}}></div>
                  </div>
                </div>
                <div className="skill-item-progress">
                  <div className="skill-info">
                    <span>CSS/Tailwind</span>
                    <span className="skill-percentage">95%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '95%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="skill-card">
              <h3>Backend Development</h3>
              <div className="skill-progress">
                <div className="skill-item-progress">
                  <div className="skill-info">
                    <span>Django</span>
                    <span className="skill-percentage">80%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '80%'}}></div>
                  </div>
                </div>
                <div className="skill-item-progress">
                  <div className="skill-info">
                    <span>Python</span>
                    <span className="skill-percentage">75%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '75%'}}></div>
                  </div>
                </div>
                <div className="skill-item-progress">
                  <div className="skill-info">
                    <span>PostgreSQL</span>
                    <span className="skill-percentage">70%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '70%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="skill-card">
              <h3>Mobile App Development</h3>
              <div className="skill-progress">
                <div className="skill-item-progress">
                  <div className="skill-info">
                    <span>Android Studio</span>
                    <span className="skill-percentage">88%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '88%'}}></div>
                  </div>
                </div>
                <div className="skill-item-progress">
                  <div className="skill-info">
                    <span>React Native</span>
                    <span className="skill-percentage">65%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '65%'}}></div>
                  </div>
                </div>
                <div className="skill-item-progress">
                  <div className="skill-info">
                    <span>Firebase</span>
                    <span className="skill-percentage">70%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '70%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="skill-card">
              <h3>Tools & Others</h3>
              <div className="skill-progress">
                <div className="skill-item-progress">
                  <div className="skill-info">
                    <span>Git</span>
                    <span className="skill-percentage">90%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '90%'}}></div>
                  </div>
                </div>
                <div className="skill-item-progress">
                  <div className="skill-info">
                    <span>Docker</span>
                    <span className="skill-percentage">65%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '65%'}}></div>
                  </div>
                </div>
                <div className="skill-item-progress">
                  <div className="skill-info">
                    <span>AWS</span>
                    <span className="skill-percentage">60%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '60%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Projects</h2>
            <p className="section-subtitle">Some of my recent work</p>
          </div>
          
          <div className="projects-grid">
            <div className="project-card">
              <div className="project-image">
                <div className="project-placeholder">
                  <Code size={48} />
                  <span>Project Screenshot</span>
                </div>
              </div>
              <div className="project-content">
                <h3>Crop Pest & Disease Detection System</h3>
                <h4>Description:</h4>
                <p>
                  An AI-powered web platform that allows farmers to upload crop images and receive instant diagnosis of pest or disease issues, along with GenAI-generated insights for treatment and prevention.
                </p>
                <h4>Technologies:</h4>
                <p>
                  TensorFlow, Keras, OpenCV, React, Django REST Framework, HuggingFace, Material UI, WebSockets, PostgreSQL
                </p>
                
                <div className="project-tags">
                  <span className="tag">React</span>
                  <span className="tag">Django</span>
                  <span className="tag">PostgreSQL</span>
                </div>
                <div className="project-links">
                  <a href="https://github.com/umarkhemis/Crop_Disease_Detector" className="project-link">
                    <Github size={16} />
                    Github
                  </a>
                </div>
              </div>
            </div>

            <div className="project-card">
              <div className="project-image">
                <div className="project-placeholder">
                  <Code size={48} />
                  <span>Project Screenshot</span>
                </div>
              </div>
              <div className="project-content">
                <h3>Ad Platform</h3>
                <h4>Description:</h4>
                <p>
                  A web platform that allows business, and sales personels to advertise their products.
                </p>
                <h4>Technologies:</h4>
                <p>
                  React, Django REST Framework, PostgreSQL
                </p>
                
                <div className="project-tags">
                  <span className="tag">React</span>
                  <span className="tag">Django</span>
                  <span className="tag">PostgreSQL</span>
                </div>
                <div className="project-links">
                  <a href="https://github.com/umarkhemis/Ad_Platform" className="project-link">
                    <Github size={16} />
                    Github
                  </a>
                </div>
              </div>
            </div>

            <div className="project-card">
              <div className="project-image">
                <div className="project-placeholder">
                  <Code size={48} />
                  <span>Project Screenshot</span>
                </div>
              </div>
              <div className="project-content">
                <h3>Cabbage Blackrot Detection System</h3>
                <h4>Description:</h4>
                <p>
                  A mobile version of the crop health prediction system but specifically for cabbage black rot with camera capture, image upload, and disease insight integration.
                </p>
                <h4>Technologies:</h4>
                <p>
                  Tensorflow, React Native, Expo, Django REST API,
                </p>

                <div className="project-tags">
                  <span className="tag">React Native</span>
                  <span className="tag">Django</span>
                  <span className="tag">PostgreSQL</span>
                </div>
                <div className="project-links">
                  <a href="https://github.com/umarkhemis/Django_Cabbage_Doctor" className="project-link">
                    <Github size={16} />
                    Github
                  </a>
                </div>
              </div>
            </div>

            <div className="project-card">
              <div className="project-image">
                <div className="project-placeholder">
                  <Code size={48} />
                  <span>Project Screenshot</span>
                </div>
              </div>
              <div className="project-content">
                <h3>Notes_Keeper</h3>
                <h4>Description:</h4>
                <p>
                  A full-stack web application for taking and storing notes, updating as well as deleting the notes
                </p>
                <h4>Technologies:</h4>
                <p>
                  Reactjs, Django REST API, PostgreSQL
                </p>
                
                <div className="project-tags">
                  <span className="tag">React</span>
                  <span className="tag">Django</span>
                  <span className="tag">PostgreSQL</span>
                </div>
                <div className="project-links">
                  <a href="https://github.com/umarkhemis/Notes_app" className="project-link">
                    <Github size={16} />
                    Github
                  </a>
                </div>
              </div>
            </div>

            <div className="project-card">
              <div className="project-image">
                <div className="project-placeholder">
                  <Code size={48} />
                  <span>Project Screenshot</span>
                </div>
              </div>
              <div className="project-content">
                <h3>Certificate Verifier</h3>
                <h4>Description:</h4>
                <p>
                  A blockchain web application that allows institutions to issue tamper proof transcripts to students, and also allows easy verification of transcripts
                </p>
                <h4>Technologies:</h4>
                <p>
                  Smart Contracts with Solidity, Reactjs
                </p>

                <div className="project-tags">
                  <span className="tag">React</span>
                  <span className="tag">Solidity</span>
                  <span className="tag">Blockchain</span>
                </div>
                <div className="project-links">
                  <a href="https://github.com/umarkhemis/Certificate_Verifier" className="project-link">
                    <Github size={16} />
                    Github
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Get In Touch</h2>
            <p className="section-subtitle">Let's discuss your next project</p>
          </div>
          
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <Mail className="contact-icon" size={24} />
                <div>
                  <h3>Email</h3>
                  <p>umarkhemis9@gmail.com</p>
                </div>
              </div>
              
              <div className="contact-item">
                <Github className="contact-icon" size={24} />
                <div>
                  <h3>GitHub</h3>
                  <p>github.com/umarkhemis</p>
                </div>
              </div>
              
              <div className="contact-item">
                <Linkedin className="contact-icon" size={24} />
                <div>
                  <h3>LinkedIn</h3>
                  <p>linkedin.com/in/ahmed-umar-khemis</p>
                </div>
              </div>
            </div>
            
            <div className="contact-form">
              <form className="form">
                <div className="form-group">
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <textarea 
                    placeholder="Your Message" 
                    rows="5"
                    className="form-textarea"
                  ></textarea>
                </div>
                
                <button type="submit" className="btn-primary">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p>&copy; 2024 Ahmed Umar Khemis. All rights reserved.</p>
            <div className="social-links">
              <a href="https://github.com/umarkhemis" className="social-link">
                <Github size={20} />
              </a>
              <a href="https://linkedin.com/in/ahmed-umar-khemis" className="social-link">
                <Linkedin size={20} />
              </a>
              <a href="mailto:umarkhemis9@gmail.com" className="social-link">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          position: relative;
          min-height: 100vh;
        }
        
        .threejs-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          pointer-events: none;
        }

        /* Navbar Styles */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
          transition: all 0.3s ease;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 70px;
        }

        .logo {
          font-weight: 700;
          font-size: 1.5rem;
          color: #f8fafc;
        }

        .logo-circle {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
          box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
          transition: transform 0.3s ease;
        }

        .logo-circle:hover {
          transform: scale(1.05);
        }

        .desktop-nav {
          display: none;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: #cbd5e1;
          cursor: pointer;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .nav-link:hover {
          background: rgba(79, 70, 229, 0.1);
          color: #4f46e5;
          transform: translateY(-2px);
        }

        .nav-link.active {
          background: rgba(79, 70, 229, 0.2);
          color: #4f46e5;
        }

        .mobile-menu-button {
          display: flex;
          align-items: center;
        }

        .menu-toggle {
          background: none;
          border: none;
          color: #f8fafc;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.375rem;
          transition: all 0.3s ease;
        }

        .menu-toggle:hover {
          background: rgba(79, 70, 229, 0.1);
          transform: scale(1.05);
        }

        /* Mobile Navigation */
        .mobile-nav {
          position: fixed;
          top: 70px;
          left: 0;
          right: 0;
          background: rgba(15, 23, 42, 0.98);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
          transform: translateY(-100%);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          max-height: calc(100vh - 70px);
          overflow-y: auto;
        }

        .mobile-nav.open {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }

        .mobile-nav-content {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: none;
          border: none;
          color: #cbd5e1;
          cursor: pointer;
          padding: 1rem;
          border-radius: 0.75rem;
          transition: all 0.3s ease;
          font-size: 1rem;
          font-weight: 500;
          text-align: left;
          width: 100%;
        }

        .mobile-nav-link:hover {
          background: rgba(79, 70, 229, 0.1);
          color: #4f46e5;
          transform: translateX(4px);
        }

        .mobile-nav-link.active {
          background: rgba(79, 70, 229, 0.2);
          color: #4f46e5;
        }

        /* Hero Section */
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          position: relative;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8));
        }

        .hero-container {
          max-width: 1200px;
          width: 100%;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .hero-content {
          margin-bottom: 3rem;
        }

        .hero-box {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.1);
          border-radius: 1.5rem;
          padding: 3rem 2rem;
          margin-bottom: 3rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .hero-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }

        .hero-name {
          background: linear-gradient(135deg, #4f46e5, #7c3aed, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 1.1rem;
          color: #cbd5e1;
          line-height: 1.7;
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-buttons {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-primary {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
        }

        .btn-secondary {
          background: transparent;
          color: #4f46e5;
          border: 2px solid #4f46e5;
          padding: 1rem 2rem;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: #4f46e5;
          color: white;
          transform: translateY(-2px);
        }

        .hero-chevron {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          animation: bounce 2s infinite;
        }

        .chevron-icon {
          color: #4f46e5;
          opacity: 0.7;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          40% {
            transform: translateX(-50%) translateY(-10px);
          }
          60% {
            transform: translateX(-50%) translateY(-5px);
          }
        }

        /* Section Styles */
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          font-size: 1.2rem;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
        }

        /* About Section */
        .about-section {
          padding: 6rem 0;
          background: #f8fafc;
        }

        .about-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: center;
        }

        .about-image {
          text-align: center;
        }

        .image-placeholder {
          display: inline-block;
        }

        .profile-circle {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
          font-weight: 700;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .profile-circle:hover {
          transform: scale(1.05);
        }

        .about-title {
          font-size: 2rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1.5rem;
        }

        .about-paragraph {
          color: #475569;
          margin-bottom: 1.5rem;
          line-height: 1.7;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .skill-item {
          background: white;
          padding: 1.5rem;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .skill-item:hover {
          transform: translateY(-4px);
        }

        .skill-item h4 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .skill-item p {
          color: #64748b;
          font-size: 0.9rem;
        }

        /* Skills Section */
        .skills-section {
          padding: 6rem 0;
          background: #1e293b;
        }

        .skills-section .section-title {
          color: #f8fafc;
        }

        .skills-section .section-subtitle {
          color: #cbd5e1;
        }

        .skills-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .skill-card {
          background: rgba(30, 41, 59, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.1);
          border-radius: 1.5rem;
          padding: 2rem;
          transition: transform 0.3s ease;
        }

        .skill-card:hover {
          transform: translateY(-8px);
        }

        .skill-card h3 {
          color: #f8fafc;
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .skill-progress {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .skill-item-progress {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .skill-info {
          display: flex;
          justify-content: space-between;
          color: #cbd5e1;
          font-size: 0.9rem;
        }

        .skill-percentage {
          color: #4f46e5;
          font-weight: 600;
        }

        .progress-bar {
          height: 6px;
          background: rgba(148, 163, 184, 0.2);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          transition: width 1s ease;
        }

        /* Projects Section */
        .projects-section {
          padding: 6rem 0;
          background: #f8fafc;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .project-card {
          background: white;
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .project-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
        }

        .project-image {
          height: 200px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .project-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: white;
          text-align: center;
        }

        .project-placeholder span {
          font-size: 1.1rem;
          font-weight: 500;
        }

        .project-content {
          padding: 2rem;
        }

        .project-content h3 {
          font-size: 1.4rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .project-content h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #4f46e5;
          margin-bottom: 0.5rem;
          margin-top: 1rem;
        }

        .project-content p {
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .project-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 1.5rem 0;
        }

        .tag {
          background: rgba(79, 70, 229, 0.1);
          color: #4f46e5;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .project-links {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .project-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #4f46e5;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .project-link:hover {
          color: #7c3aed;
          transform: translateX(2px);
        }

        /* Contact Section */
        .contact-section {
          padding: 6rem 0;
          background: #1e293b;
        }

        .contact-section .section-title {
          color: #f8fafc;
        }

        .contact-section .section-subtitle {
          color: #cbd5e1;
        }

        .contact-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(30, 41, 59, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.1);
          padding: 1.5rem;
          border-radius: 1rem;
          transition: transform 0.3s ease;
        }

        .contact-item:hover {
          transform: translateY(-4px);
        }

        .contact-icon {
          color: #4f46e5;
          flex-shrink: 0;
        }

        .contact-item h3 {
          color: #f8fafc;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .contact-item p {
          color: #cbd5e1;
          word-break: break-all;
        }

        .contact-form {
          background: rgba(30, 41, 59, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.1);
          border-radius: 1.5rem;
          padding: 2rem;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-input, .form-textarea {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 0.75rem;
          padding: 1rem;
          color: #f8fafc;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .form-input::placeholder, .form-textarea::placeholder {
          color: #94a3b8;
        }

        /* Footer */
        .footer {
          background: #0f172a;
          padding: 2rem 0;
          border-top: 1px solid rgba(148, 163, 184, 0.1);
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-content p {
          color: #cbd5e1;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-link {
          color: #cbd5e1;
          text-decoration: none;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          color: #4f46e5;
          background: rgba(79, 70, 229, 0.1);
          transform: translateY(-2px);
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-description {
            font-size: 1rem;
          }
          
          .hero-box {
            padding: 2rem 1.5rem;
          }
          
          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .btn-primary, .btn-secondary {
            width: 100%;
            max-width: 300px;
          }
          
          .section-title {
            font-size: 2rem;
          }
          
          .about-content {
            text-align: center;
          }
          
          .profile-image {
            width: 200px;
            height: 200px;
          }
          
          .skills-grid {
            grid-template-columns: 1fr;
          }
          
          .skills-cards {
            grid-template-columns: 1fr;
          }
          
          .projects-grid {
            grid-template-columns: 1fr;
          }
          
          .project-tags {
            justify-content: center;
          }
          
          .contact-content {
            grid-template-columns: 1fr;
          }
          
          .footer-content {
            flex-direction: column;
            text-align: center;
          }
          
          .hero-section {
            padding: 1rem;
          }
          
          .about-section, .skills-section, .projects-section, .contact-section {
            padding: 4rem 0;
          }
        }

        @media (min-width: 768px) {
          .desktop-nav {
            display: block;
          }
          
          .mobile-menu-button {
            display: none;
          }
          
          .about-content {
            grid-template-columns: 1fr 2fr;
            text-align: left;
          }
          
          .contact-content {
            grid-template-columns: 1fr 1fr;
          }
          
          .skills-cards {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .projects-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .skills-cards {
            grid-template-columns: repeat(3, 1fr);
          }
          
          .projects-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        ::-webkit-scrollbar-thumb {
          background: #4f46e5;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #7c3aed;
        }
      `}</style>
    </div>
  );
};

export default App;







































































// import React, { useState, useEffect, useRef } from 'react';
// import { Menu, X, Github, Linkedin, Mail, ExternalLink, ChevronDown } from 'lucide-react';
// import { Code, Smartphone, Eye, Sparkles, Brain, Briefcase } from 'lucide-react';
// import * as THREE from 'three';
// import logo from './assets/my_image.jpg'
// import notes_keeper_image from './assets/notes_keeper.png'
// import ads_platform_image from './assets/ads_platform.png'

// const App = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const mountRef = useRef(null);
//   const sceneRef = useRef(null);
//   const animationIdRef = useRef(null);

//   // Three.js setup
//   useEffect(() => {
//     if (!mountRef.current) return;

//     // Scene setup
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setClearColor(0x000000, 0);
//     mountRef.current.appendChild(renderer.domElement);

//     // Create floating particles
//     const particlesGeometry = new THREE.BufferGeometry();
//     const particlesCount = 1000;
//     const posArray = new Float32Array(particlesCount * 3);

//     for (let i = 0; i < particlesCount * 3; i++) {
//       posArray[i] = (Math.random() - 0.5) * 100;
//     }

//     particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
//     const particlesMaterial = new THREE.PointsMaterial({
//       size: 0.8,
//       color: 0x4f46e5,
//       transparent: true,
//       opacity: 0.6
//     });

//     const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
//     scene.add(particlesMesh);

//     // Create geometric shapes
//     const geometry1 = new THREE.IcosahedronGeometry(8, 0);
//     const material1 = new THREE.MeshBasicMaterial({
//       color: 0x4f46e5,
//       wireframe: true,
//       transparent: true,
//       opacity: 0.3
//     });
//     const icosahedron = new THREE.Mesh(geometry1, material1);
//     icosahedron.position.set(-30, 10, -20);
//     scene.add(icosahedron);

//     const geometry2 = new THREE.TorusGeometry(6, 2, 8, 16);
//     const material2 = new THREE.MeshBasicMaterial({
//       color: 0x7c3aed,
//       wireframe: true,
//       transparent: true,
//       opacity: 0.4
//     });
//     const torus = new THREE.Mesh(geometry2, material2);
//     torus.position.set(25, -15, -25);
//     scene.add(torus);

//     const geometry3 = new THREE.OctahedronGeometry(5, 0);
//     const material3 = new THREE.MeshBasicMaterial({
//       color: 0x06b6d4,
//       wireframe: true,
//       transparent: true,
//       opacity: 0.3
//     });
//     const octahedron = new THREE.Mesh(geometry3, material3);
//     octahedron.position.set(0, 20, -30);
//     scene.add(octahedron);

//     camera.position.z = 30;

//     sceneRef.current = { scene, camera, renderer, particlesMesh, icosahedron, torus, octahedron };

//     // Animation loop
//     const animate = () => {
//       animationIdRef.current = requestAnimationFrame(animate);

//       // Rotate particles
//       particlesMesh.rotation.x += 0.001;
//       particlesMesh.rotation.y += 0.002;

//       // Rotate geometric shapes
//       icosahedron.rotation.x += 0.01;
//       icosahedron.rotation.y += 0.01;

//       torus.rotation.x += 0.008;
//       torus.rotation.z += 0.005;

//       octahedron.rotation.x += 0.006;
//       octahedron.rotation.y += 0.008;

//       renderer.render(scene, camera);
//     };

//     animate();

//     // Handle resize
//     const handleResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };

//     window.addEventListener('resize', handleResize);

//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', handleResize);
//       if (animationIdRef.current) {
//         cancelAnimationFrame(animationIdRef.current);
//       }
//       if (mountRef.current && renderer.domElement) {
//         mountRef.current.removeChild(renderer.domElement);
//       }
//       renderer.dispose();
//     };
//   }, []);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const scrollToSection = (sectionId) => {
//     const element = document.getElementById(sectionId);
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth' });
//     }
//     setIsMenuOpen(false);
//   };

//   return (
//     <div style={styles.app}>
//       {/* 3D Background */}
//       <div ref={mountRef} style={styles.threejsBackground} />

//       {/* Navbar */}
//       <nav style={styles.navbar}>
//         <div style={styles.navContainer}>
//           <div style={styles.navContent}>
//             <div style={styles.logo}>
//               <div style={{
//                 width: '70px',
//                 height: '50px',
//                 backgroundColor: '#4f46e5',
//                 borderRadius: '50%',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 color: 'white',
//                 fontWeight: 'bold',
//                 fontSize: '1.2rem'
//               }}>
//                 AUK
//               </div>
//             </div>
            
//             {/* Desktop Navigation */}
//             <div style={styles.desktopNav}>
//               <div style={styles.navLinks}>
//                 <button onClick={() => scrollToSection('home')} style={styles.navLink}>
//                   Home
//                 </button>
//                 <button onClick={() => scrollToSection('about')} style={styles.navLink}>
//                   About
//                 </button>
//                 <button onClick={() => scrollToSection('skills')} style={styles.navLink}>
//                   Skills
//                 </button>
//                 <button onClick={() => scrollToSection('projects')} style={styles.navLink}>
//                   Projects
//                 </button>
//                 <button onClick={() => scrollToSection('contact')} style={styles.navLink}>
//                   Contact
//                 </button>
//               </div>
//             </div>

//             {/* Mobile menu button */}
//             <div style={styles.mobileMenuButton}>
//               <button onClick={toggleMenu} style={styles.menuToggle}>
//                 {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <div style={styles.mobileNav}>
//             <div style={styles.mobileNavContent}>
//               <button onClick={() => scrollToSection('home')} style={styles.mobileNavLink}>
//                 Home
//               </button>
//               <button onClick={() => scrollToSection('about')} style={styles.mobileNavLink}>
//                 About
//               </button>
//               <button onClick={() => scrollToSection('skills')} style={styles.mobileNavLink}>
//                 Skills
//               </button>
//               <button onClick={() => scrollToSection('projects')} style={styles.mobileNavLink}>
//                 Projects
//               </button>
//               <button onClick={() => scrollToSection('contact')} style={styles.mobileNavLink}>
//                 Contact
//               </button>
//             </div>
//           </div>
//         )}
//       </nav>

//       {/* Hero Section */}
//       <section id="home" style={styles.heroSection}>
//         <div style={styles.heroContainer}>
//           <div style={styles.heroContent}>
//             <div style={styles.heroBox}>
//               <h1 style={styles.heroTitle}>
//                 Hello, I'm <span style={styles.heroName}>Ahmed Umar Khemis</span>
//               </h1>
//               <p style={styles.heroDescription}>
//                 A passionate and results-driven Computer Science student at Kabale University with a strong foundation in machine learning, web development, and mobile application design. I have a keen interest in solving real-world problems using technology, particularly in the fields of agriculture, healthcare, and smart systems.
//                 <br /><br />
//                 My experience spans across AI/ML model development, full-stack web and mobile app development, computer vision, and AIoT. I enjoy turning ideas into scalable software solutions and continuously expanding my knowledge through hands-on projects and collaborative development.
//                 <br /><br />
//                 I hold certifications from institutions like Harvard's CS50, Kaggle, and Alison, and I'm always looking forward to contributing to impactful tech solutions, especially in underrepresented communities.
//               </p>
//             </div>

//             <div style={styles.heroButtons}>
//               <button 
//                 onClick={() => scrollToSection('projects')}
//                 style={styles.btnPrimary}
//               >
//                 View My Work
//               </button>
//               <button 
//                 onClick={() => scrollToSection('contact')}
//                 style={styles.btnSecondary}
//               >
//                 Get In Touch
//               </button>
//             </div>
//           </div>
//           <div style={styles.heroChevron}>
//             <ChevronDown style={styles.chevronIcon} size={32} />
//           </div>
//         </div>
//       </section>

//       {/* About Section */}
//       <section id="about" style={styles.aboutSection}>
//         <div style={styles.container}>
//           <div style={styles.sectionHeader}>
//             <h2 style={styles.sectionTitle}>
//               <div style={{
//                   marginTop: '-90px',
//               }}></div>
              
//               About Me</h2>
//             <p style={styles.sectionSubtitle}>Get to know more about my background and expertise</p>
//           </div>
          
//           <div style={styles.aboutContent}>
//             <div style={styles.aboutImage}>
              // <div style={styles.imagePlaceholder}>
              //   <div style={{
              //     width: '500px',
              //     height: '500px',
              //     backgroundColor: '#4f46e5',
              //     marginLeft: '-60px',
              //     // marginTop: '-300px',
              //     borderRadius: '50%',
              //     display: 'flex',
              //     alignItems: 'center',
              //     justifyContent: 'center',
              //     color: 'white',
              //     fontSize: '3rem',
              //     fontWeight: 'bold',
              //     margin: '0 auto'
              //   }}>
                // <div className="image-placeholder">
                //   <span><img src={logo} alt="" style={{marginLeft: '190px'}}/></span>
                // </div>
//                 </div>
//               </div>
//             </div>
            
//             <div style={styles.aboutText}>
//               <h3 style={styles.aboutTitle}>Passionate Developer & Designer</h3>
//               <p style={styles.aboutParagraph}>
//                 I'm a passionate and results-driven Computer Science student at Kabale University with a strong foundation in Machine Learning, Deep Learning, Computer Vision, GenAI, web development, mobile application design, and Penetration Testing. I have a keen interest in solving real-world problems using technology, particularly in the fields of agriculture, healthcare, education, and smart systems.
//               </p>
//               <p style={styles.aboutParagraph}>
//                 My experience spans across AI/ML model development, full-stack web and mobile app development, computer vision, and AIoT. I enjoy turning ideas into scalable software solutions and continuously expanding my knowledge through hands-on projects and collaborative development. I hold certifications from institutions like Harvard's CS50, Kaggle, Alison, Udemy, and Coursera, and I'm always looking forward to contributing to impactful tech solutions, especially in underrepresented communities.
//               </p>
              
//               <div style={styles.skillsGrid}>
//                 <div style={styles.skillItem}>
//                   <h4>AI/ML</h4>
//                   <p>Tensorflow, Scikit-learn, OpenCV, YOLO, U-Net</p>
//                 </div>
//                 <div style={styles.skillItem}>
//                   <h4>Hardware Programming</h4>
//                   <p>Raspberry pi, Arduino</p>
//                 </div>
//                 <div style={styles.skillItem}>
//                   <h4>Frontend</h4>
//                   <p>React, TypeScript</p>
//                 </div>
//                 <div style={styles.skillItem}>
//                   <h4>Backend</h4>
//                   <p>Django, Flask</p>
//                 </div>
//                 <div style={styles.skillItem}>
//                   <h4>Mobile Development</h4>
//                   <p>Android Studio, React Native</p>
//                 </div>
//                 <div style={styles.skillItem}>
//                   <h4>Databases</h4>
//                   <p>SQLServer, PostgreSQL, GraphQL, MySQL</p>
//                 </div>
//                 <div style={styles.skillItem}>
//                   <h4>Tools</h4>
//                   <p>Git, Docker, AWS</p>
//                 </div>
//                 <div style={styles.skillItem}>
//                   <h4>Design</h4>
//                   <p>Figma, Canva</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Skills Section */}
//       <section id="skills" style={styles.skillsSection}>
//         <div style={styles.container}>
//           <div style={styles.sectionHeader}>
//             <h2 style={styles.sectionTitle}>Skills & Technologies</h2>
//             <p style={styles.sectionSubtitle}>Technologies I work with regularly</p>
//           </div>
          
//           <div style={styles.skillsCards}>
//             <div style={styles.skillCard}>
//               <h3>AI/ML/DL</h3>
//               <div style={styles.skillProgress}>
//                 <div style={styles.skillItemProgress}>
//                   <div style={styles.skillInfo}>
//                     <span>Tensorflow</span>
//                     <span style={styles.skillPercentage}>90%</span>
//                   </div>
//                   <div style={styles.progressBar}>
//                     <div style={{...styles.progressFill, width: '90%'}}></div>
//                   </div>
//                 </div>
//                 <div style={styles.skillItemProgress}>
//                   <div style={styles.skillInfo}>
//                     <span>Scikit-learn</span>
//                     <span style={styles.skillPercentage}>85%</span>
//                   </div>
//                   <div style={styles.progressBar}>
//                     <div style={{...styles.progressFill, width: '85%'}}></div>
//                   </div>
//                 </div>
//                 <div style={styles.skillItemProgress}>
//                   <div style={styles.skillInfo}>
//                     <span>YOLO</span>
//                     <span style={styles.skillPercentage}>77%</span>
//                   </div>
//                   <div style={styles.progressBar}>
//                     <div style={{...styles.progressFill, width: '77%'}}></div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div style={styles.skillCard}>
//               <h3>Hardware Programming</h3>
//               <div style={styles.skillProgress}>
//                 <div style={styles.skillItemProgress}>
//                   <div style={styles.skillInfo}>
//                     <span>Raspberry pi</span>
//                     <span style={styles.skillPercentage}>84%</span>
//                   </div>
//                   <div style={styles.progressBar}>
//                     <div style={{...styles.progressFill, width: '84%'}}></div>
//                   </div>
//                 </div>
//                 <div style={styles.skillItemProgress}>
//                   <div style={styles.skillInfo}>
//                     <span>Arduino</span>
//                     <span style={styles.skillPercentage}>71%</span>
//                   </div>
//                   <div style={styles.progressBar}>
//                     <div style={{...styles.progressFill, width: '71%'}}></div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div style={styles.skillCard}>
//               <h3>Frontend Development</h3>
//               <div style={styles.skillProgress}>
//                 <div style={styles.skillItemProgress}>
//                   <div style={styles.skillInfo}>
//                     <span>React</span>
//                     <span style={styles.skillPercentage}>90%</span>
//                   </div>
//                   <div style={styles.progressBar}>
//                     <div style={{...styles.progressFill, width: '90%'}}></div>
//                   </div>
//                 </div>
//                 <div style={styles.skillItemProgress}>
//                   <div style={styles.skillInfo}>
//                     <span>TypeScript</span>
//                     <span style={styles.skillPercentage}>85%</span>
//                   </div>
//                   <div style={styles.progressBar}>
//                     <div style={{...styles.progressFill, width: '85%'}}></div>
//                   </div>
//                 </div>
//                 <div style={styles.skillItemProgress}>
//                   <div style={styles.skillInfo}>
//                     <span>CSS/Tailwind</span>
//                     <span style={styles.skillPercentage}>95%</span>
//                   </div>
//                   <div style={styles.progressBar}>
//                     <div style={{...styles.progressFill, width: '95%'}}></div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div style={styles.skillCard}>
//               <h3>Backend Development</h3>
//               <div style={styles.skillProgress}>
//                 <div style={styles.skillItemProgress}>
//                   <div style={styles.skillInfo}>
//                     <span>Django</span>
//                     <span style={styles.skillPercentage}>80%</span>
//                   </div>
//                   <div style={styles.progressBar}>
//                     <div style={{...styles.progressFill, width: '80%'}}></div>
//                   </div>
//                 </div>
//                 <div style={styles.skillItemProgress}>
//                   <div style={styles.skillInfo}>
//                     <span>Python</span>
//                     <span style={styles.skillPercentage}>75%</span>
//                   </div>
//                   <div style={styles.progressBar}>
//                     <div style={{...styles.progressFill, width: '75%'}}></div>
//                   </div>
//                 </div>
//                 <div style={styles.skillItemProgress}>
//                   <div style={styles.skillInfo}>
//                     <span>PostgreSQL</span>
//                     <span style={styles.skillPercentage}>70%</span>
//                   </div>
//                   <div style={styles.progressBar}>
//                     <div style={{...styles.progressFill, width: '70%'}}></div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div style={styles.skillCard}>
//               <h3>Mobile App Development</h3>
//               <div style={styles.skillProgress}>
//                 <div style={styles.skillItemProgress}>
//                   <div style={styles.skillInfo}>
//                     <span>Android Studio</span>
//                     <span style={styles.skillPercentage}>88%</span>
//                   </div>
//                   <div style={styles.progressBar}>
//                     <div style={{...styles.progressFill, width: '88%'}}></div>
//                   </div>
//                 </div>
//                 <div style={styles.skillItemProgress}>
//                   <div style={styles.skillInfo}>
//                     <span>React Native</span>
//                     <span style={styles.skillPercentage}>65%</span>
//                   </div>
//                   <div style={styles.progressBar}>
//                     <div style={{...styles.progressFill, width: '65%'}}></div>
//                   </div>
//                 </div>
//                 <div style={styles.skillItemProgress}>
//                   <div style={styles.skillInfo}>
//                     <span>Firebase</span>
//                     <span style={styles.skillPercentage}>70%</span>
//                   </div>
//                   <div style={styles.progressBar}>
//                     <div style={{...styles.progressFill, width: '70%'}}></div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div style={styles.skillCard}>
//               <h3>Tools & Others</h3>
//               <div style={styles.skillProgress}>
//                 <div style={styles.skillItemProgress}>
//                   <div style={styles.skillInfo}>
//                     <span>Git</span>
//                     <span style={styles.skillPercentage}>90%</span>
//                   </div>
//                   <div style={styles.progressBar}>
//                     <div style={{...styles.progressFill, width: '90%'}}></div>
//                   </div>
//                 </div>
//                 <div style={styles.skillItemProgress}>
//                   <div style={styles.skillInfo}>
//                     <span>Docker</span>
//                     <span style={styles.skillPercentage}>65%</span>
//                   </div>
//                   <div style={styles.progressBar}>
//                     <div style={{...styles.progressFill, width: '65%'}}></div>
//                   </div>
//                 </div>
//                 <div style={styles.skillItemProgress}>
//                   <div style={styles.skillInfo}>
//                     <span>AWS</span>
//                     <span style={styles.skillPercentage}>60%</span>
//                   </div>
//                   <div style={styles.progressBar}>
//                     <div style={{...styles.progressFill, width: '60%'}}></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Projects Section */}
//       <section id="projects" style={styles.projectsSection}>
//         <div style={styles.container}>
//           <div style={styles.sectionHeader}>
//             <h2 style={styles.sectionTitle}>Featured Projects</h2>
//             <p style={styles.sectionSubtitle}>Some of my recent work</p>
//           </div>
          
//           <div style={styles.projectsGrid}>
//             <div style={styles.projectCard}>
//               <div style={styles.projectImage}>
//                 <div style={{
//                   width: '100%',
//                   height: '200px',
//                   backgroundColor: '#f3f4f6',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   color: '#9ca3af',
//                   fontSize: '1rem'
//                 }}>
//                   Project Screenshot
//                 </div>
//               </div>
//               <div style={styles.projectContent}>
//                 <h2>Crop Pest & Disease Detection System</h2>
//                 <h4>Description:</h4>
//                 <p>
//                   An AI-powered web platform that allows farmers to upload crop images and receive instant diagnosis of pest or disease issues, along with GenAI-generated insights for treatment and prevention.
//                 </p>
//                 <h4 style={{ marginTop: '10px' }}>Technologies:</h4>
//                 <p>
//                   TensorFlow, Keras, OpenCV, React, Django REST Framework, HuggingFace, Material UI, WebSockets, PostgreSQL
//                 </p>
                
//                 <div style={styles.projectTags}>
//                   <span style={styles.tag}>React</span>
//                   <span style={styles.tag}>Django</span>
//                   <span style={styles.tag}>PostgreSQL</span>
//                 </div>
//                 <div style={styles.projectLinks}>
//                   <a href="https://github.com/umarkhemis/Crop_Disease_Detector" style={styles.projectLink}>
//                     <Github size={16} />
//                     Github
//                   </a>
//                   {/* <button style={styles.projectLink}>
//                     <ExternalLink size={16} />
//                     Live Demo
//                   </button> */}
//                 </div>
//               </div>
//             </div>

//             <div style={styles.projectCard}>
//               <div style={styles.projectImage}>
//                 <div style={{
//                   width: '100%',
//                   height: '200px',
//                   backgroundColor: '#f3f4f6',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   color: '#9ca3af',
//                   fontSize: '1rem'
//                 }}>
//                   Project Screenshot
//                 </div>
//               </div>
//               <div style={styles.projectContent}>
//                 <h2>Ad Platform</h2>
//                 <h4>Description:</h4>
//                 <p>
//                   A web platform that allows business, and sales personels to advertise their products.
//                 </p>
//                 <h4 style={{ marginTop: '10px' }}>Technologies:</h4>
//                 <p>
//                   React, Django REST Framework, PostgreSQL
//                 </p>
                
//                 <div style={styles.projectTags}>
//                   <span style={styles.tag}>React</span>
//                   <span style={styles.tag}>Django</span>
//                   <span style={styles.tag}>PostgreSQL</span>
//                 </div>
//                 <div style={styles.projectLinks}>
//                   <a href="https://github.com/umarkhemis/Ad_Platform" style={styles.projectLink}>
//                     <Github size={16} />
//                     Github
//                   </a>
//                   {/* <button style={styles.projectLink}>
//                     <ExternalLink size={16} />
//                     Live Demo
//                   </button> */}
//                 </div>
//               </div>
//             </div>

//             <div style={styles.projectCard}>
//               <div style={styles.projectImage}>
//                 <div style={{
//                   width: '100%',
//                   height: '200px',
//                   backgroundColor: '#f3f4f6',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   color: '#9ca3af',
//                   fontSize: '1rem'
//                 }}>
//                   Project Screenshot
//                   {/* <span><img src={ads_platform_image} alt="Project Screenshot"/></span> */}
//                 </div>
//               </div>
//               <div style={styles.projectContent}>
//                 <h2>Cabbage Blackrot Detection System</h2>
//                 <h4>Description:</h4>
//                 <p>
//                   A mobile version of the crop health prediction system but specifically for cabbage black rot with camera capture, image upload, and disease insight integration.
//                 </p>
//                 <h4 style={{ marginTop: '10px' }}>Technologies:</h4>
//                 <p>
//                   Tensorflow, React Native, Expo, Django REST API,
//                 </p>

//                 <div style={styles.projectTags}>
//                   <span style={styles.tag}>React Native</span>
//                   <span style={styles.tag}>Django</span>
//                   <span style={styles.tag}>PostgreSQL</span>
//                 </div>
//                 <div style={styles.projectLinks}>
//                   <a href="https://github.com/umarkhemis/Django_Cabbage_Doctor" style={styles.projectLink}>
//                     <Github size={16} />
//                     Github
//                   </a>
//                   {/* <button style={styles.projectLink}>
//                     <ExternalLink size={16} />
//                     Live Demo
//                   </button> */}
//                 </div>
//               </div>
//             </div>

//             <div style={styles.projectCard}>
//               <div style={styles.projectImage}>
//                 <div style={{
//                   width: '100%',
//                   height: '200px',
//                   backgroundColor: '#f3f4f6',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   color: '#9ca3af',
//                   fontSize: '1rem'
//                 }}>
//                   Project Screenshot
//                 </div>
//               </div>
//               <div style={styles.projectContent}>
//                 <h2>Notes_Keeper</h2>
//                 <h4>Description:</h4>
//                 <p>
//                   A full-stack web application for taking and storing notes, updating as well as deleting the notes
//                 </p>
//                 <h4 style={{ marginTop: '10px' }}>Technologies:</h4>
//                 <p>
//                   Reactjs, Django REST API, PostgreSQL
//                 </p>
                
//                 <div style={styles.projectTags}>
//                   <span style={styles.tag}>React</span>
//                   <span style={styles.tag}>Django</span>
//                   <span style={styles.tag}>PostgreSQL</span>
//                 </div>
//                 <div style={styles.projectLinks}>
//                   <a href="https://github.com/umarkhemis/Notes_app" style={styles.projectLink}>
//                     <Github size={16} />
//                     Github
//                   </a>
//                   {/* <button style={styles.projectLink}>
//                     <ExternalLink size={16} />
//                     Live Demo
//                   </button> */}
//                 </div>
//               </div>
//             </div>

//             <div style={styles.projectCard}>
//               <div style={styles.projectImage}>
//                 <div style={{
//                   width: '100%',
//                   height: '200px',
//                   backgroundColor: '#f3f4f6',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   color: '#9ca3af',
//                   fontSize: '1rem'
//                 }}>
//                    Project Screenshot
//                   {/* <div className="image-placeholder"> */}
//                   {/* <span><img src={notes_keeper_image} alt="Project Screenshot"/></span> */}
//                   {/* <span><img src={logo} alt="" style={{marginLeft: '190px'}}/></span> */}
//                   {/* </div> */}
//                 </div>
//               </div>
//               <div style={styles.projectContent}>
//                 <h2>Certificate Verifier</h2>
//                 <h4>Description:</h4>
//                 <p>
//                   A blockchain web application that allows institutions to issue tamper proof transcripts to students, and also allows easy verification of transcripts
//                 </p>
//                 <h4 style={{ marginTop: '10px' }}>Technologies:</h4>
//                 <p>
//                   Smart Contracts with Solidity, Reactjs
//                 </p>

//                 <div style={styles.projectTags}>
//                   <span style={styles.tag}>React</span>
//                   <span style={styles.tag}>Solidity</span>
//                   <span style={styles.tag}>Blockchain</span>
//                 </div>
//                 <div style={styles.projectLinks}>
//                   <a href="https://github.com/umarkhemis/Certificate_Verifier" style={styles.projectLink}>
//                     <Github size={16} />
//                     Github
//                   </a>
//                   {/* <button style={styles.projectLink}>
//                     <ExternalLink size={16} />
//                     Live Demo
//                   </button> */}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Contact Section */}
//       <section id="contact" style={styles.contactSection}>
//         <div style={styles.container}>
//           <div style={styles.sectionHeader}>
//             <h2 style={styles.sectionTitle}>Get In Touch</h2>
//             <p style={styles.sectionSubtitle}>Let's discuss your next project</p>
//           </div>
          
//           <div style={styles.contactContent}>
//             <div style={styles.contactInfo}>
//               <div style={styles.contactItem}>
//                 <Mail style={styles.contactIcon} size={24} />
//                 <div>
//                   <h3>Email</h3>
//                   <p>umarkhemis9@gmail.com</p>
//                 </div>
//               </div>
              
//               <div style={styles.contactItem}>
//                 <Github style={styles.contactIcon} size={24} />
//                 <div>
//                   <h3>GitHub</h3>
//                   <p>github.com/umarkhemis</p>
//                 </div>
//               </div>
              
//               <div style={styles.contactItem}>
//                 <Linkedin style={styles.contactIcon} size={24} />
//                 <div>
//                   <h3>LinkedIn</h3>
//                   <p>linkedin.com/in/ahmed-umar-khemis</p>
//                 </div>
//               </div>
//             </div>
            
//             <div style={styles.contactForm}>
//               <form style={styles.form}>
//                 <div style={styles.formGroup}>
//                   <input 
//                     type="text" 
//                     placeholder="Your Name" 
//                     style={styles.formInput}
//                   />
//                 </div>
                
//                 <div style={styles.formGroup}>
//                   <input 
//                     type="email" 
//                     placeholder="Your Email" 
//                     style={styles.formInput}
//                   />
//                 </div>
                
//                 <div style={styles.formGroup}>
//                   <textarea 
//                     placeholder="Your Message" 
//                     rows="5"
//                     style={styles.formTextarea}
//                   ></textarea>
//                 </div>
                
//                 <button type="submit" style={styles.btnPrimary}>
//                   Send Message
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer style={styles.footer}>
//         <div style={styles.container}>
//           <div style={styles.footerContent}>
//             <p>&copy; 2024 Ahmed Umar Khemis. All rights reserved.</p>
//             <div style={styles.socialLinks}>
//               <a href="https://github.com/umarkhemis" style={styles.socialLink}>
//                 <Github size={20} />
//               </a>
//               <a href="https://linkedin.com/in/ahmed-umar-khemis" style={styles.socialLink}>
//                 <Linkedin size={20} />
//               </a>
//               <a href="mailto:umarkhemis9@gmail.com" style={styles.socialLink}>
//                 <Mail size={20} />
//               </a>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// // Styles object
// const styles = {
//   app: {
//     fontFamily: 'Arial, sans-serif',
//     lineHeight: '1.6',
//     color: '#333',
//     position: 'relative',
//     minHeight: '100vh',
//   },
  
//   threejsBackground: {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     zIndex: -1,
//     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//   },

//   // Navbar Styles
//   navbar: {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.9)',
//     backdropFilter: 'blur(10px)',
//     zIndex: 1000,
//     padding: '1rem 0',
//   },
  
//   navContainer: {
//     maxWidth: '1200px',
//     margin: '0 auto',
//     padding: '0 2rem',
//   },
  
//   navContent: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
  
//   logo: {
//     fontSize: '1.5rem',
//     fontWeight: 'bold',
//     color: 'white',
//   },
  
//   desktopNav: {
//     display: 'flex',
//     '@media (max-width: 768px)': {
//       display: 'none',
//     },
//   },
  
//   navLinks: {
//     display: 'flex',
//     gap: '2rem',
//   },
  
//   navLink: {
//     color: 'white',
//     textDecoration: 'none',
//     fontSize: '1rem',
//     border: 'none',
//     background: 'none',
//     cursor: 'pointer',
//     transition: 'color 0.3s',
//     ':hover': {
//       color: '#4f46e5',
//     },
//   },
  
//   mobileMenuButton: {
//     display: 'none',
//     '@media (max-width: 768px)': {
//       display: 'block',
//     },
//   },
  
//   menuToggle: {
//     background: 'none',
//     border: 'none',
//     color: 'white',
//     cursor: 'pointer',
//   },
  
//   mobileNav: {
//     display: 'block',
//     '@media (min-width: 769px)': {
//       display: 'none',
//     },
//   },
  
//   mobileNavContent: {
//     backgroundColor: 'rgba(0, 0, 0, 0.95)',
//     padding: '2rem',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '1rem',
//   },
  
//   mobileNavLink: {
//     color: 'white',
//     fontSize: '1.2rem',
//     border: 'none',
//     background: 'none',
//     cursor: 'pointer',
//     padding: '0.5rem 0',
//     textAlign: 'left',
//   },

//   // Hero Section Styles
//   heroSection: {
//     minHeight: '100vh',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: '8rem 2rem 4rem',
//     position: 'relative',
//   },
  
//   heroContainer: {
//     maxWidth: '1200px',
//     width: '100%',
//     textAlign: 'center',
//   },
  
//   heroContent: {
//     marginBottom: '4rem',
//   },
  
//   heroBox: {
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     backdropFilter: 'blur(10px)',
//     padding: '3rem',
//     borderRadius: '20px',
//     border: '1px solid rgba(255, 255, 255, 0.2)',
//     marginBottom: '3rem',
//   },
  
//   heroTitle: {
//     fontSize: '3rem',
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: '2rem',
//     '@media (max-width: 768px)': {
//       fontSize: '2rem',
//     },
//   },
  
//   heroName: {
//     color: '#4f46e5',
//   },
  
//   heroDescription: {
//     fontSize: '1.2rem',
//     color: 'rgba(255, 255, 255, 0.9)',
//     maxWidth: '800px',
//     margin: '0 auto',
//     lineHeight: '1.8',
//     '@media (max-width: 768px)': {
//       fontSize: '1rem',
//     },
//   },
  
//   heroButtons: {
//     display: 'flex',
//     gap: '2rem',
//     justifyContent: 'center',
//     '@media (max-width: 768px)': {
//       flexDirection: 'column',
//       gap: '1rem',
//     },
//   },
  
//   btnPrimary: {
//     backgroundColor: '#4f46e5',
//     color: 'white',
//     padding: '1rem 2rem',
//     fontSize: '1.1rem',
//     border: 'none',
//     borderRadius: '50px',
//     cursor: 'pointer',
//     transition: 'all 0.3s',
//     ':hover': {
//       backgroundColor: '#3730a3',
//       transform: 'translateY(-2px)',
//     },
//   },
  
//   btnSecondary: {
//     backgroundColor: 'transparent',
//     color: 'white',
//     padding: '1rem 2rem',
//     fontSize: '1.1rem',
//     border: '2px solid white',
//     borderRadius: '50px',
//     cursor: 'pointer',
//     transition: 'all 0.3s',
//     ':hover': {
//       backgroundColor: 'white',
//       color: '#333',
//     },
//   },
  
//   heroChevron: {
//     position: 'absolute',
//     bottom: '2rem',
//     left: '50%',
//     transform: 'translateX(-50%)',
//     animation: 'bounce 2s infinite',
//   },
  
//   chevronIcon: {
//     color: 'white',
//     opacity: 0.7,
//   },

//   // Common Section Styles
//   container: {
//     maxWidth: '1200px',
//     margin: '0 auto',
//     padding: '0 2rem',
//   },
  
//   sectionHeader: {
//     textAlign: 'center',
//     marginBottom: '4rem',
//   },
  
//   sectionTitle: {
//     fontSize: '3rem',
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: '1rem',
//     '@media (max-width: 768px)': {
//       fontSize: '2rem',
//     },
//   },
  
//   sectionSubtitle: {
//     fontSize: '1.2rem',
//     color: 'rgba(255, 255, 255, 0.8)',
//   },

//   // About Section Styles
//   aboutSection: {
//     padding: '8rem 0',
//     backgroundColor: 'rgba(0, 0, 0, 0.3)',
//     backdropFilter: 'blur(10px)',
//   },
  
//   aboutContent: {
//     display: 'grid',
//     gridTemplateColumns: '1fr 2fr',
//     gap: '4rem',
//     alignItems: 'center',
//     '@media (max-width: 768px)': {
//       gridTemplateColumns: '1fr',
//       gap: '2rem',
//     },
//   },
  
//   aboutImage: {
//     textAlign: 'center',
//   },
  
//   imagePlaceholder: {
//     marginBottom: '19rem',
//     marginLeft: '-50px'
//   },
  
//   aboutText: {
//     color: 'white',
//     marginLeft: '-20px'
//   },
  
//   aboutTitle: {
//     fontSize: '2rem',
//     marginBottom: '1.5rem',
//     color: '#4f46e5',
//   },
  
//   aboutParagraph: {
//     fontSize: '1.1rem',
//     marginBottom: '1.5rem',
//     lineHeight: '1.8',
//     color: 'rgba(255, 255, 255, 0.9)',
//   },
  
//   skillsGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//     gap: '2rem',
//     marginTop: '2rem',
//   },
  
//   skillItem: {
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     padding: '1.5rem',
//     borderRadius: '10px',
//     border: '1px solid rgba(255, 255, 255, 0.2)',
//   },

//   // Skills Section Styles
//   skillsSection: {
//     padding: '8rem 0',
//     backgroundColor: 'rgba(0, 0, 0, 0.2)',
//   },
  
//   skillsCards: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
//     gap: '2rem',
//   },
  
//   skillCard: {
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     backdropFilter: 'blur(10px)',
//     padding: '2rem',
//     borderRadius: '15px',
//     border: '1px solid rgba(255, 255, 255, 0.2)',
//     color: 'white',
//   },
  
//   skillProgress: {
//     marginTop: '1.5rem',
//   },
  
//   skillItemProgress: {
//     marginBottom: '1.5rem',
//   },
  
//   skillInfo: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     marginBottom: '0.5rem',
//   },
  
//   skillPercentage: {
//     color: '#ffffffff',
//     fontWeight: 'bold',
//   },
  
//   progressBar: {
//     width: '100%',
//     height: '8px',
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     borderRadius: '4px',
//     overflow: 'hidden',
//   },
  
//   progressFill: {
//     height: '100%',
//     backgroundColor: '#4f46e5',
//     borderRadius: '4px',
//     transition: 'width 1s ease',
//   },

//   // Projects Section Styles
//   projectsSection: {
//     padding: '8rem 0',
//     backgroundColor: 'rgba(0, 0, 0, 0.3)',
//   },
  
//   projectsGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
//     gap: '3rem',
//     '@media (max-width: 768px)': {
//       gridTemplateColumns: '1fr',
//     },
//   },
  
//   projectCard: {
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     backdropFilter: 'blur(10px)',
//     borderRadius: '15px',
//     border: '1px solid rgba(255, 255, 255, 0.2)',
//     overflow: 'hidden',
//     transition: 'transform 0.3s, box-shadow 0.3s',
//     ':hover': {
//       transform: 'translateY(-10px)',
//       boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
//     },
//   },
  
//   projectImage: {
//     width: '100%',
//     height: '200px',
//     overflow: 'hidden',
//   },
  
//   projectContent: {
//     padding: '2rem',
//     color: 'white',
//   },
  
//   projectTags: {
//     display: 'flex',
//     gap: '1rem',
//     marginBottom: '1rem',
//     flexWrap: 'wrap',
//   },
  
//   tag: {
//     backgroundColor: '#4f46e5',
//     color: 'white',
//     padding: '0.3rem 0.8rem',
//     borderRadius: '20px',
//     fontSize: '0.8rem',
//   },
  
//   projectLinks: {
//     display: 'flex',
//     gap: '1rem',
//   },
  
//   projectLink: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '0.5rem',
//     color: '#ffffffff',
//     textDecoration: 'none',
//     padding: '0.5rem 1rem',
//     border: '1px solid #eaeaf3ff',
//     borderRadius: '25px',
//     fontSize: '0.9rem',
//     background: 'none',
//     cursor: 'pointer',
//     transition: 'all 0.3s',
//     ':hover': {
//       backgroundColor: '#4f46e5',
//       color: 'white',
//     },
//   },

//   // Contact Section Styles
//   contactSection: {
//     padding: '8rem 0',
//     backgroundColor: 'rgba(0, 0, 0, 0.4)',
//   },
  
//   contactContent: {
//     display: 'grid',
//     gridTemplateColumns: '1fr 2fr',
//     gap: '4rem',
//     '@media (max-width: 768px)': {
//       gridTemplateColumns: '1fr',
//       gap: '2rem',
//     },
//   },
  
//   contactInfo: {
//     color: 'white',
//   },
  
//   contactItem: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '1rem',
//     marginBottom: '2rem',
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     padding: '1.5rem',
//     borderRadius: '10px',
//     border: '1px solid rgba(255, 255, 255, 0.2)',
//   },
  
//   contactIcon: {
//     color: '#4f46e5',
//   },
  
//   contactForm: {
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     backdropFilter: 'blur(10px)',
//     padding: '2rem',
//     borderRadius: '15px',
//     border: '1px solid rgba(255, 255, 255, 0.2)',
//   },
  
//   form: {
//     width: '100%',
//   },
  
//   formGroup: {
//     marginBottom: '1.5rem',
//   },
  
//   formInput: {
//     width: '100%',
//     padding: '1rem',
//     fontSize: '1rem',
//     border: '1px solid rgba(255, 255, 255, 0.3)',
//     borderRadius: '10px',
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     color: 'white',
//     '::placeholder': {
//       color: 'rgba(255, 255, 255, 0.7)',
//     },
//   },
  
//   formTextarea: {
//     width: '100%',
//     padding: '1rem',
//     fontSize: '1rem',
//     border: '1px solid rgba(255, 255, 255, 0.3)',
//     borderRadius: '10px',
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     color: 'white',
//     resize: 'vertical',
//     fontFamily: 'inherit',
//     '::placeholder': {
//       color: 'rgba(255, 255, 255, 0.7)',
//     },
//   },

//   // Footer Styles
//   footer: {
//     backgroundColor: 'rgba(0, 0, 0, 0.9)',
//     padding: '2rem 0',
//     color: 'white',
//   },
  
//   footerContent: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     '@media (max-width: 768px)': {
//       flexDirection: 'column',
//       gap: '1rem',
//     },
//   },
  
//   socialLinks: {
//     display: 'flex',
//     gap: '1rem',
//   },
  
//   socialLink: {
//     color: 'white',
//     padding: '0.5rem',
//     borderRadius: '50%',
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     transition: 'all 0.3s',
//     textDecoration: 'none',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     ':hover': {
//       backgroundColor: '#4f46e5',
//       transform: 'translateY(-2px)',
//     },
//   },
// };

// export default App;


































































// import React, { useState, useEffect, useRef } from 'react';
// import { Menu, X, Github, Linkedin, Mail, ExternalLink, ChevronDown } from 'lucide-react';
// import { Code, Smartphone, Eye, Sparkles, Brain, Briefcase } from 'lucide-react';
// import * as THREE from 'three';
// import './index.css'
// import logo from './assets/my_image.jpg'

// const App = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const mountRef = useRef(null);
//   const sceneRef = useRef(null);
//   const animationIdRef = useRef(null);

//   // Three.js setup
//   useEffect(() => {
//     if (!mountRef.current) return;

//     // Scene setup
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setClearColor(0x000000, 0);
//     mountRef.current.appendChild(renderer.domElement);

//     // Create floating particles
//     const particlesGeometry = new THREE.BufferGeometry();
//     const particlesCount = 1000;
//     const posArray = new Float32Array(particlesCount * 3);

//     for (let i = 0; i < particlesCount * 3; i++) {
//       posArray[i] = (Math.random() - 0.5) * 100;
//     }

//     particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
//     const particlesMaterial = new THREE.PointsMaterial({
//       size: 0.8,
//       color: 0x4f46e5,
//       transparent: true,
//       opacity: 0.6
//     });

//     const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
//     scene.add(particlesMesh);

//     // Create geometric shapes
//     const geometry1 = new THREE.IcosahedronGeometry(8, 0);
//     const material1 = new THREE.MeshBasicMaterial({
//       color: 0x4f46e5,
//       wireframe: true,
//       transparent: true,
//       opacity: 0.3
//     });
//     const icosahedron = new THREE.Mesh(geometry1, material1);
//     icosahedron.position.set(-30, 10, -20);
//     scene.add(icosahedron);

//     const geometry2 = new THREE.TorusGeometry(6, 2, 8, 16);
//     const material2 = new THREE.MeshBasicMaterial({
//       color: 0x7c3aed,
//       wireframe: true,
//       transparent: true,
//       opacity: 0.4
//     });
//     const torus = new THREE.Mesh(geometry2, material2);
//     torus.position.set(25, -15, -25);
//     scene.add(torus);

//     const geometry3 = new THREE.OctahedronGeometry(5, 0);
//     const material3 = new THREE.MeshBasicMaterial({
//       color: 0x06b6d4,
//       wireframe: true,
//       transparent: true,
//       opacity: 0.3
//     });
//     const octahedron = new THREE.Mesh(geometry3, material3);
//     octahedron.position.set(0, 20, -30);
//     scene.add(octahedron);

//     camera.position.z = 30;

//     sceneRef.current = { scene, camera, renderer, particlesMesh, icosahedron, torus, octahedron };

//     // Animation loop
//     const animate = () => {
//       animationIdRef.current = requestAnimationFrame(animate);

//       // Rotate particles
//       particlesMesh.rotation.x += 0.001;
//       particlesMesh.rotation.y += 0.002;

//       // Rotate geometric shapes
//       icosahedron.rotation.x += 0.01;
//       icosahedron.rotation.y += 0.01;

//       torus.rotation.x += 0.008;
//       torus.rotation.z += 0.005;

//       octahedron.rotation.x += 0.006;
//       octahedron.rotation.y += 0.008;

//       renderer.render(scene, camera);
//     };

//     animate();

//     // Handle resize
//     const handleResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };

//     window.addEventListener('resize', handleResize);

//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', handleResize);
//       if (animationIdRef.current) {
//         cancelAnimationFrame(animationIdRef.current);
//       }
//       if (mountRef.current && renderer.domElement) {
//         mountRef.current.removeChild(renderer.domElement);
//       }
//       renderer.dispose();
//     };
//   }, []);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const scrollToSection = (sectionId) => {
//     const element = document.getElementById(sectionId);
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth' });
//     }
//     setIsMenuOpen(false);
//   };

//   return (
//     <div style={styles.app}>
//       {/* 3D Background */}
//       <div ref={mountRef} style={styles.threejsBackground} />

//       {/* Navbar */}
//       <nav style={styles.navbar}>
//         <div style={styles.navContainer}>
//           <div style={styles.navContent}>
//             <div style={styles.logo}>
//               <h1 style={styles.logoText}>AUK</h1>
//             </div>
            
//             {/* Desktop Navigation */}
//             <div style={styles.desktopNav}>
//               <div style={styles.navLinks}>
//                 <button onClick={() => scrollToSection('home')} style={styles.navLink}>
//                   Home
//                 </button>
//                 <button onClick={() => scrollToSection('about')} style={styles.navLink}>
//                   About
//                 </button>
//                 <button onClick={() => scrollToSection('skills')} style={styles.navLink}>
//                   Skills
//                 </button>
//                 <button onClick={() => scrollToSection('projects')} style={styles.navLink}>
//                   Projects
//                 </button>
//                 <button onClick={() => scrollToSection('contact')} style={styles.navLink}>
//                   Contact
//                 </button>
//               </div>
//             </div>

//             {/* Mobile menu button */}
//             <div style={styles.mobileMenuButton}>
//               <button onClick={toggleMenu} style={styles.menuToggle}>
//                 {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <div style={styles.mobileNav}>
//             <div style={styles.mobileNavContent}>
//               <button onClick={() => scrollToSection('home')} style={styles.mobileNavLink}>
//                 Home
//               </button>
//               <button onClick={() => scrollToSection('about')} style={styles.mobileNavLink}>
//                 About
//               </button>
//               <button onClick={() => scrollToSection('skills')} style={styles.mobileNavLink}>
//                 Skills
//               </button>
//               <button onClick={() => scrollToSection('projects')} style={styles.mobileNavLink}>
//                 Projects
//               </button>
//               <button onClick={() => scrollToSection('contact')} style={styles.mobileNavLink}>
//                 Contact
//               </button>
//             </div>
//           </div>
//         )}
//       </nav>

//       {/* Hero Section */}
//       <section id="home" style={styles.heroSection}>
//         <div style={styles.heroContainer}>
//           <div style={styles.heroContent}>
//             <h1 style={styles.heroTitle}>
//               Hello, I'm <span style={styles.heroName}>Ahmed Umar Khemis</span>
//             </h1>
//             <p style={styles.heroDescription}>
//               A passionate and results-driven Computer Science student at Kabale University with a strong foundation in machine learning, web development, and mobile application design. I have a keen interest in solving real-world problems using technology, particularly in the fields of agriculture, healthcare, and smart systems.
//               <br /><br />
//               My experience spans across AI/ML model development, full-stack web and mobile app development, computer vision, and AIoT. I enjoy turning ideas into scalable software solutions and continuously expanding my knowledge through hands-on projects and collaborative development.
//               <br /><br />
//               I hold certifications from institutions like Harvard's CS50, Kaggle, and Alison, and I'm always looking forward to contributing to impactful tech solutions, especially in underrepresented communities.
//             </p>

//             <div style={styles.heroButtons}>
//               <button 
//                 onClick={() => scrollToSection('projects')}
//                 style={styles.btnPrimary}
//               >
//                 View My Work
//               </button>
//               <button 
//                 onClick={() => scrollToSection('contact')}
//                 style={styles.btnSecondary}
//               >
//                 Get In Touch
//               </button>
//             </div>
//           </div>
//           <div style={styles.heroChevron}>
//             <ChevronDown style={styles.chevronIcon} size={32} />
//           </div>
//         </div>
//       </section>

//         {/* About Section */}
//       <section id="about" className="about-section">
//         <div className="container">
//           <div className="section-header">
//             <h2 className="section-title">About Me</h2>
//             <p className="section-subtitle">Get to know more about my background and expertise</p>
//           </div>
        
//           <div className="about-content">
//             <div className="about-image">
//               <div className="image-placeholder">
//                 <span><img src={logo} alt="" style={{marginLeft: '190px'}}/></span>
//               </div>
//             </div>
          
//             <div className="about-text">
//               <h3 className="about-title">Passionate Developer & Designer</h3>
//               <p className="about-paragraph">
//                 Am a passionate and results-driven Computer Science student at Kabale University with a strong foundation in Machine Learning, Deep Learning, Computer Vision, GenAI, web development, mobile application design, and Penetration Testing. I have a keen interest in solving real-world problems using technology, particularly in the fields of agriculture, healthcare, education, and smart systems.
//                 My experience spans across AI/ML model development, full-stack web and mobile app development, computer vision,and AIoT. I enjoy turning ideas into scalable software solutions and continuously expanding my knowledge through hands-on projects and collaborative development.
//                 I hold certifications from institutions like Harvard's CS50, Kaggle, and Alison, Udemy, Cousera, and I'm always looking forward to contributing to impactful tech solutions, especially in underrepresented communities.
//               </p>
//               {/* <p className="about-paragraph">
//                 When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, 
//                 or sharing knowledge with the developer community.
//               </p> */}
//               <div className="skills-grid">
//                 <div className="skill-item">
//                   <h4>AI/ML</h4>
//                   <p>Tensorflow, Scikit-learn, OpenCV, YOLO, U-Net</p>
//                 </div>
//                 <div className="skill-item">
//                   <h4>Hardware Programming</h4>
//                   <p>Raspberry pi, Arduino</p>
//                 </div>
//                 <div className="skill-item">
//                   <h4>Frontend</h4>
//                   <p>React, TypeScript</p>
//                 </div>
//                 <div className="skill-item">
//                   <h4>Backend</h4>
//                   <p>Django, Flask</p>
//                 </div>
//                 <div className="skill-item">
//                   <h4>Mobile Development</h4>
//                   <p>Android Studio, React Native</p>
//                 </div>
//                 <div className="skill-item">
//                   <h4>Databases</h4>
//                   <p>SQLServer, PostgreSQL, GraphQL, MySQL</p>
//                 </div>
//                 <div className="skill-item">
//                   <h4>Tools</h4>
//                   <p>Git, Docker, AWS</p>
//                 </div>
//                 <div className="skill-item">
//                   <h4>Design</h4>
//                   <p>Figma, Canva</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Skills Section */}
//       <section id="skills" style={styles.skillsSection}>
//         <div style={styles.container}>
//           <div style={styles.sectionHeader}>
//             <h2 style={styles.sectionTitle}>Skills & Technologies</h2>
//             <p style={styles.sectionSubtitle}>Technologies I work with regularly</p>
//           </div>
          
//           <div style={styles.skillsCards}>
//             <div style={styles.skillCard}>
//               <h3>AI/ML/DL</h3>
//               <div style={styles.skillProgress}>
//                 <div style={styles.skillItemProgress}>
//                   <div style={styles.skillInfo}>
//                     <span>Tensorflow</span>
//                     <span style={styles.skillPercentage}>90%</span>
//                   </div>
//                   <div style={styles.progressBar}>
//                     <div style={{...styles.progressFill, width: '90%'}}></div>
//                   </div>
//                 </div>
//                 <div style={styles.skillItemProgress}>
//                   <div style={styles.skillInfo}>
//                     <span>Scikit-learn</span>
//                     <span style={styles.skillPercentage}>85%</span>
//                   </div>
//                   <div style={styles.progressBar}>
//                     <div style={{...styles.progressFill, width: '85%'}}></div>
//                   </div>
//                 </div>
//                 <div style={styles.skillItemProgress}>
//                   <div style={styles.skillInfo}>
//                     <span>YOLO</span>
//                     <span style={styles.skillPercentage}>77%</span>
//                   </div>
//                   <div style={styles.progressBar}>
//                     <div style={{...styles.progressFill, width: '77%'}}></div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div style={styles.skillCard}>
//               <h3>Frontend Development</h3>
//               <div style={styles.skillProgress}>
//                 <div style={styles.skillItemProgress}>
//                   <div style={styles.skillInfo}>
//                     <span>React</span>
//                     <span style={styles.skillPercentage}>90%</span>
//                   </div>
//                   <div style={styles.progressBar}>
//                     <div style={{...styles.progressFill, width: '90%'}}></div>
//                   </div>
//                 </div>
//                 <div style={styles.skillItemProgress}>
//                   <div style={styles.skillInfo}>
//                     <span>TypeScript</span>
//                     <span style={styles.skillPercentage}>85%</span>
//                   </div>
//                   <div style={styles.progressBar}>
//                     <div style={{...styles.progressFill, width: '85%'}}></div>
//                   </div>
//                 </div>
//                 <div style={styles.skillItemProgress}>
//                   <div style={styles.skillInfo}>
//                     <span>CSS</span>
//                     <span style={styles.skillPercentage}>95%</span>
//                   </div>
//                   <div style={styles.progressBar}>
//                     <div style={{...styles.progressFill, width: '95%'}}></div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div style={styles.skillCard}>
//               <h3>Backend Development</h3>
//               <div style={styles.skillProgress}>
//                 <div style={styles.skillItemProgress}>
//                   <div style={styles.skillInfo}>
//                     <span>Django</span>
//                     <span style={styles.skillPercentage}>80%</span>
//                   </div>
//                   <div style={styles.progressBar}>
//                     <div style={{...styles.progressFill, width: '80%'}}></div>
//                   </div>
//                 </div>
//                 <div style={styles.skillItemProgress}>
//                   <div style={styles.skillInfo}>
//                     <span>Python</span>
//                     <span style={styles.skillPercentage}>75%</span>
//                   </div>
//                   <div style={styles.progressBar}>
//                     <div style={{...styles.progressFill, width: '75%'}}></div>
//                   </div>
//                 </div>
//                 <div style={styles.skillItemProgress}>
//                   <div style={styles.skillInfo}>
//                     <span>PostgreSQL</span>
//                     <span style={styles.skillPercentage}>70%</span>
//                   </div>
//                   <div style={styles.progressBar}>
//                     <div style={{...styles.progressFill, width: '70%'}}></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Projects Section */}
//       <section id="projects" style={styles.projectsSection}>
//         <div style={styles.container}>
//           <div style={styles.sectionHeader}>
//             <h2 style={styles.sectionTitle}>Featured Projects</h2>
//             <p style={styles.sectionSubtitle}>Some of my recent work</p>
//           </div>
          
//           <div style={styles.projectsGrid}>
//             <div style={styles.projectCard}>
//               <div style={styles.projectContent}>
//                 <h2>Crop Pest & Disease Detection System</h2>
//                 <h4>Description:</h4>
//                 <p>
//                   An AI-powered web platform that allows farmers to upload crop images and receive instant diagnosis of pest or disease issues, along with GenAI-generated insights for treatment and prevention.
//                 </p>
//                 <h4 style={{ marginTop: '10px' }}>Technologies:</h4>
//                 <p>
//                   TensorFlow, Keras, OpenCV, React, Django REST Framework, HuggingFace, Material UI, WebSockets, PostgreSQL
//                 </p>
                
//                 <div style={styles.projectTags}>
//                   <span style={styles.tag}>React</span>
//                   <span style={styles.tag}>Django</span>
//                   <span style={styles.tag}>PostgreSQL</span>
//                 </div>
//                 <div style={styles.projectLinks}>
//                   <a href="https://github.com/umarkhemis/Crop_Disease_Detector" style={styles.projectLink}>
//                     <Github size={16} />
//                     Github
//                   </a>
//                 </div>
//               </div>
//             </div>

//             <div style={styles.projectCard}>
//               <div style={styles.projectContent}>
//                 <h2>Ad Platform</h2>
//                 <h4>Description:</h4>
//                 <p>
//                   A web platform that allows business, and sales personels to advertise their products.
//                 </p>
//                 <h4 style={{ marginTop: '10px' }}>Technologies:</h4>
//                 <p>
//                   React, Django REST Framework, PostgreSQL
//                 </p>
                
//                 <div style={styles.projectTags}>
//                   <span style={styles.tag}>React</span>
//                   <span style={styles.tag}>Django</span>
//                   <span style={styles.tag}>PostgreSQL</span>
//                 </div>
//                 <div style={styles.projectLinks}>
//                   <a href="https://github.com/umarkhemis/Ad_Platform" style={styles.projectLink}>
//                     <Github size={16} />
//                     Github
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Contact Section */}
//       <section id="contact" style={styles.contactSection}>
//         <div style={styles.container}>
//           <div style={styles.sectionHeader}>
//             <h2 style={styles.sectionTitle}>Get In Touch</h2>
//             <p style={styles.sectionSubtitle}>Let's discuss your next project</p>
//           </div>
          
//           <div style={styles.contactContent}>
//             <div style={styles.contactInfo}>
//               <h3>Let's Connect</h3>
//               <p>
//                 I'm always interested in hearing about new opportunities and interesting projects. 
//                 Whether you have a question or just want to say hello, I'd love to hear from you.
//               </p>
              
//               <div style={styles.contactDetails}>
//                 <div style={styles.contactItem}>
//                   <Mail size={24} />
//                   <a href="mailto:umarkhemis9@gmail.com" style={styles.contactLink}>umarkhemis9@gmail.com</a>
//                 </div>
//                 <div style={styles.contactItem}>
//                   <a href="https://github.com/umarkhemis" target="_blank" rel="noopener noreferrer" style={styles.contactLink}>
//                     <Github size={24} />
//                     GitHub
//                   </a>
//                 </div>
//                 <div style={styles.contactItem}>
//                   <a href="https://linkedin.com/in/ahmed-umar-khemis" target="_blank" rel="noopener noreferrer" style={styles.contactLink}>
//                     <Linkedin size={24} />
//                     LinkedIn
//                   </a>
//                 </div>
//               </div>
//             </div>
            
//             <div style={styles.contactForm}>
//               <div style={styles.formGroup}>
//                 <label htmlFor="name">Name</label>
//                 <input
//                   type="text"
//                   id="name"
//                   placeholder="Your Name"
//                   style={styles.formInput}
//                 />
//               </div>
//               <div style={styles.formGroup}>
//                 <label htmlFor="email">Email</label>
//                 <input
//                   type="email"
//                   id="email"
//                   placeholder="your.email@example.com"
//                   style={styles.formInput}
//                 />
//               </div>
//               <div style={styles.formGroup}>
//                 <label htmlFor="message">Message</label>
//                 <textarea
//                   id="message"
//                   rows={4}
//                   placeholder="Tell me about your project..."
//                   style={styles.formTextarea}
//                 ></textarea>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => alert('Contact form submitted!')}
//                 style={styles.btnPrimary}
//               >
//                 Send Message
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer style={styles.footer}>
//         <div style={styles.container}>
//           <div style={styles.footerContent}>
//             <div style={styles.footerMain}>
//               <h3>AHMED UMAR KHEMIS</h3>
//               <p>
//                 I'm Ahmed Umar Khemis, a passionate software developer specializing in AI/ML, Hardware Programming and System Automation, web apps, Mobile apps, and innovative tech. Welcome to my professional portfolio!
//               </p>
//               <div style={styles.footerSocial}>
//                 <Github size={24} />
//                 <Linkedin size={24} />
//                 <Mail size={24} />
//               </div>
//             </div>
            
//             <div style={styles.footerLinks}>
//               <h4>Quick Links</h4>
//               <ul style={styles.footerList}>
//                 <li><button onClick={() => scrollToSection('home')} style={styles.footerLink}>Home</button></li>
//                 <li><button onClick={() => scrollToSection('about')} style={styles.footerLink}>About</button></li>
//                 <li><button onClick={() => scrollToSection('skills')} style={styles.footerLink}>Skills</button></li>
//                 <li><button onClick={() => scrollToSection('projects')} style={styles.footerLink}>Projects</button></li>
//               </ul>
//             </div>
         
//             <div style={styles.footerServices}>
//               <h4>Services</h4>
//               <ul style={styles.servicesList}>
//                 <li style={styles.serviceItem}><Brain size={18} /> AI & Machine Learning</li>
//                 <li style={styles.serviceItem}><Eye size={18} /> Computer Vision Solutions</li>
//                 <li style={styles.serviceItem}><Sparkles size={18} /> Generative AI Applications</li>
//                 <li style={styles.serviceItem}><Code size={18} /> Web Development</li>
//                 <li style={styles.serviceItem}><Smartphone size={18} /> Mobile App Development</li>
//                 <li style={styles.serviceItem}><Briefcase size={18} /> Technology Consulting</li>
//               </ul>
//             </div>
//           </div>
          
//           <div style={styles.footerBottom}>
//             <p>© 2025 Ahmed-Umar-Khemis. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// // Styles object
// const styles = {
//   app: {
//     fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
//     margin: 0,
//     padding: 0,
//     boxSizing: 'border-box',
//     lineHeight: 1.6,
//     color: '#333',
//   },

//   threejsBackground: {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     zIndex: -1,
//     pointerEvents: 'none',
//   },

//   // Navbar styles
//   navbar: {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(255, 255, 255, 0.95)',
//     backdropFilter: 'blur(10px)',
//     borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
//     zIndex: 1000,
//     padding: '1rem 0',
//   },

//   navContainer: {
//     maxWidth: '1200px',
//     margin: '0 auto',
//     padding: '0 2rem',
//   },

//   navContent: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },

//   logo: {
//     fontSize: '1.5rem',
//     fontWeight: 'bold',
//   },

//   logoText: {
//     margin: 0,
//     color: '#4f46e5',
//   },

//   desktopNav: {
//     display: 'flex',
//   },

//   navLinks: {
//     display: 'flex',
//     gap: '2rem',
//   },

//   navLink: {
//     background: 'none',
//     border: 'none',
//     color: '#333',
//     fontSize: '1rem',
//     cursor: 'pointer',
//     padding: '0.5rem 0',
//     transition: 'color 0.3s ease',
//     ':hover': {
//       color: '#4f46e5',
//     },
//   },

//   mobileMenuButton: {
//     display: 'none',
//     '@media (max-width: 768px)': {
//       display: 'block',
//     },
//   },

//   menuToggle: {
//     background: 'none',
//     border: 'none',
//     cursor: 'pointer',
//     color: '#333',
//   },

//   mobileNav: {
//     backgroundColor: 'white',
//     borderTop: '1px solid rgba(0, 0, 0, 0.1)',
//     position: 'absolute',
//     top: '100%',
//     left: 0,
//     right: 0,
//   },

//   mobileNavContent: {
//     display: 'flex',
//     flexDirection: 'column',
//     padding: '1rem 2rem',
//   },

//   mobileNavLink: {
//     background: 'none',
//     border: 'none',
//     color: '#333',
//     fontSize: '1rem',
//     cursor: 'pointer',
//     padding: '1rem 0',
//     textAlign: 'left',
//     borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
//   },

//   // Hero Section styles
//   heroSection: {
//     minHeight: '100vh',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     position: 'relative',
//     background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
//   },

//   heroContainer: {
//     maxWidth: '1200px',
//     margin: '0 auto',
//     padding: '0 2rem',
//     textAlign: 'center',
//     position: 'relative',
//     zIndex: 10,
//   },

//   heroContent: {
//     maxWidth: '800px',
//     margin: '0 auto',
//   },

//   heroTitle: {
//     fontSize: 'clamp(2.5rem, 5vw, 4rem)',
//     fontWeight: '700',
//     marginBottom: '1.5rem',
//     color: '#1a1a1a',
//     textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//     animation: 'fadeInUp 1s ease-out',
//   },

//   heroName: {
//     background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
//     WebkitBackgroundClip: 'text',
//     WebkitTextFillColor: 'transparent',
//     backgroundClip: 'text',
//   },

//   heroDescription: {
//     fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
//     color: '#555',
//     marginBottom: '3rem',
//     lineHeight: '1.7',
//     textAlign: 'justify',
//     animation: 'fadeInUp 1s ease-out 0.3s both',
//   },

//   heroButtons: {
//     display: 'flex',
//     gap: '1.5rem',
//     justifyContent: 'center',
//     flexWrap: 'wrap',
//     animation: 'fadeInUp 1s ease-out 0.6s both',
//   },

//   btnPrimary: {
//     backgroundColor: '#4f46e5',
//     color: 'white',
//     border: 'none',
//     padding: '1rem 2rem',
//     fontSize: '1.1rem',
//     borderRadius: '8px',
//     cursor: 'pointer',
//     transition: 'all 0.3s ease',
//     fontWeight: '600',
//     boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)',
//     ':hover': {
//       backgroundColor: '#4338ca',
//       transform: 'translateY(-2px)',
//       boxShadow: '0 6px 20px rgba(79, 70, 229, 0.4)',
//     },
//   },

//   btnSecondary: {
//     backgroundColor: 'transparent',
//     color: '#4f46e5',
//     border: '2px solid #4f46e5',
//     padding: '1rem 2rem',
//     fontSize: '1.1rem',
//     borderRadius: '8px',
//     cursor: 'pointer',
//     transition: 'all 0.3s ease',
//     fontWeight: '600',
//     ':hover': {
//       backgroundColor: '#4f46e5',
//       color: 'white',
//       transform: 'translateY(-2px)',
//     },
//   },

//   heroChevron: {
//     position: 'absolute',
//     bottom: '2rem',
//     left: '50%',
//     transform: 'translateX(-50%)',
//     animation: 'bounce 2s infinite',
//   },

//   chevronIcon: {
//     color: '#4f46e5',
//     opacity: 0.7,
//   },

//   // Section styles
//   container: {
//     maxWidth: '1200px',
//     margin: '0 auto',
//     padding: '0 2rem',
//   },

//   sectionHeader: {
//     textAlign: 'center',
//     marginBottom: '4rem',
//   },

//   sectionTitle: {
//     fontSize: 'clamp(2rem, 4vw, 3rem)',
//     fontWeight: '700',
//     marginBottom: '1rem',
//     background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
//     WebkitBackgroundClip: 'text',
//     WebkitTextFillColor: 'transparent',
//     backgroundClip: 'text',
//   },

//   sectionSubtitle: {
//     fontSize: '1.2rem',
//     color: '#666',
//     maxWidth: '600px',
//     margin: '0 auto',
//   },

//   // Skills Section
//   skillsSection: {
//     padding: '6rem 0',
//     backgroundColor: 'white',
//   },

//   skillsCards: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
//     gap: '2rem',
//   },

//   skillCard: {
//     backgroundColor: '#f8fafc',
//     padding: '2rem',
//     borderRadius: '12px',
//     boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
//     border: '1px solid rgba(79, 70, 229, 0.1)',
//   },

//   skillProgress: {
//     marginTop: '1.5rem',
//   },

//   skillItemProgress: {
//     marginBottom: '1rem',
//   },

//   skillInfo: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     marginBottom: '0.5rem',
//     fontSize: '0.9rem',
//     fontWeight: '500',
//   },

//   skillPercentage: {
//     color: '#4f46e5',
//   },

//   progressBar: {
//     height: '6px',
//     backgroundColor: '#e5e7eb',
//     borderRadius: '3px',
//     overflow: 'hidden',
//   },

//   progressFill: {
//     height: '100%',
//     backgroundColor: '#4f46e5',
//     borderRadius: '3px',
//     transition: 'width 1s ease-in-out',
//   },

//   // Projects Section
//   projectsSection: {
//     padding: '6rem 0',
//     backgroundColor: '#f8fafc',
//   },

//   projectsGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
//     gap: '2rem',
//   },

//   projectCard: {
//     backgroundColor: 'white',
//     borderRadius: '12px',
//     overflow: 'hidden',
//     boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
//     transition: 'all 0.3s ease',
//     border: '1px solid rgba(79, 70, 229, 0.1)',
//     ':hover': {
//       transform: 'translateY(-5px)',
//       boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
//     },
//   },

//   projectContent: {
//     padding: '2rem',
//   },

//   projectTags: {
//     display: 'flex',
//     gap: '0.5rem',
//     flexWrap: 'wrap',
//     marginTop: '1rem',
//   },

//   tag: {
//     backgroundColor: '#e0e7ff',
//     color: '#4338ca',
//     padding: '0.25rem 0.75rem',
//     borderRadius: '20px',
//     fontSize: '0.8rem',
//     fontWeight: '500',
//   },

//   projectLinks: {
//     display: 'flex',
//     gap: '1rem',
//     marginTop: '1.5rem',
//   },

//   projectLink: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '0.5rem',
//     color: '#4f46e5',
//     textDecoration: 'none',
//     fontSize: '0.9rem',
//     fontWeight: '500',
//     padding: '0.5rem 1rem',
//     border: '1px solid #4f46e5',
//     borderRadius: '6px',
//     transition: 'all 0.3s ease',
//     ':hover': {
//       backgroundColor: '#4f46e5',
//       color: 'white',
//     },
//   },

  
//   contactSection: {
//     padding: '6rem 0',
//     backgroundColor: 'white',
//   },

//   contactContent: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
//     gap: '4rem',
//   },

//   contactInfo: {
//     fontSize: '1.1rem',
//     lineHeight: '1.8',
//   },

//   contactDetails: {
//     marginTop: '2rem',
//   },

//   contactItem: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '1rem',
//     marginBottom: '1rem',
//     padding: '1rem',
//     backgroundColor: '#f8fafc',
//     borderRadius: '8px',
//   },

//   contactLink: {
//     color: '#4f46e5',
//     textDecoration: 'none',
//     fontWeight: '500',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '0.5rem',
//     transition: 'color 0.3s ease',
//     ':hover': {
//       color: '#4338ca',
//     },
//   },

//   contactForm: {
//     backgroundColor: '#f8fafc',
//     padding: '2rem',
//     borderRadius: '12px',
//   },

//   formGroup: {
//     marginBottom: '1.5rem',
//   },

//   formInput: {
//     width: '100%',
//     padding: '1rem',
//     border: '1px solid #d1d5db',
//     borderRadius: '8px',
//     fontSize: '1rem',
//     transition: 'border-color 0.3s ease',
//     ':focus': {
//       outline: 'none',
//       borderColor: '#4f46e5',
//     },
//   },

//   formTextarea: {
//     width: '100%',
//     padding: '1rem',
//     border: '1px solid #d1d5db',
//     borderRadius: '8px',
//     fontSize: '1rem',
//     resize: 'vertical',
//     minHeight: '120px',
//     transition: 'border-color 0.3s ease',
//     ':focus': {
//       outline: 'none',
//       borderColor: '#4f46e5',
//     },
//   },

  
//   footer: {
//     backgroundColor: '#1a1a1a',
//     color: 'white',
//     padding: '3rem 0 1rem',
//   },

//   footerContent: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
//     gap: '2rem',
//     marginBottom: '2rem',
//   },

//   footerMain: {
//     maxWidth: '300px',
//   },

//   footerSocial: {
//     display: 'flex',
//     gap: '1rem',
//     marginTop: '1rem',
//   },

//   footerLinks: {
//     fontSize: '0.9rem',
//   },

//   footerList: {
//     listStyle: 'none',
//     padding: 0,
//     margin: '1rem 0 0 0',
//   },

//   footerLink: {
//     background: 'none',
//     border: 'none',
//     color: '#ccc',
//     cursor: 'pointer',
//     padding: '0.5rem 0',
//     display: 'block',
//     transition: 'color 0.3s ease',
//     ':hover': {
//       color: '#4f46e5',
//     },
//   },

//   footerServices: {
//     fontSize: '0.9rem',
//   },

//   servicesList: {
//     listStyle: 'none',
//     padding: 0,
//     margin: '1rem 0 0 0',
//   },

//   serviceItem: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '0.5rem',
//     marginBottom: '0.5rem',
//     color: '#ccc',
//   },

//   footerBottom: {
//     textAlign: 'center',
//     paddingTop: '2rem',
//     borderTop: '1px solid #333',
//     color: '#999',
//   },

 
//   '@media (max-width: 768px)': {
//     desktopNav: {
//       display: 'none',
//     },
//     mobileMenuButton: {
//       display: 'block',
//     },
//     heroButtons: {
//       flexDirection: 'column',
//       alignItems: 'center',
//     },
//     contactContent: {
//       gridTemplateColumns: '1fr',
//     },
//     skillsCards: {
//       gridTemplateColumns: '1fr',
//     },
//     projectsGrid: {
//       gridTemplateColumns: '1fr',
//     },
//     footerContent: {
//       gridTemplateColumns: '1fr',
//       textAlign: 'center',
//     },
//   },
// };


// const cssAnimations = `
//   @keyframes fadeInUp {
//     from {
//       opacity: 0;
//       transform: translateY(30px);
//     }
//     to {
//       opacity: 1;
//       transform: translateY(0);
//     }
//   }

//   @keyframes bounce {
//     0%, 20%, 50%, 80%, 100% {
//       transform: translateX(-50%) translateY(0);
//     }
//     40% {
//       transform: translateX(-50%) translateY(-10px);
//     }
//     60% {
//       transform: translateX(-50%) translateY(-5px);
//     }
//   }
// `;


// if (typeof document !== 'undefined') {
//   const style = document.createElement('style');
//   style.textContent = cssAnimations;
//   document.head.appendChild(style);
// }

// export default App;











































































// import React, { useState } from 'react';
// import { Menu, X, Github, Linkedin, Mail, ExternalLink, ChevronDown } from 'lucide-react';
// import { Code, Smartphone, Eye, Sparkles, Brain, Briefcase } from 'lucide-react';
// import './App.css'
// import logo from './assets/my_image.jpg'


// const App = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const scrollToSection = (sectionId) => {
//     const element = document.getElementById(sectionId);
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth' });
//     }
//     setIsMenuOpen(false);
//   };

//   return (
//     <div className="app">
//       {/* Navbar */}
//       <nav className="navbar">
//         <div className="nav-container">
//           <div className="nav-content">
//             <div className="logo">
//               <h1><img src={logo} alt="" style={{width: '100px', height: '70px', borderRadius: '50px'}}/></h1>
//             </div>
            
//             {/* Desktop Navigation */}
//             <div className="desktop-nav">
//               <div className="nav-links">
//                 <button onClick={() => scrollToSection('home')} className="nav-link">
//                   Home
//                 </button>
//                 <button onClick={() => scrollToSection('about')} className="nav-link">
//                   About
//                 </button>
//                 <button onClick={() => scrollToSection('skills')} className="nav-link">
//                   Skills
//                 </button>
//                 <button onClick={() => scrollToSection('projects')} className="nav-link">
//                   Projects
//                 </button>
//                 <button onClick={() => scrollToSection('contact')} className="nav-link">
//                   Contact
//                 </button>
//               </div>
//             </div>

//             {/* Mobile menu button */}
//             <div className="mobile-menu-button">
//               <button onClick={toggleMenu} className="menu-toggle">
//                 {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <div className="mobile-nav">
//             <div className="mobile-nav-content">
//               <button onClick={() => scrollToSection('home')} className="mobile-nav-link">
//                 Home
//               </button>
//               <button onClick={() => scrollToSection('about')} className="mobile-nav-link">
//                 About
//               </button>
//               <button onClick={() => scrollToSection('skills')} className="mobile-nav-link">
//                 Skills
//               </button>
//               <button onClick={() => scrollToSection('projects')} className="mobile-nav-link">
//                 Projects
//               </button>
//               <button onClick={() => scrollToSection('contact')} className="mobile-nav-link">
//                 Contact
//               </button>
//             </div>
//           </div>
//         )}
//       </nav>

//       {/* Hero Section */}
//       <section id="home" className="hero-section">
//         <div className="hero-container">
//           <div className="hero-content">
//             {/* <h1 className="hero-title">
//               Hello, I'm <span className="hero-name">Ahmed Umar Khemis</span>
//             </h1>
//             <p className="hero-description">
//               A passionate and results-driven Computer Science student at Kabale University with a strong foundation in machine learning, web development, and mobile application design. I have a keen interest in solving real-world problems using technology, particularly in the fields of agriculture, healthcare, and smart systems.
//               My experience spans across AI/ML model development, full-stack web and mobile app development, computer vision, and blockchain experimentation. I enjoy turning ideas into scalable software solutions and continuously expanding my knowledge through hands-on projects and collaborative development.
//               I hold certifications from institutions like Harvard's CS50, Kaggle, and Alison, and I'm always looking forward to contributing to impactful tech solutions, especially in underrepresented communities.
//             </p> */}


//             <div className="hero-box">
//               <h1 className="hero-title">
//                 Hello, I'm <span className="hero-name">Ahmed Umar Khemis</span>
//               </h1>
//               <p className="hero-description">
//                 A passionate and results-driven Computer Science student at Kabale University with a strong foundation in machine learning, web development, and mobile application design. I have a keen interest in solving real-world problems using technology, particularly in the fields of agriculture, healthcare, and smart systems.
//                 {/* <br /><br /> */}
//                 My experience spans across AI/ML model development, full-stack web and mobile app development, computer vision, and AIoT. I enjoy turning ideas into scalable software solutions and continuously expanding my knowledge through hands-on projects and collaborative development.
//                 {/* <br /><br /> */}
//                 I hold certifications from institutions like Harvard's CS50, Kaggle, and Alison, and I'm always looking forward to contributing to impactful tech solutions, especially in underrepresented communities.
//               </p>
//             </div>




//             <div className="hero-buttons">
//               <button 
//                 onClick={() => scrollToSection('projects')}
//                 className="btn btn-primary"
//               >
//                 View My Work
//               </button>
//               <button 
//                 onClick={() => scrollToSection('contact')}
//                 className="btn btn-secondary"
//               >
//                 Get In Touch
//               </button>
//             </div>
//           </div>
//           <div className="hero-chevron">
//             <ChevronDown className="chevron-icon" size={32} />
//           </div>
//         </div>
//       </section>

//       {/* About Section */}
//       <section id="about" className="about-section">
//         <div className="container">
//           <div className="section-header">
//             <h2 className="section-title">About Me</h2>
//             <p className="section-subtitle">Get to know more about my background and expertise</p>
//           </div>
          
//           <div className="about-content">
//             <div className="about-image">
//               <div className="image-placeholder">
//                 <span><img src={logo} alt="" style={{marginLeft: '190px'}}/></span>
//               </div>
//             </div>
            
//             <div className="about-text">
//               <h3 className="about-title">Passionate Developer & Designer</h3>
//               <p className="about-paragraph">
//                 Am a passionate and results-driven Computer Science student at Kabale University with a strong foundation in Machine Learning, Deep Learning, Computer Vision, GenAI, web development, mobile application design, and Penetration Testing. I have a keen interest in solving real-world problems using technology, particularly in the fields of agriculture, healthcare, education, and smart systems.
//                 My experience spans across AI/ML model development, full-stack web and mobile app development, computer vision,and AIoT. I enjoy turning ideas into scalable software solutions and continuously expanding my knowledge through hands-on projects and collaborative development.
//                 I hold certifications from institutions like Harvard's CS50, Kaggle, and Alison, Udemy, Cousera, and I'm always looking forward to contributing to impactful tech solutions, especially in underrepresented communities.
//               </p>
//               {/* <p className="about-paragraph">
//                 When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, 
//                 or sharing knowledge with the developer community.
//               </p> */}
//               <div className="skills-grid">
//                 <div className="skill-item">
//                   <h4>AI/ML</h4>
//                   <p>Tensorflow, Scikit-learn, OpenCV, YOLO, U-Net</p>
//                 </div>
//                 <div className="skill-item">
//                   <h4>Hardware Programming</h4>
//                   <p>Raspberry pi, Arduino</p>
//                 </div>
//                 <div className="skill-item">
//                   <h4>Frontend</h4>
//                   <p>React, TypeScript</p>
//                 </div>
//                 <div className="skill-item">
//                   <h4>Backend</h4>
//                   <p>Django, Flask</p>
//                 </div>
//                 <div className="skill-item">
//                   <h4>Mobile Development</h4>
//                   <p>Android Studio, React Native</p>
//                 </div>
//                 <div className="skill-item">
//                   <h4>Databases</h4>
//                   <p>SQLServer, PostgreSQL, GraphQL, MySQL</p>
//                 </div>
//                 <div className="skill-item">
//                   <h4>Tools</h4>
//                   <p>Git, Docker, AWS</p>
//                 </div>
//                 <div className="skill-item">
//                   <h4>Design</h4>
//                   <p>Figma, Canva</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Skills Section */}
//       <section id="skills" className="skills-section">
//         <div className="container">
//           <div className="section-header">
//             <h2 className="section-title">Skills & Technologies</h2>
//             <p className="section-subtitle">Technologies I work with regularly</p>
//           </div>
          
//           <div className="skills-cards">
//             <div className="skill-card">
//               <h3>AI/ML/DL</h3>
//               <div className="skill-progress">
//                 <div className="skill-item-progress">
//                   <div className="skill-info">
//                     <span>Tensorflow</span>
//                     <span className="skill-percentage">90%</span>
//                   </div>
//                   <div className="progress-bar">
//                     <div className="progress-fill" style={{width: '90%'}}></div>
//                   </div>
//                 </div>
//                 <div className="skill-item-progress">
//                   <div className="skill-info">
//                     <span>Scikit-learn</span>
//                     <span className="skill-percentage">85%</span>
//                   </div>
//                   <div className="progress-bar">
//                     <div className="progress-fill" style={{width: '85%'}}></div>
//                   </div>
//                 </div>
//                 <div className="skill-item-progress">
//                   <div className="skill-info">
//                     <span>YOLO</span>
//                     <span className="skill-percentage">77%</span>
//                   </div>
//                   <div className="progress-bar">
//                     <div className="progress-fill" style={{width: '77%'}}></div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="skill-card">
//               <h3>Hardware Programming</h3>
//               <div className="skill-progress">
//                 <div className="skill-item-progress">
//                   <div className="skill-info">
//                     <span>Raspberry pi</span>
//                     <span className="skill-percentage">84%</span>
//                   </div>
//                   <div className="progress-bar">
//                     <div className="progress-fill" style={{width: '84%'}}></div>
//                   </div>
//                 </div>
//                 <div className="skill-item-progress">
//                   <div className="skill-info">
//                     <span>Arduino</span>
//                     <span className="skill-percentage">71%</span>
//                   </div>
//                   <div className="progress-bar">
//                     <div className="progress-fill" style={{width: '71%'}}></div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="skill-card">
//               <h3>Frontend Development</h3>
//               <div className="skill-progress">
//                 <div className="skill-item-progress">
//                   <div className="skill-info">
//                     <span>React</span>
//                     <span className="skill-percentage">90%</span>
//                   </div>
//                   <div className="progress-bar">
//                     <div className="progress-fill" style={{width: '90%'}}></div>
//                   </div>
//                 </div>
//                 <div className="skill-item-progress">
//                   <div className="skill-info">
//                     <span>TypeScript</span>
//                     <span className="skill-percentage">85%</span>
//                   </div>
//                   <div className="progress-bar">
//                     <div className="progress-fill" style={{width: '85%'}}></div>
//                   </div>
//                 </div>
//                 <div className="skill-item-progress">
//                   <div className="skill-info">
//                     <span>CSS/Tailwind</span>
//                     <span className="skill-percentage">95%</span>
//                   </div>
//                   <div className="progress-bar">
//                     <div className="progress-fill" style={{width: '95%'}}></div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="skill-card">
//               <h3>Backend Development</h3>
//               <div className="skill-progress">
//                 <div className="skill-item-progress">
//                   <div className="skill-info">
//                     <span>Django</span>
//                     <span className="skill-percentage">80%</span>
//                   </div>
//                   <div className="progress-bar">
//                     <div className="progress-fill" style={{width: '80%'}}></div>
//                   </div>
//                 </div>
//                 <div className="skill-item-progress">
//                   <div className="skill-info">
//                     <span>Python</span>
//                     <span className="skill-percentage">75%</span>
//                   </div>
//                   <div className="progress-bar">
//                     <div className="progress-fill" style={{width: '75%'}}></div>
//                   </div>
//                 </div>
//                 <div className="skill-item-progress">
//                   <div className="skill-info">
//                     <span>PostgreSQL</span>
//                     <span className="skill-percentage">70%</span>
//                   </div>
//                   <div className="progress-bar">
//                     <div className="progress-fill" style={{width: '70%'}}></div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="skill-card">
//               <h3>Mobile App Development</h3>
//               <div className="skill-progress">
//                 <div className="skill-item-progress">
//                   <div className="skill-info">
//                     <span>Android Studio</span>
//                     <span className="skill-percentage">88%</span>
//                   </div>
//                   <div className="progress-bar">
//                     <div className="progress-fill" style={{width: '88%'}}></div>
//                   </div>
//                 </div>
//                 <div className="skill-item-progress">
//                   <div className="skill-info">
//                     <span>React Native</span>
//                     <span className="skill-percentage">65%</span>
//                   </div>
//                   <div className="progress-bar">
//                     <div className="progress-fill" style={{width: '65%'}}></div>
//                   </div>
//                 </div>
//                 <div className="skill-item-progress">
//                   <div className="skill-info">
//                     <span>Firebase</span>
//                     <span className="skill-percentage">70%</span>
//                   </div>
//                   <div className="progress-bar">
//                     <div className="progress-fill" style={{width: '70%'}}></div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="skill-card">
//               <h3>Tools & Others</h3>
//               <div className="skill-progress">
//                 <div className="skill-item-progress">
//                   <div className="skill-info">
//                     <span>Git</span>
//                     <span className="skill-percentage">90%</span>
//                   </div>
//                   <div className="progress-bar">
//                     <div className="progress-fill" style={{width: '90%'}}></div>
//                   </div>
//                 </div>
//                 <div className="skill-item-progress">
//                   <div className="skill-info">
//                     <span>Docker</span>
//                     <span className="skill-percentage">65%</span>
//                   </div>
//                   <div className="progress-bar">
//                     <div className="progress-fill" style={{width: '65%'}}></div>
//                   </div>
//                 </div>
//                 <div className="skill-item-progress">
//                   <div className="skill-info">
//                     <span>AWS</span>
//                     <span className="skill-percentage">60%</span>
//                   </div>
//                   <div className="progress-bar">
//                     <div className="progress-fill" style={{width: '60%'}}></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Projects Section */}
//       <section id="projects" className="projects-section">
//         <div className="container">
//           <div className="section-header">
//             <h2 className="section-title">Featured Projects</h2>
//             <p className="section-subtitle">Some of my recent work</p>
//           </div>
          
//           <div className="projects-grid">
//             <div className="project-card">
//               <div className="project-image">
//                 <span>Project Screenshot</span>
//               </div>
//               <div className="project-content">
//                 <h2>Crop Pest & Disease Detection System</h2>

//                 <h4>Description:</h4>
//                 <p>
//                   An AI-powered web platform that allows farmers to upload crop images and receive instant diagnosis of pest or disease issues, along with GenAI-generated insights for treatment and prevention.
//                 </p>

//                 <h4 style={{ marginTop: '10px' }}>Technologies:</h4>
//                 <p>
//                   TensorFlow, Keras, OpenCV, React, Django REST Framework, HuggingFace, Material UI, WebSockets, PostgreSQL
//                 </p>
                
//                 <div className="project-tags">
//                   <span className="tag tag-react">React</span>
//                   <span className="tag tag-node">Django</span>
//                   <span className="tag tag-mongo">PostgreSQL</span>
//                 </div>
//                 <div className="project-links">
//                   <a href="https://github.com/umarkhemis/Crop_Disease_Detector" className="project-link">
//                     <Github size={16} />
//                     Github
//                   </a>
//                   <button className="project-link">
//                     <ExternalLink size={16} />
//                     Live Demo
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="project-card">
//               <div className="project-image">
//                 <span>Project Screenshot</span>
//               </div>
//               <div className="project-content">
//                 <h2>Ad Platform</h2>

//                 <h4>Description:</h4>
//                 <p>
//                   A web platform that allows business, and sales personels to advertise their products.
//                 </p>

//                 <h4 style={{ marginTop: '10px' }}>Technologies:</h4>
//                 <p>
//                   React, Django REST Framework, PostgreSQL
//                 </p>
                
//                 <div className="project-tags">
//                   <span className="tag tag-react">#React</span>
//                   <span className="tag tag-node">#Django</span>
//                   <span className="tag tag-mongo">#PostgreSQL</span>
//                 </div>
//                 <div className="project-links">
//                   <a href="https://github.com/umarkhemis/Ad_Platform" className="project-link">
//                     <Github size={16} />
//                     Github
//                   </a>
//                   <button className="project-link">
//                     <ExternalLink size={16} />
//                     Live Demo
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="project-card">
//               <div className="project-image">
//                 <span>Project Screenshot</span>
//               </div>
//               <div className="project-content">
//                 <h2>Cabbage Blackrot Detection System</h2>

//                 <h4>Description:</h4>
//                 <p>
//                  A mobile version of the crop health prediction system but specifically for cabbage black rot with camera capture, image upload, and disease insight integration.
//                 </p>

//                 <h4 style={{ marginTop: '10px' }}>Technologies:</h4>
//                 <p>
//                   Tensorflow, React Native, Expo, Axios, Django REST API, Material UI
//                 </p>

//                 <div className="project-tags">
//                   <span className="tag tag-react">#React</span>
//                   <span className="tag tag-node">#Django</span>
//                   <span className="tag tag-mongo">#SQLServer</span>
//                 </div>
//                 <div className="project-links">
//                   <a href="https://github.com/umarkhemis/Django_Cabbage_Doctor" className="project-link">
//                     <Github size={16} />
//                     Github
//                   </a>
//                   <button className="project-link">
//                     <ExternalLink size={16} />
//                     Live Demo
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="project-card">
//               <div className="project-image">
//                 <span>Project Screenshot</span>
//               </div>
//               <div className="project-content">
//                 <h2>Notes_Keeper</h2>

//                 <h4>Description:</h4>
//                 <p>
//                  A full-stack web appliaction for taking and storing notes, updating as well as deleting the notes
//                 </p>

//                 <h4 style={{ marginTop: '10px' }}>Technologies:</h4>
//                 <p>
//                  Reactjs, Django REST API, PostgreSQL
//                 </p>
                
//                 <div className="project-tags">
//                   <span className="tag tag-react">#React</span>
//                   <span className="tag tag-node">#Django</span>
//                   <span className="tag tag-mongo">#PostgreSQL</span>
//                 </div>
//                 <div className="project-links">
//                   <a href="https://github.com/umarkhemis/Notes_app" className="project-link">
//                     <Github size={16} />
//                     Github
//                   </a>
//                   <button className="project-link">
//                     <ExternalLink size={16} />
//                     Live Demo
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="project-card">
//               <div className="project-image">
//                 <span>Project Screenshot</span>
//               </div>
//               <div className="project-content">

//                 <h2>Certificate Verifier</h2>

//                 <h4>Description:</h4>
//                 <p>
//                  A blockchain web application that that allows instituitions to issue temper proof transcripts to students, and also allows easy verification of transcripts
//                 </p>

//                 <h4 style={{ marginTop: '10px' }}>Technologies:</h4>
//                 <p>
//                  Smart Contracts with Solidity, Reactjs
//                 </p>



//                 <div className="project-tags">
//                   <span className="tag tag-react">#React</span>
//                   <span className="tag tag-node">#Solidity</span>
//                   <span className="tag tag-mongo">#Build-on-chain</span>
//                 </div>
//                 <div className="project-links">
//                   <a href="https://github.com/umarkhemis/Certificate_Verifier" className="project-link">
//                     <Github size={16} />
//                     Github
//                   </a>
//                   <button className="project-link">
//                     <ExternalLink size={16} />
//                     Live Demo
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Contact Section */}
//       <section id="contact" className="contact-section">
//         <div className="container">
//           <div className="section-header">
//             <h2 className="section-title">Get In Touch</h2>
//             <p className="section-subtitle">Let's discuss your next project</p>
//           </div>
          
//           <div className="contact-content">
//             <div className="contact-info">
//               <h3>Let's Connect</h3>
//               <p>
//                 I'm always interested in hearing about new opportunities and interesting projects. 
//                 Whether you have a question or just want to say hello, I'd love to hear from you.
//               </p>
              
//               <div className="contact-details">
//                 <div className="contact-item">
//                   <Mail size={24} />
//                   <span>
//                     <a href="mailto:umarkhemis9@gmail.com">umarkhemis9@gmail.com</a>
//                   </span>
//                 </div>
//               <div className="contact-item">
//                 <a href="https://github.com/umarkhemis" target="_blank" rel="noopener noreferrer">
//                   <Github size={24} />
//                 </a>
//               </div>

//               <div className="contact-item">
//                 <a href="https://linkedin.com/in/ahmed-umar-khemis" target="_blank" rel="noopener noreferrer">
//                   <Linkedin size={24} />
//                 </a>
//               </div>
//               </div>
//             </div>
            
//             <div className="contact-form">
//               <div className="form-group">
//                 <label htmlFor="name">Name</label>
//                 <input
//                   type="text"
//                   id="name"
//                   placeholder="Your Name"
//                 />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="email">Email</label>
//                 <input
//                   type="email"
//                   id="email"
//                   placeholder="your.email@example.com"
//                 />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="message">Message</label>
//                 <textarea
//                   id="message"
//                   rows={4}
//                   placeholder="Tell me about your project..."
//                 ></textarea>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => alert('Contact form submitted!')}
//                 className="btn btn-primary btn-full"
//               >
//                 Send Message
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="footer">
//         <div className="container">
//           <div className="footer-content">
//             <div className="footer-main">
//               <h3>AHMED UMAR KHEMIS</h3>
//               <p>
//                 I'm Ahmed Umar Khemis, a passionate software developer specializing in AI/ML, Hardware Programming and System Automation, web apps, Mobile apps, and innovative tech. Welcome to my professional portfolio!
//               </p>
//               <div className="footer-social">
//                 <Github size={24} />
//                 <Linkedin size={24} />
//                 <Mail size={24} />
//               </div>
//             </div>
            
//             <div className="footer-links">
//               <h4>Quick Links</h4>
//               <ul>
//                 <li><button onClick={() => scrollToSection('home')}>Home</button></li>
//                 <li><button onClick={() => scrollToSection('about')}>About</button></li>
//                 <li><button onClick={() => scrollToSection('skills')}>Skills</button></li>
//                 <li><button onClick={() => scrollToSection('projects')}>Projects</button></li>
//               </ul>
//             </div>
            
         
//             <div className="footer-services">
//               <h4>Services</h4>
//               <ul className="services-list">
//                 <li><Brain size={18} /> AI & Machine Learning</li>
//                 <li><Eye size={18} /> Computer Vision Solutions</li>
//                 <li><Sparkles size={18} /> Generative AI Applications</li>
//                 <li><Code size={18} /> Web Development</li>
//                 <li><Smartphone size={18} /> Mobile App Development</li>
//                 <li><Briefcase size={18} /> Technology Consulting</li>
//               </ul>
//             </div>




//           </div>
          
//           <div className="footer-bottom">
//             <p>© 2025 Ahmed-Umar-Khemis. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default App;









