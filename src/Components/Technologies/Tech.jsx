import React, { useState, useEffect, useRef } from 'react';
import {
  FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaJs, FaPython, 
  FaBootstrap, FaGithub, FaGitlab, FaAws, FaNpm, 
  FaDocker, FaDatabase, FaJava, FaServer,
  FaUserCog, FaProjectDiagram, FaTools, FaLayerGroup,
  FaWrench, FaLaptopCode, FaNetworkWired
} from 'react-icons/fa';
import { 
  SiDjango, SiMongodb, SiPostgresql, SiTailwindcss, 
  SiTerraform, SiMicrosoftazure, SiFirebase, SiSwift, 
  SiJquery, SiSpringboot, SiKubernetes,
  SiTypescript, SiPrometheus, SiSplunk,
  SiAmazoncloudwatch, SiAwslambda, SiAmazondynamodb, SiAmazonec2,
  SiAmazons3, SiGithubactions
} from 'react-icons/si';
import { TbBrandReactNative } from 'react-icons/tb';
import { MdArchitecture, MdMonitorHeart, MdSecurity } from "react-icons/md";
import { VscGraph, VscServerProcess } from 'react-icons/vsc';
import { GrStatusGoodSmall, GrOptimize } from 'react-icons/gr';
import { BiGitBranch, BiCodeBlock } from 'react-icons/bi';
import './Technologies.css';

const Tech = () => {
  const [selectedTech, setSelectedTech] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);
  console.log({selectedTech})

  const technologies = [
    // Programming Languages - Inner Orbit
    { name: 'Python', icon: <FaPython />, color: '#3776AB', category: 'language', orbit: 1 },
    { name: 'Java', icon: <FaJava />, color: '#007396', category: 'language', orbit: 1 },
    { name: 'JavaScript', icon: <FaJs />, color: '#F7DF1E', category: 'language', orbit: 1 },
    { name: 'TypeScript', icon: <SiTypescript />, color: '#3178C6', category: 'language', orbit: 1 },
    { name: 'HTML5', icon: <FaHtml5 />, color: '#E34F26', category: 'language', orbit: 1 },
    { name: 'CSS3', icon: <FaCss3Alt />, color: '#1572B6', category: 'language', orbit: 1 },
    
    // Frameworks & Libraries - Second Orbit
    { name: 'React', icon: <FaReact />, color: '#61DAFB', category: 'framework', orbit: 2 },
    { name: 'Node.js', icon: <FaNodeJs />, color: '#539E43', category: 'framework', orbit: 2 },
    { name: 'Spring Boot', icon: <SiSpringboot />, color: '#6DB33F', category: 'framework', orbit: 2 },
    { name: 'React Native', icon: <TbBrandReactNative />, color: '#61DAFB', category: 'framework', orbit: 2 },
    
    // Cloud & Infrastructure - Third Orbit
    { name: 'AWS', icon: <FaAws />, color: '#FF9900', category: 'cloud', orbit: 3 },
    { name: 'Lambda', icon: <SiAwslambda />, color: '#FF9900', category: 'cloud', orbit: 3 },
    { name: 'DynamoDB', icon: <SiAmazondynamodb />, color: '#4053D6', category: 'cloud', orbit: 3 },
    { name: 'EC2', icon: <SiAmazonec2 />, color: '#FF9900', category: 'cloud', orbit: 3 },
    { name: 'S3', icon: <SiAmazons3 />, color: '#569A31', category: 'cloud', orbit: 3 },
    { name: 'Terraform', icon: <SiTerraform />, color: '#5C4EE5', category: 'cloud', orbit: 3 },
    { name: 'Kubernetes', icon: <SiKubernetes />, color: '#326CE5', category: 'cloud', orbit: 3 },
    { name: 'Docker', icon: <FaDocker />, color: '#2496ED', category: 'cloud', orbit: 3 },
    
    // Monitoring & Observability - Fourth Orbit
    { name: 'Prometheus', icon: <SiPrometheus />, color: '#E6522C', category: 'monitoring', orbit: 4 },
    { name: 'Splunk', icon: <SiSplunk />, color: '#FF525B', category: 'monitoring', orbit: 4 },
    { name: 'CloudWatch', icon: <SiAmazoncloudwatch />, color: '#FF9900', category: 'monitoring', orbit: 4 },
    { name: 'Tracing', icon: <VscGraph />, color: '#7B61FF', category: 'monitoring', orbit: 4 },
    
    // CI/CD & Automation - Fourth Orbit
    { name: 'GitLab CI', icon: <FaGitlab />, color: '#FC6D26', category: 'cicd', orbit: 4 },
    { name: 'GitHub Actions', icon: <SiGithubactions />, color: '#2088FF', category: 'cicd', orbit: 4 },
    { name: 'IaC', icon: <BiCodeBlock />, color: '#6E86A5', category: 'cicd', orbit: 4 },
    
    // Databases - Fifth Orbit
    { name: 'MongoDB', icon: <SiMongodb />, color: '#47A248', category: 'database', orbit: 5 },
    { name: 'PostgreSQL', icon: <SiPostgresql />, color: '#336791', category: 'database', orbit: 5 },
    
    // SRE Skills - Fifth Orbit
    { name: 'Microservices', icon: <FaLayerGroup />, color: '#00BFA5', category: 'sre', orbit: 5 },
    { name: 'Reliability', icon: <GrStatusGoodSmall />, color: '#00C853', category: 'sre', orbit: 5 },
    { name: 'Automation', icon: <FaTools />, color: '#651FFF', category: 'sre', orbit: 5 },
    { name: 'Incident Mgmt', icon: <MdMonitorHeart />, color: '#F44336', category: 'sre', orbit: 5 },
    { name: 'System Tuning', icon: <GrOptimize />, color: '#2979FF', category: 'sre', orbit: 5 },
    
    // Additional Skills - Outer Orbit
    { name: 'Architecture', icon: <MdArchitecture />, color: '#FF4088', category: 'other', orbit: 6 },
    { name: 'Git', icon: <BiGitBranch />, color: '#F05032', category: 'other', orbit: 6 },
    { name: 'Security', icon: <MdSecurity />, color: '#4CAF50', category: 'other', orbit: 6 },
    { name: 'Serverless', icon: <VscServerProcess />, color: '#FD5750', category: 'other', orbit: 6 },
    { name: 'Distributed Systems', icon: <FaNetworkWired />, color: '#1976D2', category: 'other', orbit: 6 }
  ];

  // Position each technology based on orbit
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Set orbit sizes based on container size
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    
    // Use smaller dimension to ensure orbits fit
    const maxRadius = Math.min(centerX, centerY) * 0.85;
    
    // Position each tech based on its orbit and random position within that orbit
    technologies.forEach((tech, index) => {
      const orbitElement = document.getElementById(`orbit-${tech.orbit}`);
      const techElement = document.getElementById(`tech-${index}`);
      
      if (orbitElement && techElement) {
        // Calculate random position around orbit
        const angle = (index * (360 / technologies.filter(t => t.orbit === tech.orbit).length)) + 
                      (Math.random() * 30 - 15); // Add some variation
        
        // Convert angle to radians
        const angleRad = (angle * Math.PI) / 180;
        
        // Calculate orbit radius based on which orbit number (1-6)
        const orbitRadius = (maxRadius * tech.orbit) / 7; // Divide by 7 to leave space at edges
        
        // Position tech element at random point on its orbit
        const posX = orbitRadius * Math.cos(angleRad);
        const posY = orbitRadius * Math.sin(angleRad);
        
        techElement.style.transform = `translate(${posX}px, ${posY}px)`;
      }
    });
    
    // Set loaded state after positioning
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, [technologies]);

  return (
    <section className="tech-orbit-section">
      <div className="tech-content">
        <h2 
          className="tech-heading"
          data-aos="fade-down"
          data-aos-duration="1000"
        >
          Technologies
        </h2>
        
        <p className="tech-subtitle">
          Skills & expertise orbiting in my tech universe
        </p>
      </div>
      
      <div className="orbit-container" ref={containerRef}>
        {/* Central logo/image placeholder */}
        <div className="central-element">
          {/* Replace with your logo or image */}
          <div className="logo-placeholder">
            <span>HoseaCodes</span>
          </div>
        </div>
        
        {/* Orbit rings */}
        {[1, 2, 3, 4, 5, 6].map((orbitNum) => (
          <div 
            key={`orbit-${orbitNum}`} 
            id={`orbit-${orbitNum}`}
            className={`orbit orbit-${orbitNum} ${isLoaded ? 'visible' : ''}`}
          />
        ))}
        
        {/* Technology elements */}
        {technologies.map((tech, index) => (
          <div 
            id={`tech-${index}`}
            key={`tech-${index}`}
            className={`tech-element orbit-${tech.orbit} ${isLoaded ? 'visible' : ''} ${selectedTech === tech.name ? 'selected' : ''}`}
            onClick={() => setSelectedTech(tech.name === selectedTech ? null : tech.name)}
            style={{
              '--tech-color': tech.color,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${20 + (tech.orbit * 5) + (Math.random() * 10)}s`
            }}
          >
            <div className="tech-icon-container">
              {React.cloneElement(tech.icon, { className: 'tech-icon' })}
              <span className="tech-label">{tech.name}</span>
            </div>
            
            {/* Comet trail */}
            <div className="tech-trail" />
          </div>
        ))}
        
        {/* Stars background */}
        <div className="stars-container">
          {[...Array(100)].map((_, i) => (
            <div 
              key={`star-${i}`} 
              className="star"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Tech details panel when selected */}
      {selectedTech && (
        <div className="tech-details">
          <div className="tech-details-content">
            <h3>{technologies.find(t => t.name === selectedTech)?.name}</h3>
            <div className="tech-details-icon" style={{ color: technologies.find(t => t.name === selectedTech)?.color }}>
              {technologies.find(t => t.name === selectedTech)?.icon}
            </div>
            <p>Category: {technologies.find(t => t.name === selectedTech)?.category}</p>
            <button className="close-details" onClick={() => setSelectedTech(null)}>×</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Tech;