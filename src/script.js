// Base
var controls;

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Group
const house = new THREE.Group();
scene.add(house);

/**
 * Texture
 */
const textureLoader = new THREE.TextureLoader();

const textures = {
    floor: {
        alpha: textureLoader.load('./textureFloor/alpha.jpg'),
        color: textureLoader.load('./textureFloor/coast_sand_rocks_02_diff_1k.png'),
        arm: textureLoader.load('./textureFloor/coast_sand_rocks_02_arm_1k.png'),
        normal: textureLoader.load('./textureFloor/coast_sand_rocks_02_nor_gl_1k.png'),
        displacement: textureLoader.load('./textureFloor/coast_sand_rocks_02_disp_1k.png')
    },
    door: {
        color: textureLoader.load('./textureDoor/Wood_Door_003_basecolor.jpg'),
        height: textureLoader.load('./textureDoor/Wood_Door_003_height.png'),
        normal: textureLoader.load('./textureDoor/Wood_Door_003_normal.jpg'),
        ambientOcclusion: textureLoader.load('./textureDoor/Wood_Door_003_ambientOcclusion.jpg'),
        metalness: textureLoader.load('./textureDoor/Material_1490.jpg'),
        roughness: textureLoader.load('./textureDoor/Wood_Door_003_roughness.jpg')
    },
    wall: {
        color: textureLoader.load('./textureWall/castle_brick_broken_06_diff_1k.jpg'),
        arm: textureLoader.load('./textureWall/castle_brick_broken_06_arm_1k.jpg'),
        normal: textureLoader.load('./textureWall/castle_brick_broken_06_nor_gl_1k.jpg')
    },
    roof: {
        color: textureLoader.load('./textureRoof/clay_roof_tiles_diff_1k.jpg'),
        arm: textureLoader.load('./textureRoof/clay_roof_tiles_arm_1k.jpg'),
        normal: textureLoader.load('./textureRoof/clay_roof_tiles_nor_gl_1k.jpg')
    },
    bush: {
        color: textureLoader.load('./textureBush/coral_fort_wall_03_diff_1k.jpg'),
        arm: textureLoader.load('./textureBush/coral_fort_wall_03_diff_1k.jpg'),
        normal: textureLoader.load('./textureBush/coral_fort_wall_03_nor_gl_1k.jpg')
    },
    grave: {
        color: textureLoader.load('./textureGrave/plastered_stone_wall_diff_1k.jpg'),
        arm: textureLoader.load('./textureGrave/plastered_stone_wall_arm_1k.jpg'),
        normal: textureLoader.load('./textureGrave/plastered_stone_wall_nor_gl_1k.jpg')
    },
    moonpng:{
        color: textureLoader.load('./textureMoon/polystyrene_diff_4k.jpg'),
        arm: textureLoader.load('./textureMoon/polystyrene_arm_4k.jpg'),
        normal: textureLoader.load('./textureMoon/polystyrene_nor_gl_4k.jpg')

    }
};

/**
 * House
 */

// Wall of the house
const wall = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: textures.wall.color,
        aoMap: textures.wall.arm,
        metalnessMap: textures.wall.arm,
        roughnessMap: textures.wall.arm,
        normalMap: textures.wall.normal
    })
);
wall.position.y = 2.5 / 2;
wall.castShadow = true; // Enable shadow casting
house.add(wall);

// Roof of the house
const roofHouse = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({
        map: textures.roof.color,
        aoMap: textures.roof.arm,
        metalnessMap: textures.roof.arm,
        roughnessMap: textures.roof.arm,
        normalMap: textures.roof.normal
    })
);
roofHouse.position.y = 2.5 + 0.75;
roofHouse.rotation.y = Math.PI * 0.25;
roofHouse.castShadow = true; // Enable shadow casting
house.add(roofHouse);

// Door of the house
const doorHouse = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 2.2),
    new THREE.MeshStandardMaterial({
        map: textures.door.color,
        aoMap: textures.door.ambientOcclusion,
        metalnessMap: textures.door.metalness,
        roughnessMap: textures.door.roughness,
        normalMap: textures.door.normal,
        displacementMap: textures.door.height,
        displacementScale: 0
    })
);
doorHouse.position.z = 2 + 0.01;
doorHouse.position.y = 1;
doorHouse.castShadow = true; // Enable shadow casting
house.add(doorHouse);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
    color: '#ccffcc',
    map: textures.bush.color,
    aoMap: textures.bush.arm,
    metalnessMap: textures.bush.arm,
    roughnessMap: textures.bush.arm,
    normalMap: textures.bush.normal
});
const bushes = [];
const bushPositions = [
    { pos: [0.8, 0.2, 2.2], scale: 0.5 },
    { pos: [1.4, 0.1, 2.1], scale: 0.25 },
    { pos: [-1.4, 0.15, 2.6], scale: 0.4 },
    { pos: [-1.5, 0, 3.5], scale: 0.15 }
];
bushPositions.forEach(({ pos, scale }) => {
    const bush = new THREE.Mesh(bushGeometry, bushMaterial);
    bush.position.set(...pos);
    bush.scale.set(scale, scale, scale);
    bush.rotation.x = -0.75;
    bush.castShadow = true; // Enable shadow casting
    bush.receiveShadow = true; // Enable shadow receiving
    bushes.push(bush);
});
const bushesGroup = new THREE.Group();
bushes.forEach(bush => bushesGroup.add(bush));
house.add(bushesGroup);

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
        alphaMap: textures.floor.alpha,
        transparent: true,
        map: textures.floor.color,
        aoMap: textures.floor.arm,
        metalnessMap: textures.floor.arm,
        roughnessMap: textures.floor.arm,
        normalMap: textures.floor.normal,
        displacementMap: textures.floor.displacement,
        displacementScale: 0.3,
        displacementBias: -0.2
    })
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = -0.001;
floor.receiveShadow = true; // Enable shadow receiving
scene.add(floor);

// Graveyard
const graveHouseGroup = new THREE.Group();
scene.add(graveHouseGroup);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
    map: textures.grave.color,
    aoMap: textures.grave.arm,
    metalnessMap: textures.grave.arm,
    roughnessMap: textures.grave.arm,
    normalMap: textures.grave.normal
});

for (let i = 0; i < 30; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 4;
    const angleX = Math.sin(angle) * radius;
    const angleZ = Math.cos(angle) * radius;
    const grave = new THREE.Mesh(graveGeometry, graveMaterial);
    grave.position.set(angleX, Math.random() * 0.4, angleZ);
    grave.rotation.set(
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4
    );
    grave.castShadow = true; // Enable shadow casting
    grave.receiveShadow = true; // Enable shadow receiving
    graveHouseGroup.add(grave);
}

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('#ffffff', 1);
directionalLight.position.set(3, 2, -8);
directionalLight.castShadow = true; // Enable shadow casting
scene.add(directionalLight);

// Fix for door light
const doorLight = new THREE.PointLight('#ff7d46', 5, 5); // Set color and intensity
doorLight.position.set(0, 2.2, 2.5); // Position the light correctly
doorLight.castShadow = true; // Enable shadow casting
house.add(doorLight);

const light = new THREE.PointLight('red', 20, 1.3);
const light2 = new THREE.PointLight('green', 20, 1.3);
scene.add(light, light2);
// Configure directional light shadows
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;

light.shadow.mapSize.width = 256
light.shadow.mapSize.height = 256
light.shadow.camera.far = 10

light2.shadow.mapSize.width = 256
light2.shadow.mapSize.height = 256
light2.shadow.camera.far = 10

// القمر
const moon = new THREE.Mesh(
    new THREE.SphereGeometry(1.7, 100, 100),
    new THREE.MeshStandardMaterial({
        color:'white',
        map: textures.moonpng.color,
        aoMap: textures.moonpng.arm,
        metalnessMap: textures.moonpng.arm,
        roughnessMap: textures.moonpng.arm,
        normalMap: textures.moonpng.normal,
  
    })

);
moon.position.set(10, 10, -40);
const moonLight = new THREE.PointLight('white', 5, 20); // يمكن تعديل الشدة (2) والمدى (10) حسب الحاجة
moonLight.position.copy(moon.position);
moonLight.position.x = -10
scene.add(moonLight);
scene.add(moon);

// تخزين موضع الكاميرا الأصلي
const originalCameraPosition = new THREE.Vector3(4, 2, 10);

/**
 * Fog
 */
// scene.fog = new THREE.Fog('#ff0000', 10, 10)
scene.fog = new THREE.FogExp2('#04343f', 0.05)
/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.copy(originalCameraPosition);
scene.add(camera);

// Controls
controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true; // Enable shadow mapping
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Set shadow map type

/**
 * Resize
 */
window.addEventListener('resize', () => {
    // Update sizes
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Update camera
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Animate
 */
const clock = new THREE.Clock();


function updateMoonPosition() {
    // تحديث موضع القمر بناءً على الفرق بين موضع الكاميرا الحالي والموضع الأصلي
    const deltaX = camera.position.x - originalCameraPosition.x;
    const deltaY = camera.position.y - originalCameraPosition.y;
    const deltaZ = camera.position.z - originalCameraPosition.z;
    
    moon.position.set(
        10 + deltaX,
        10 + deltaY,
        -20 + deltaZ
    );
}

function tick() {
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Update moon position
    updateMoonPosition();

    // Update light positions
    light.position.x = Math.sin(elapsedTime) * 4;
    light.position.z = Math.cos(elapsedTime) * 4;
    light.position.y = Math.sin(elapsedTime * 3);
    light2.position.x = Math.sin(elapsedTime) * 7;
    light2.position.z = Math.cos(elapsedTime) * -6;
    light2.position.y = Math.sin(elapsedTime * 4);
    doorLight.intensity = Math.abs(Math.sin(elapsedTime * 5)); // Adjust speed with multiplication factor

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();
