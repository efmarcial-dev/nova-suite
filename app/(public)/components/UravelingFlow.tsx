'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


export default function UnravelingFlow() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const nodesRef = useRef<HTMLDivElement[]>([]);
  const conclusionRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  



  useEffect(() => {

    if (!lineRef.current || !sectionRef.current) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const path = lineRef.current!;
      const pathLength = path.getTotalLength();

      const conclusion = conclusionRef.current;
      const cta = ctaRef.current;

      // --- Line setup ---
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
        opacity: 1,
      });

      // --- Text setup ---
      if (conclusion && cta) {
        gsap.set([conclusion, cta], {
          scale: 0.95,
          opacity: 0,
          transformOrigin: 'center center',
        });
      }

      // --- Main scroll trigger ---
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,

        onUpdate(self) {
          // Draw line
          gsap.to(path, {
            strokeDashoffset: pathLength * (1 - self.progress),
            overwrite: 'auto',
            ease: 'none',
          });

          // When line finishes
          if (self.progress > 0.98) {
            gsap.to(path, {
              opacity: 0,
              duration: 0.85,
              ease: 'power2.out',
            });

            if (conclusion) {
              gsap.to(conclusion, {
                scale: 1.5,
                opacity: 1,
                duration: 0.3,
                ease: 'power3.out',
                stagger: 0.08,
              });
            }
          } else {
            // Reverse when scrolling up
            gsap.to(path, {
              opacity: 1,
              duration: 0.2,
            });

            if (conclusion ) {
              gsap.to(conclusion, {
                scale: 0.95,
                opacity: 0,
                duration: 0.2,
              });
            }
          }
        },
      });

      // --- Node animations (UNCHANGED, just scoped) ---
      nodesRef.current.forEach((node, index) => {
        const nextNode = nodesRef.current[index + 1];

        gsap.timeline({
          scrollTrigger: {
            trigger: node,
            start: 'top 70%',
            endTrigger: nextNode ?? node,
            end: nextNode ? 'top 60%' : 'bottom 50%',
            toggleActions: 'play reverse play reverse',
          },
        }).fromTo(
          node,
          { opacity: 0, y: 30, scale: 1.05 },
          { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'power3.out' }
        );
      });
    });

    return () => mm.revert();
  }, []);



  return (
    <section ref={sectionRef} className="unraveling-section">
      {/* Knot SVG */}
      <div 
        data-aos='zoom-in'
        data-aos-delay='95'
        className="unraveling-knotWrapper">
        <svg
          width="372" 
            height="1381" 
            viewBox="0 0 372 1381" 
            fill="none" 
            preserveAspectRatio="xMidYMin meet"
          className="unraveling-knot"
        >
          {/* Placeholder tangled paths */}
          <path
            d="M155.501 19.1035C17.501 197.604 29.501 266.104 50.501 263.104C71.501 260.104 301.001 201.104 293.001 183.104C285.001 165.104 129.501 -6.89648 114.501 19.1035C99.501 45.1035 48.501 250.604 71.501 271.604C94.501 292.604 310.001 159.604 301.501 140.104C293.001 120.604 69.501 18.6035 60.001 45.1035C50.501 71.6035 109.501 293.104 140.501 289.604C171.501 286.104 293.501 68.1035 267.001 61.6035C240.501 55.1035 9.501 123.604 11.001 140.104C12.501 156.604 218.001 280.104 242.501 271.604C267.001 263.104 211.001 9.60352 193.001 19.1035C175.001 28.6035 4.28019 196.104 22.501 207.604C40.7218 219.104 282.501 246.104 301.501 169.604C320.501 93.1035 107.501 6.10352 89.501 19.1035C71.501 32.1035 74.501 289.604 89.501 289.604C104.501 289.604 319.001 114.744 293.001 101.104C267.001 87.4628 34.001 68.1035 22.501 92.6035C11.001 117.104 191.501 289.604 209.501 289.604C227.501 289.604 261.001 45.1035 242.501 45.1035C224.001 45.1035 11.001 144.604 11.001 169.604C11.001 194.604 241.001 266.604 267.001 237.104C293.001 207.604 201.501 19.1035 178.501 19.1035C155.501 19.1035 13.501 168.104 18.001 190.604C22.501 213.104 262.001 255.604 277.501 223.104C293.001 190.604 260.501 43.6035 235.001 35.6035C209.501 27.6035 8.58954 127.604 11.001 151.104C13.4125 174.604 247.501 280.604 262.501 256.104C277.501 231.604 242.001 24.6616 213.001 23.1035C184.001 21.5454 13.501 173.104 18.001 198.104C22.501 223.104 263.001 258.104 272.001 246.104C281.001 234.104 198.001 4.10351 172.001 9.10351C146.001 14.1035 7.11648 200.104 22.501 223.104C37.8855 246.104 283.001 245.604 288.001 207.604C293.001 169.604 228.001 16.8628 197.501 14.1035C167.001 11.3442 53.501 52.6035 38.001 72.6035C22.501 92.6035 88.501 284.603 114.501 295.104C140.501 305.604 305.492 112.604 288.001 92.6035C270.51 72.6035 72.001 33.6035 50.501 53.1035C29.001 72.6035 101.501 296.103 125.501 299.604C149.501 303.104 312.501 102.104 277.501 77.6035C242.501 53.1035 15.3168 68.1035 18.001 109.604C20.6852 151.104 114.001 299.604 140.501 299.604C167.001 299.604 336.001 143.854 301.501 122.604C267.001 101.353 107.501 8.10351 79.001 30.6035C50.501 53.1035 17.4677 229.629 50.501 251.604C83.5344 273.578 269.164 261.604 277.501 237.104C285.838 212.604 196.228 22.5742 162.001 7.25602C131.333 -6.46954 48.7536 173.282 60.001 269.756C71.2484 366.23 326.682 153.19 298.501 113.604C270.32 74.0166 57.501 50.6035 42.501 61.6035C27.501 72.6035 119.501 299.604 149.001 299.604C178.501 299.604 282.501 70.6035 262.501 53.1035C242.501 35.6035 11.001 95.1035 11.001 113.604C11.001 132.104 146.501 304.104 172.001 299.604C197.501 295.104 288.001 83.6035 277.501 72.6035C267.001 61.6035 31.2457 41.6035 30.501 77.6035C29.7563 113.604 49.4073 286.523 79.001 282.604C108.595 278.684 287.501 218.103 293.001 198.104C298.501 178.104 157.501 9.10351 136.001 9.10351C114.501 9.10351 22.3028 222.604 30.501 237.104C38.6991 251.604 277.001 248.603 282.501 228.104C288.001 207.604 177.001 9.10351 149.001 9.10351C121.001 9.10351 37.8329 262.103 53.001 269.104C68.1691 276.104 283.001 226.603 288.001 217.104C293.001 207.604 148.501 -1.78719 125.501 9.10351C102.501 19.9942 23.001 236.104 30.501 246.104C38.001 256.104 298.501 203.103 298.501 190.604C298.501 178.104 93.501 23.1035 82.501 23.1035C71.501 23.1035 94.001 295.104 102.501 295.104C111.001 295.104 305.501 168.103 305.001 159.604C304.501 151.104 77.501 25.6035 71.501 30.6035C65.501 35.6035 65.9448 294.209 82.501 289.604C99.0571 284.998 308.501 159.33 305.001 151.104C301.501 142.877 134.501 -0.00989246 114.501 9.10351C94.501 18.2169 13.501 203.104 18.001 213.104C22.501 223.104 177.001 309.603 189.501 299.604C202.001 289.604 303.073 200.956 301.501 183.104C299.929 165.251 239.501 25.3581 224.501 23.1035C209.501 20.8489 11.001 115.104 11.001 127.604C11.001 140.104 210.001 301.104 219.001 289.604C228.001 278.103 280.954 54.6035 251.501 45.1035C222.048 35.6035 39.001 58.6139 27.001 83.6035C15.001 108.593 65.001 299.604 118.501 299.604C172.001 299.604 292.024 217.104 293.001 207.604C293.978 198.104 292.501 66.4827 272.001 61.6035C251.501 56.7243 118.001 19.1035 98.501 14.1035C79.001 9.10352 5.00097 139.604 8.00099 165.104C11.001 190.604 190.001 304.104 201.501 299.604C213.001 295.104 263.419 47.6035 248.001 39.1035C232.583 30.6035 3.53241 149.604 11.001 178.604C18.4696 207.604 139.001 299.604 155.501 299.604C172.001 299.604 308.501 187.604 305.001 178.604C302.201 171.404 262.168 162.937 242.501 159.604L205.501 274.604C235.668 208.437 291.201 70.8035 272.001 49.6035C248.001 23.1035 58.001 25.1035 42.501 39.1035C27.001 53.1035 89.501 296.104 109.501 304.104C129.501 312.103 261.501 275.104 272.001 256.104C282.501 237.104 253.501 0.103503 189.501 4.60351C125.501 9.10352 22.4416 56.1613 22.501 77.6035C22.5604 99.0457 109.001 318.104 140.501 313.104C172.001 308.104 293.001 109.604 293.001 83.6035C293.001 57.6035 18.501 66.6035 11.001 88.1035C3.50098 109.604 148.001 315.604 189.501 307.604C231.001 299.604 312.501 170.604 314.001 140.104C315.501 109.604 169.501 -3.3965 149.001 0.603507C128.501 4.60351 -15 165.104 11.001 217.104C37.002 269.103 270.501 260.603 293.001 228.104C315.501 195.604 298.501 45.1035 262.501 30.6035C226.501 16.1035 1.00098 112.104 0.500979 155.104C0.000979439 198.104 191.001 326.604 213.001 313.104C235.001 299.604 321.334 118.604 301.501 101.104C281.668 83.6035 98.001 1.10351 82.501 14.1035C67.001 27.1035 20.8687 273.737 53.001 277.604C85.1332 281.47 257 307.604 257 277.604C257 247.604 166.744 251.666 169.001 269.104C171.258 286.541 209.001 298.104 214.001 301.104C219.001 304.104 223.501 309.5 189.501 317C155.501 324.5 209.984 185.434 209.984 234.434"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            
          />
        </svg>

        {/* Flow line */}
        <svg className="unraveling-flowLine" viewBox="0 0 2 1000" preserveAspectRatio="none">
            <path
                ref={lineRef}
                // Simplified path data: Starts at (1, 0) and ends at (1, 1000)
                // This makes the vector top-to-bottom.
                d="M35.0143 22.3687C-10.9857 -21.1314 66.5143 9.8686 60.0143 32.8687C53.5143 55.8688 21.5143 47.3687 9.51428 62.3687C-0.0857172 74.3687 -0.152384 98.3687 1.01428 108.869V1128.37" 
                stroke="var(--accent)"
                strokeWidth="2"
                fill="none"
            />
        </svg>
      </div>

      <h2 
      data-aos="fade-up"
      data-aos-delay='100'
      className="
        font-medium
        text-2xl md:text-4xl lg:text-6xl
        mt-10 mb-8
        max-w-6xl
        mx-auto sm:mx-0
        text-center sm:text-left sm:ml-30
        leading-tight">
        MOST SOFTWARE ADDS COMPLEXITY. <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">WE REMOVE IT.</span> 
      </h2>

      <p 
      
      data-aos='fade-up'
      data-aos-delay='150'
      className="
        max-w-lg
        mx-auto sm:mx-0
        mb-8
        text-center sm:text-left sm:ml-30
      ">
        Inside growing organizations, work rarely breaks in obvious ways. It slows.
        It duplicates. It gets passed between people, tools, and spreadsheets — until
        no one has a clear picture anymore.
      </p>

      <p 
      data-aos='fade-up'
      data-aos-delay='200'
      className="
        mb-20
        max-w-lg
        mx-auto sm:mx-0
        text-center sm:text-left sm:ml-30
      ">
        <strong className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">WE STEP IN.</strong> Not to “add software,” but to redesign how
        information moves, decisions are made, and work actually gets done — then
        build systems that support that reality.
      </p>

      <div className="unraveling-flowWrapper">
        

        {/* Nodes */}
        <div className="unraveling-nodes">
          <div
            ref={(el) => { if (el) nodesRef.current[0] = el; }}
            className="unraveling-node unraveling-right"
          >
            <span className="unraveling-index">01</span>
            <h3>CONSOLIDATING SCATTERED TOOLS</h3>
            <p>into a single internal system.</p>
          </div>

          <div
            ref={(el) => { if (el) nodesRef.current[1] = el; }}
            className="unraveling-node unraveling-left"
          >
            <span className="unraveling-index">02</span>
            <h3>ELIMINATING MANUAL STEPS</h3>
            <p>that quietly drain hours every week.</p>
          </div>

          <div
            
            ref={(el) => { if (el) nodesRef.current[2] = el; }}
            className="unraveling-node unraveling-right"
          >
            <span className="unraveling-index">03</span>
            <h3>HELPING TEAMS DECIDE WHAT NOT TO BUILD</h3>
            <p>before complexity compounds.</p>
          </div>

           <div
            
            ref={(el) => { if (el) nodesRef.current[3] = el; }}
            className="unraveling-node unraveling-left"
          >
            <span className="unraveling-index">04</span>
            <h3>INTRODUCING AUTOMATION</h3>
            <p>where humans shouldn't be doing repetitive work.</p>
          </div>

          <div
            
            ref={(el) => { if (el) nodesRef.current[4] = el; }}
            className="unraveling-node unraveling-right"
          >
            <span className="unraveling-index">05</span>
            <h3>CREATING A CLEARER FRONT DOOR</h3>
            <p>so work enters the business cleanly.</p>
          </div>

        </div>
      </div>

      <p
        data-aos='zoom-in'
        data-aos-delay='125'
        className='text-center text-black mb-10 text-3xl '>
        Each solution looks different - because each operation is different.
      </p>

      <div 
        data-aos='zoom-in'
        data-aos-delay='90'
      className='mx-auto items-center max-w-sm text-center'>
        <button
        className='bg-blue-500 text-white rounded-lg px-6 py-4'>GET STARTED</button>
      </div>
    </section>
  );
}
