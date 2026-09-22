import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const InteractiveCart3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 500;
    const height = currentMount.clientHeight || 420;

    // 1. Escena, Cámara e Iluminación
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.25, 5.3);
    camera.lookAt(0, 0.95, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    // Luces suaves tipo estudio
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.4);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x00b47a, 1.2);
    fillLight.position.set(-6, 3, -2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xff6b00, 3.0, 7);
    rimLight.position.set(0, -0.5, 2.5);
    scene.add(rimLight);

    // 2. Grupo Principal del Carrito
    const cartGroup = new THREE.Group();
    scene.add(cartGroup);

    // Materiales Premium MercaGo
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.88,
      roughness: 0.15,
    });

    const orangeBrandMat = new THREE.MeshStandardMaterial({
      color: 0xff6b00,
      roughness: 0.25,
      metalness: 0.1,
    });

    const emeraldBrandMat = new THREE.MeshStandardMaterial({
      color: 0x00b47a,
      roughness: 0.3,
      metalness: 0.1,
    });

    const darkRubberMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.7,
    });

    // -------------------------------------------------------------
    // Construcción del Carrito de Supermercado Proporcional
    // -------------------------------------------------------------
    const basketW = 1.7;
    const basketL = 2.1;
    const basketH = 1.0;

    // Piso sólido de la canasta
    const floorMesh = new THREE.Mesh(
      new THREE.BoxGeometry(basketW, 0.04, basketL),
      chromeMat
    );
    floorMesh.position.y = 0.45;
    floorMesh.castShadow = true;
    floorMesh.receiveShadow = true;
    cartGroup.add(floorMesh);

    // Malla de rejilla de la canasta (líneas verticales y horizontales elegantes)
    const gridMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.8,
      roughness: 0.3,
    });

    // Varillas laterales longitudinales
    for (let i = 1; i <= 4; i++) {
      const yPos = 0.45 + (basketH / 4) * i;
      const wire = new THREE.Mesh(new THREE.BoxGeometry(basketW + 0.04, 0.02, basketL + 0.04), gridMat);
      wire.position.y = yPos;
      wire.castShadow = true;
      cartGroup.add(wire);
    }

    // Varillas verticales
    const numVerticals = 10;
    for (let i = 0; i <= numVerticals; i++) {
      const zPos = -basketL / 2 + (basketL / numVerticals) * i;
      // Lado izquierdo
      const vLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, basketH, 8), gridMat);
      vLeft.position.set(-basketW / 2, 0.45 + basketH / 2, zPos);
      vLeft.castShadow = true;
      cartGroup.add(vLeft);

      // Lado derecho
      const vRight = vLeft.clone();
      vRight.position.x = basketW / 2;
      cartGroup.add(vRight);
    }

    // Marco superior cromado tubular
    const topBar = new THREE.Mesh(
      new THREE.BoxGeometry(basketW + 0.08, 0.06, basketL + 0.08),
      new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.95, roughness: 0.1 })
    );
    topBar.position.y = 0.45 + basketH;
    topBar.castShadow = true;
    cartGroup.add(topBar);

    // Mango ergonómico Naranja MercaGo (#FF6B00)
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.055, basketW + 0.15, 20),
      orangeBrandMat
    );
    handle.rotation.z = Math.PI / 2;
    handle.position.set(0, 0.45 + basketH + 0.22, -basketL / 2 - 0.3);
    handle.castShadow = true;
    cartGroup.add(handle);

    // Brazos metálicos de sujeción del mango
    const armLeft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.45, 12),
      chromeMat
    );
    armLeft.rotation.x = Math.PI / 4;
    armLeft.position.set(-basketW / 2, 0.45 + basketH + 0.08, -basketL / 2 - 0.15);
    cartGroup.add(armLeft);

    const armRight = armLeft.clone();
    armRight.position.x = basketW / 2;
    cartGroup.add(armRight);

    // Chasis tubular inferior
    const chassis = new THREE.Mesh(
      new THREE.BoxGeometry(basketW * 0.75, 0.06, basketL * 0.85),
      chromeMat
    );
    chassis.position.y = 0.18;
    chassis.castShadow = true;
    cartGroup.add(chassis);

    // 4 Ruedas giratorias con rines en contraste naranja
    const wheels: THREE.Mesh[] = [];
    const wheelPositions = [
      [-basketW * 0.35, 0.09, -basketL * 0.35],
      [basketW * 0.35, 0.09, -basketL * 0.35],
      [-basketW * 0.35, 0.09, basketL * 0.35],
      [basketW * 0.35, 0.09, basketL * 0.35],
    ];

    wheelPositions.forEach(([x, y, z]) => {
      const wheelG = new THREE.Group();
      wheelG.position.set(x, y, z);

      const tire = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.07, 20),
        darkRubberMat
      );
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wheelG.add(tire);

      const rim = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.08, 16),
        orangeBrandMat
      );
      rim.rotation.z = Math.PI / 2;
      wheelG.add(rim);

      cartGroup.add(wheelG);
      wheels.push(tire);
    });

    // -------------------------------------------------------------
    // Mercado Fresco (Comestibles 3D Reales del Huila)
    // -------------------------------------------------------------
    const marketGroup = new THREE.Group();
    cartGroup.add(marketGroup);

    // 1. Bolsa Ecológica Verde Esmeralda MercaGo
    const bag = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.95, 0.6), emeraldBrandMat);
    bag.position.set(-0.3, 0.85, -0.2);
    bag.rotation.y = 0.18;
    bag.castShadow = true;
    marketGroup.add(bag);

    // 2. Pan Baguette Artesanal Crujiente
    const bread = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.11, 1.4, 16),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.75 })
    );
    bread.position.set(0.38, 1.05, -0.25);
    bread.rotation.z = -0.32;
    bread.rotation.x = 0.2;
    bread.castShadow = true;
    marketGroup.add(bread);

    // 3. Caja de Leche Entera
    const milk = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.75, 0.38),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 })
    );
    milk.position.set(0.3, 0.75, 0.3);
    milk.rotation.y = -0.15;
    milk.castShadow = true;
    marketGroup.add(milk);

    const milkCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 0.06, 12),
      new THREE.MeshStandardMaterial({ color: 0xef4444 })
    );
    milkCap.position.set(0.3, 1.15, 0.3);
    marketGroup.add(milkCap);

    // 4. Frutas Frescas (Naranja, Aguacate Hass, Manzana Roja)
    const orange = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 20, 20),
      new THREE.MeshStandardMaterial({ color: 0xff6b00, roughness: 0.35 })
    );
    orange.position.set(-0.35, 0.68, 0.4);
    orange.castShadow = true;
    marketGroup.add(orange);

    const leaf = new THREE.Mesh(
      new THREE.ConeGeometry(0.04, 0.1, 6),
      new THREE.MeshStandardMaterial({ color: 0x22c55e })
    );
    leaf.position.set(-0.35, 0.9, 0.4);
    leaf.rotation.z = 0.35;
    marketGroup.add(leaf);

    // Aguacate Hass
    const avocadoGeo = new THREE.SphereGeometry(0.2, 16, 16);
    avocadoGeo.scale(0.85, 1.25, 0.85);
    const avocado = new THREE.Mesh(
      avocadoGeo,
      new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.85 })
    );
    avocado.position.set(-0.02, 0.7, 0.45);
    avocado.rotation.z = 0.25;
    avocado.castShadow = true;
    marketGroup.add(avocado);

    // Manzana Gala Roja
    const apple = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3 })
    );
    apple.position.set(0.12, 0.68, 0.1);
    apple.castShadow = true;
    marketGroup.add(apple);

    // Paquete Dorado de Achiras Huilenses
    const achirasPack = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.6, 0.25),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.3, roughness: 0.4 })
    );
    achirasPack.position.set(-0.25, 0.72, 0.05);
    achirasPack.rotation.y = 0.4;
    achirasPack.castShadow = true;
    marketGroup.add(achirasPack);

    // Sombra en el suelo
    const shadowMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 3.2),
      new THREE.ShadowMaterial({ opacity: 0.3 })
    );
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.12;
    shadowMesh.receiveShadow = true;
    scene.add(shadowMesh);

    // -------------------------------------------------------------
    // Control de Interacción con Mouse / Touch (Sin textos invasivos)
    // -------------------------------------------------------------
    let targetRotX = 0.12;
    let targetRotY = 0.65;
    let isDragging = false;
    let isTouch = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let prevX = 0;
    let prevY = 0;
    let bounceEnergy = 0;

    const getCoords = (e: MouseEvent | TouchEvent): { x: number; y: number } => {
      if ("touches" in e && (e as TouchEvent).touches.length > 0) {
        return { x: (e as TouchEvent).touches[0].clientX, y: (e as TouchEvent).touches[0].clientY };
      }
      const me = e as MouseEvent;
      return { x: me.clientX ?? 0, y: me.clientY ?? 0 };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const { x: cx, y: cy } = getCoords(e);

      if (isDragging) {
        const dx = cx - prevX;
        const dy = cy - prevY;

        // Si es touch y el gesto es predominantemente vertical, liberar para permitir scroll nativo
        if (isTouch) {
          const totalDx = Math.abs(cx - touchStartX);
          const totalDy = Math.abs(cy - touchStartY);
          if (totalDy > totalDx && totalDy > 10) {
            isDragging = false;
            return;
          }
        }

        targetRotY += dx * 0.009;
        targetRotX += dy * 0.006;
        targetRotX = Math.max(-0.35, Math.min(0.5, targetRotX));
      }

      prevX = cx;
      prevY = cy;
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isTouch = "touches" in e;
      const { x: cx, y: cy } = getCoords(e);
      isDragging = true;
      touchStartX = cx;
      touchStartY = cy;
      prevX = cx;
      prevY = cy;
    };

    const onPointerUp = () => {
      isDragging = false;
      isTouch = false;
    };

    const domEl = renderer.domElement;
    domEl.style.touchAction = "pan-y";
    domEl.addEventListener("mousemove", onPointerMove);
    domEl.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mouseup", onPointerUp);

    domEl.addEventListener("touchmove", onPointerMove, { passive: true });
    domEl.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchend", onPointerUp);

    const onResize = () => {
      if (!currentMount) return;
      const nw = currentMount.clientWidth;
      const nh = currentMount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      camera.lookAt(0, 0.95, 0);
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    // Animación fluida continua
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (!isDragging) {
        targetRotY += 0.005;
      }

      cartGroup.rotation.y += (targetRotY - cartGroup.rotation.y) * 0.07;
      cartGroup.rotation.x += (targetRotX - cartGroup.rotation.x) * 0.07;

      // Flotación suave elevada para visibilidad total de las 4 ruedas
      cartGroup.position.y = 0.22 + Math.sin(elapsed * 2.0) * 0.05;

      // Brinco al hacer clic
      if (bounceEnergy > 0) {
        marketGroup.position.y = Math.sin(bounceEnergy * Math.PI) * 0.28;
        cartGroup.rotation.z = Math.sin(bounceEnergy * Math.PI * 2) * 0.05;
        bounceEnergy -= 0.04;
      } else {
        marketGroup.position.y = 0;
        cartGroup.rotation.z = 0;
      }

      wheels.forEach((w) => {
        w.rotation.x += 0.03;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Trigger de interacción al clic
    (currentMount as any).__triggerBounce = () => {
      bounceEnergy = 1.0;
    };

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      domEl.removeEventListener("mousemove", onPointerMove);
      domEl.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mouseup", onPointerUp);
      domEl.removeEventListener("touchmove", onPointerMove);
      domEl.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchend", onPointerUp);

      if (currentMount.contains(domEl)) {
        currentMount.removeChild(domEl);
      }
      renderer.dispose();
    };
  }, []);

  const handleClick = () => {
    if (mountRef.current && (mountRef.current as any).__triggerBounce) {
      (mountRef.current as any).__triggerBounce();
    }
  };

  return (
    <div
      className="relative w-full h-64 sm:h-80 lg:h-[440px] flex items-center justify-center select-none overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y"
      onClick={handleClick}
    >
      {/* Canvas WebGL 3D sin textos invasivos */}
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};
