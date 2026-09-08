// Hair Lounge case study scripts: GSAP + Three.js interactions
(() => {
  // Loader simulation
  const loader = document.getElementById('loader');
  const progressBar = document.getElementById('progressBar');
  let progress = 0;
  const step = () => {
    progress = Math.min(100, progress + Math.random() * 22);
    if (progressBar) progressBar.style.width = progress + '%';
    if (progress < 100) setTimeout(step, 200 + Math.random() * 300);
    else finishLoad();
  };

  function finishLoad(){
    if (!loader) return;
    loader.style.opacity = 0;
    setTimeout(() => loader.remove(), 600);
    initAnimations();
    initThree();
  }
  step();

  // GSAP reveals
  function initAnimations(){
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.brand-title',{y:20,opacity:0,duration:0.8,ease:'power3.out'});
    gsap.from('.lead',{y:18,opacity:0,duration:0.9,delay:0.15});

    gsap.utils.toArray('.m-card, .testi, .panel').forEach((el,i)=>{
      gsap.from(el,{y:18,opacity:0,duration:0.8,delay:i*0.08,scrollTrigger:{trigger:el,start:'top 85%'}})
    });

    // subtle parallax on hero image
    const hero = document.querySelector('.hero-right');
    if (hero){
      hero.addEventListener('mousemove', e => {
        const rX = (e.clientX - window.innerWidth/2) / 80;
        const rY = (e.clientY - window.innerHeight/2) / 120;
        gsap.to('.three-canvas',{rotationY: rX, rotationX: -rY, duration:0.6});
      });
    }
  }

  // Minimal Three.js hero scene: textured plane with slight parallax and tilt
  function initThree(){
    const canvas = document.getElementById('threeCanvas');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha: true});
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth/canvas.clientHeight, 0.1, 1000);
    camera.position.z = 3;

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0.5,1,1);
    scene.add(light);

    const loader = new THREE.TextureLoader();
    const textureUrl = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop';
    loader.load(textureUrl, (tex) => {
      const geom = new THREE.PlaneGeometry(3.6,2.2, 32,32);
      const mat = new THREE.MeshStandardMaterial({map:tex, metalness:0.06, roughness:0.6});
      const mesh = new THREE.Mesh(geom, mat);
      mesh.rotation.y = -0.25;
      scene.add(mesh);

      // subtle floating animation
      gsap.to(mesh.rotation, {y:0.25, duration:6, repeat:-1, yoyo:true, ease:'sine.inOut'});

      // mouse parallax
      window.addEventListener('mousemove', (e)=>{
        const nx = (e.clientX/window.innerWidth - 0.5) * 0.6;
        const ny = (e.clientY/window.innerHeight - 0.5) * 0.35;
        gsap.to(mesh.rotation, {x: ny, y: nx-0.25, duration:0.9, ease:'power3.out'});
      });

      // render loop
      const animate = () => {
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };
      animate();
    }, undefined, () => {
      // texture error: hide canvas
      canvas.style.display = 'none';
    });

    // resize handling
    const onResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w/h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);
  }

  // Contact form demo send
  const form = document.getElementById('projectContact');
  const status = document.getElementById('pcStatus');
  if (form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      if (!form.checkValidity()) { status.textContent = 'Please complete the form.'; return; }
      const btn = form.querySelector('button');
      btn.disabled = true; btn.textContent = 'Sending...';
      setTimeout(()=>{
        status.textContent = 'Thanks — I will reach out within 24 hours.';
        btn.disabled = false; btn.textContent = 'Send Inquiry';
        form.reset();
      },900);
    });
  }
})();
