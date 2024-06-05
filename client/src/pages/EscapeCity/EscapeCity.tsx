import React, { useContext,useEffect, useRef,useState } from "react";
import './style.css';
import { useParams } from "react-router-dom";
// import { RoomContext } from "../contexts/RoomsContext";
import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Texture,
  SceneLoader,
  Mesh,
  ISceneLoaderAsyncResult,
  AbstractMesh,
  PhysicsImpostor,
  VertexBuffer,
  ArcRotateCamera,
  CubeTexture,
  ActionManager,
  ExecuteCodeAction,
  UniversalCamera,
  Color3,
  AmmoJSPlugin,
  CannonJSPlugin,
  HavokPlugin,
  ActionEvent,
  BabylonFileLoaderConfiguration,
  Sound,
  Matrix,
  Quaternion,
  Color4,
  GlowLayer,
  PointLight,
  ShadowGenerator,
  PhysicsViewer,
  ISceneLoaderProgressEvent,
  AssetContainer,
  TransformNode,
  PhysicsAggregate,
  PhysicsShapeType,
  DirectionalLight
} from "@babylonjs/core";
import '@babylonjs/loaders';
import { TfiRulerAlt } from "react-icons/tfi";
import * as CANNON from 'cannon';
import { GameUI } from "./ui";
import { AdvancedDynamicTexture, StackPanel, Button, TextBlock, Rectangle, Control, Image } from "@babylonjs/gui";
import HavokPhysics from '@babylonjs/havok';
import { ThirdPersonController } from './thirdPersonController';


// import { EscapeRoomGUI } from "./GUI";
// Make Cannon.js available in the global scope
BabylonFileLoaderConfiguration.LoaderInjectedPhysicsEngine = CANNON ;
window.CANNON = CANNON;

type KeyStatus = {
  w: boolean;
  s: boolean;
  a: boolean;
  d: boolean;
  b: boolean;
  Shift: boolean;
};

enum State { START = 0, GAME = 1, LOSE = 2, CUTSCENE = 3 }

interface EscapeCityProps {
  runaway_id: number;  // ensure that runaway_id is expected to be a number
  onSetDistanceCovered: (id: number) => void;
}


export const EscapeCity: React.FC<EscapeCityProps> = ({runaway_id,onSetDistanceCovered}) => {
  // get the room id from url
   console.log("Runaway id",runaway_id)

  const createScene = async (canvas: HTMLCanvasElement | null): Promise<{ scene: Scene | undefined}> => {

    if (!canvas) {
      // If canvas is null, return a promise with an object where scene is undefined
      return Promise.resolve({ scene: undefined, defaultSpheres: () => {},moveSpheres: () => {},playersTurn:'' });
    }    

      const havokPlugin = await HavokPhysics();

      const engine = new Engine(canvas, true);
      // scene
      const scene = new Scene(engine);
      scene.ambientColor =  new Color3(.1,0.1,0.1);
      //scene.gravity = new Vector3(0,-0.75,0);
      scene.collisionsEnabled = true;

      scene.gravity.y = -0.08;

      const physicsPlugin = new HavokPlugin(true, havokPlugin);
      scene.enablePhysics(undefined, physicsPlugin);
      const physicsViewer = new PhysicsViewer();

      let radius = 10;
      let height = 6;
      let angle = 0;
      let deltaAngle = 0.015;


      const gameCenter = new Vector3(0, 2, 5);


  
      const hemiLight = new HemisphericLight("hemiLight", new Vector3(0, 2, 0), scene);


      hemiLight.intensity = 1;
    
      //const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);

      // const board = SceneLoader.ImportMesh('','./models/','board.gltf',scene,(meshes) => {
      //   console.log('meshes',meshes)
      // })

      const gameUI = new GameUI(scene);

      const loadModels = async (modelName:string) => {
        try {
          const result = await SceneLoader.ImportMeshAsync('', '/models/', modelName);
          // Do something with the result here
          return result; // You can return the result if needed
        } catch (error) {
          // Handle errors if necessary
          console.error(error);
          throw error; // Re-throw the error if needed
        }
      };
      
      // Call the function
      const {meshes} = await loadModels('escapecity.glb');
      //const {meshes:} = await loadModels('escapecity.glb');

      meshes.forEach(mesh => {
        addPhysicsAggregate(mesh);
    });

   

      function loadAsset(
        rootUrl: string,
        sceneFilename: string
    ): Promise<AssetContainer> {
        return new Promise((resolve, reject) => {
            SceneLoader.LoadAssetContainer(
                import.meta.env.BASE_URL + rootUrl,
                sceneFilename,
                scene,
                (container) => {
                    resolve(container);
                },
                null,  // Removed the callback function handling
                () => {
                    reject(null);
                }
            );
        });
    }
    
    // Usage without callback
    const container = await loadAsset('models/', 'player.glb');
    const [mesheRoot] = container.meshes;
    mesheRoot.receiveShadows = true;
    const lightDirection = new Vector3(0, -1, 0);
    const light = new DirectionalLight('DirectionalLight', lightDirection, scene);
    light.position = new Vector3(0, 20, 6);
    light.intensity = 0.5;
    const shadowGenerator = new ShadowGenerator(2048, light);
    shadowGenerator.addShadowCaster(mesheRoot);
    container.addAllToScene();

  
      const camera = new ArcRotateCamera(
          'arcCamera1',
          0,
          2,
          5,
          Vector3.Zero(),
          scene
      );
      camera.attachControl(canvas, false);

      camera.setPosition(new Vector3(0, 8.14, -9.26));
      camera.lowerRadiusLimit = 1; // 最小缩放;
      // const isLocked = false;
      // scene.onPointerDown = () => {
      //     if (!isLocked) {
      //         canvas.requestPointerLock =
      //             canvas.requestPointerLock ||
      //             canvas.msRequestPointerLock ||
      //             canvas.mozRequestPointerLock ||
      //             canvas.webkitRequestPointerLock ||
      //             false;
      //         if (canvas.requestPointerLock) {
      //             // isLocked = true;
      //             canvas.requestPointerLock();
      //         }
      //     }
      // };
      const glowLayer = new GlowLayer("glow", scene);
      glowLayer.intensity = 0.7;


     const characterController =  new ThirdPersonController(container, camera, scene);

 
        const ground = MeshBuilder.CreateGround(
          'ground',
          { width: 500, height: 500 },
          scene
      );
      const material = new StandardMaterial('material', scene);
      material.diffuseColor = new Color3(0.5, 1, 0.5);
      ground.material = material;
      ground.checkCollisions = true;
      ground.receiveShadows = true;
      ground.position.y = -0.03;
      ground.position.z = 15;
      addPhysicsAggregate(ground);

      function addPhysicsAggregate(meshe: TransformNode) {
        const res = new PhysicsAggregate(
            meshe,
            PhysicsShapeType.BOX,
            { mass: 0, friction: 0.5 },
            scene
        );
        // this.physicsViewer.showBody(res.body);
        return res;
    }


    const createEnemy = (name: string, position: Vector3, scene: Scene): Mesh => {
      const cone = MeshBuilder.CreateCylinder(`${name}_cone`, { diameterTop: 0, diameterBottom: 1, height: 1.5 }, scene);
      const box = MeshBuilder.CreateBox(`${name}_box`, { height: 0.7, depth: 0.5, width: 0.2 }, scene);
      box.position.z = -0.5;
      box.position.y = -0.35;
      const enemy = Mesh.MergeMeshes([cone, box], true, true, undefined, false, true);
      enemy!.position = position;
  
      // Apply random material
      const material = new StandardMaterial(`${name}_material`, scene);
      material.diffuseColor = new Color3(Math.random(), Math.random(), Math.random());
      enemy!.material = material;
  
      // Add physics
      const res = new PhysicsAggregate(
          enemy!,
          PhysicsShapeType.BOX,
          { mass: 0, friction: 0.5 },
          scene
      );
  
      return enemy!;
  };

  const hitSound = new Sound("hitSound", "/sounds/impact.mp3", scene);
  
  const createProjectile = (scene: Scene): Mesh => {
      const sphere = MeshBuilder.CreateSphere("projectile", { diameter: 0.2 }, scene);
      sphere.material = new StandardMaterial("projectileMaterial", scene);
      (sphere.material as StandardMaterial).emissiveColor = new Color3(1, 0, 0); // Red glow
      sphere.isPickable = false; // Disable picking for the projectile

      glowLayer.addIncludedOnlyMesh(sphere);
      return sphere;
  };
  
  const shootProjectile = (enemy: Mesh, target: Mesh, scene: Scene, projectiles: Mesh[]): void => {
      const projectile = createProjectile(scene);
      projectile.position = enemy.position.clone();
      
      const direction = target.position.subtract(enemy.position).normalize();
      const speed = 1; // Speed of the projectile
      
      const interval = setInterval(() => {
          projectile.position.addInPlace(direction.scale(speed));
          
          // Check for collision with the player
          if (Vector3.Distance(projectile.position, target.position) < 0.5) {
              // Reduce player's life
              life -= 0.05; // Adjust as needed
             
                hitSound.play();
    
              gameUI.updateLifeBar(life);
              if (life <= 0  ){
                characterController.setDead();
                    // Convert meters to kilometers and round to the nearest integer
                  let totalDistanceInKm = totalDistance / 1000;
                  
                  // Ensure that very small distances (less than 1 km but greater than 0) are treated fairly
                  const roundedDistance = totalDistanceInKm < 1 && totalDistanceInKm > 0 ? 1 : Math.round(totalDistanceInKm);

                onSetDistanceCovered(roundedDistance);
              }
              // Remove the projectile from the scene and the projectiles array
              projectiles = projectiles.filter(p => p !== projectile);
              projectile.dispose();
              clearInterval(interval);
          }else{}
        
            hitSound.stop();
        
      }, 16); // Update projectile position every 16ms (~60 FPS)
  
      // Dispose of the projectile after 2 seconds
      setTimeout(() => {
          projectiles = projectiles.filter(p => p !== projectile);
          projectile.dispose();
          clearInterval(interval);
      }, 2000);
  
      projectiles.push(projectile);
  };
  
  const enemyBehaviors = [
      (enemy: Mesh) => { // Direct approach
          return characterController.player.position.subtract(enemy.position).normalize();
      },
      (enemy: Mesh) => { // Flanking from the left
          const offset = new Vector3(-1, 0, 0);
          return characterController.player.position.add(offset).subtract(enemy.position).normalize();
      },
      (enemy: Mesh) => { // Flanking from the right
          const offset = new Vector3(1, 0, 0);
          return characterController.player.position.add(offset).subtract(enemy.position).normalize();
      },
      (enemy: Mesh) => { // Zig-zag approach
          const randomOffset = Math.sin(Date.now() / 1000) * 0.5;
          return characterController.player.position.add(new Vector3(randomOffset, 0, randomOffset)).subtract(enemy.position).normalize();
      }
  ];
  
  let life = 1;
  let enemyCount = 1;
  let startTime = Date.now(); // Initialize the timer
  // Array to keep track of all enemies and their behaviors
  const enemies: { enemy: Mesh; behavior: (enemy: Mesh) => Vector3; speed: number; lastShotTime: number }[] = [];
  const projectiles: Mesh[] = [];
  
  // Function to update enemy positions and chase the player with different behaviors
  const updateEnemies = () => {
      const currentTime = Date.now();
  
      enemies.forEach((enemyData) => {
          const { enemy, behavior, speed, lastShotTime } = enemyData;
          const direction = behavior(enemy);
          const randomFactor = Math.random() * 0.1; // Random factor for randomness in path
          const randomizedDirection = direction.add(new Vector3(randomFactor, 0, randomFactor)).normalize();
  
          // Define a small threshold for considering positions equal
          const threshold = 0.1;
  
          // Check if the distance between the player and the enemy is less than the threshold
          if (Vector3.Distance(characterController.player.position, enemy.position) < threshold) {
              life -= 0.001; // Decrease life only when the player is attacked

              if (life <= 0  ){
                characterController.setDead();

                                  // Convert meters to kilometers and round to the nearest integer
                  let totalDistanceInKm = totalDistance / 1000;
                  
                  // Ensure that very small distances (less than 1 km but greater than 0) are treated fairly
                  const roundedDistance = totalDistanceInKm < 1 && totalDistanceInKm > 0 ? 1 : Math.round(totalDistanceInKm);

                          
                onSetDistanceCovered(roundedDistance);;
              }
          }
  
          // Update the life bar
          gameUI.updateLifeBar(life);
  
          const forward = randomizedDirection;
          const fin = Vector3.Cross(forward, new Vector3(0, 1, 0));
          const side = Vector3.Cross(forward, fin);
          const orientation = Vector3.RotationFromAxis(side, forward, fin);
          enemy.rotation = orientation;
          enemy.position.addInPlace(forward.scale(speed));
  
          // Check if it's time for the enemy to shoot
          if (currentTime - lastShotTime > 3000) { // Shoot every 3 seconds
              shootProjectile(enemy, characterController.player as Mesh, scene, projectiles);
              enemyData.lastShotTime = currentTime; // Update the last shot time
          }
      });
  };
  
  // Create the initial enemy
  const initialEnemy = createEnemy(`enemy_${enemyCount}`, new Vector3(gameCenter.x + 12, gameCenter.y - 30, gameCenter.z + 15), scene);
  enemies.push({ enemy: initialEnemy, behavior: enemyBehaviors[Math.floor(Math.random() * enemyBehaviors.length)], speed: 0.1 + Math.random() * 0.1, lastShotTime: Date.now() });
  gameUI.updateEnemiesCount(enemyCount);

  let lastPosition = characterController.player.position.clone();

  let totalDistance = 0;
  
  scene.onBeforeRenderObservable.add(() => {

    const currentPosition = characterController.player.position.clone(); 
    let distanceMoved = Vector3.Distance(lastPosition, currentPosition);
    distanceMoved = parseFloat(distanceMoved.toFixed(2));
      // Calculate elapsed time in seconds
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      gameUI.updateElapsedTime(elapsedTime);
  
      updateEnemies();
  
      // Add a new enemy every minute
      if (elapsedTime % 60 === 0 && elapsedTime !== 0 && elapsedTime !== previousElapsedTime) {
          previousElapsedTime = elapsedTime; // Update the previous elapsed time to avoid adding multiple enemies in the same second
          enemyCount += 1; // Increase the enemy count
          const newEnemyPosition = new Vector3(gameCenter.x + Math.random() * 20 - 10, gameCenter.y - 30, gameCenter.z + Math.random() * 20 - 10);
          const newEnemy = createEnemy(`enemy_${enemyCount}`, newEnemyPosition, scene);
          const randomBehavior = enemyBehaviors[Math.floor(Math.random() * enemyBehaviors.length)];
          const randomSpeed = 0.1 + Math.random() * 0.1; // Speed between 0.1 and 0.2
          enemies.push({ enemy: newEnemy, behavior: randomBehavior, speed: randomSpeed, lastShotTime: Date.now() });
          gameUI.updateEnemiesCount(enemyCount); // Update the UI with the new enemy count
      }

      if (distanceMoved > 0) { // Check if the player has actually moved
        console.log(`Player moved ${distanceMoved} units`); // Use this distance for calculations

        totalDistance +=distanceMoved;

        lastPosition = currentPosition; // Update lastPosition to current position after processing

        gameUI.updateDistance(parseFloat(totalDistance.toFixed(2)));
    }
  });
  
  // Variable to keep track of the last elapsed time when an enemy was added
  let previousElapsedTime = 0;
  
  // Example function to add a new enemy manually if needed
  function addEnemy() {
      enemyCount += 1; // Increase the enemy count
      const newEnemyPosition = new Vector3(gameCenter.x + Math.random() * 20 - 10, gameCenter.y - 30, gameCenter.z + Math.random() * 20 - 10);
      const newEnemy = createEnemy(`enemy_${enemyCount}`, newEnemyPosition, scene);
      const randomBehavior = enemyBehaviors[Math.floor(Math.random() * enemyBehaviors.length)];
      const randomSpeed = 0.1 + Math.random() * 0.1; // Speed between 0.1 and 0.2
      enemies.push({ enemy: newEnemy, behavior: randomBehavior, speed: randomSpeed, lastShotTime: Date.now() });
      gameUI.updateEnemiesCount(enemyCount); // Update the UI with the new enemy count
  }
  
  // Call addEnemy when necessary to manually add enemies during the game
      // Create and play the background music
    //   const backgroundMusic = new Sound("backgroundMusic", "sounds/nightmare.mp3", scene, null, {
    //     loop: true, // Loop the sound
    //     autoplay: true, // Play the sound immediately
    //     volume: 0.5 // Adjust the volume
    // });
    
      // Assuming 'scene' is your Babylon.js scene object
      engine.runRenderLoop(() => {


        scene.render();
      });
    
      window.addEventListener('resize', () => {
        engine.resize();
      });

      //ground.material = CreateGroundMaterial(scene);
      // ball.material = CreateBallMaterial(scene);

    
      return {scene};
  };


  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scene, setScene] = useState<Scene | undefined>(undefined);


  useEffect(() => {
    const loadScene = async (): Promise<() => void> => {
      const {scene:sceneCreated} = await createScene(canvasRef.current);

      
      // Optionally, you can handle the scene instance or perform additional actions here

      if (sceneCreated) {
        setScene(sceneCreated);

      }
      
      return () => {
        if (sceneCreated) {
          sceneCreated.dispose(); // Clean up the scene when the component unmounts
        }
      };
    };

    const cleanup = loadScene().then(cleanupFunction => cleanupFunction);

    return () => {
      cleanup.then(cleanupFunction => cleanupFunction());
    };
  }, []);


  //console.log("am available here",playerTurn);

  return (
      <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        <canvas className="canvas" ref={canvasRef}></canvas>
      </div>

  );
};



