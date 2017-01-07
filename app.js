var container, stats;
var camera, controls, scene, renderer;
var objects = [];

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 2, 200 );
    camera.position.set( 50, 30, -30 );

    controls = new THREE.TrackballControls( camera );
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    scene = new THREE.Scene();

    scene.add( new THREE.AmbientLight( 0x505050 ) );

    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 100, 100, 100 );
    light.castShadow = true;
    light.shadow.mapSize.set(2*2048, 2*2048);
    light.shadow.camera.near = 2;
    light.shadow.camera.far = 500;
    light.shadow.camera.left = -100;
    light.shadow.camera.right = 100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    scene.add( light );

    var planeGeometry = new THREE.PlaneGeometry( 200, 200 );
    planeGeometry.rotateX( - Math.PI / 2 );
    var planeMaterial = new THREE.MeshLambertMaterial();
    planeMaterial.opacity = 1;

    var plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.position.y = 0;
    plane.receiveShadow = true;
    scene.add( plane );

    var helper = new THREE.GridHelper( 100, 100 );
    helper.position.y = 0;
    helper.material.opacity = 0.25;
    helper.material.transparent = true;
    scene.add( helper );

    var axis = new THREE.AxisHelper();
    axis.position.set( 0, 0, 0 );
    axis.scale.x = axis.scale.y = axis.scale.z = 10;
    scene.add( axis );
    
    var geometry = new THREE.CylinderGeometry( 1, 1, 5, 12 );

    for ( var i = 0; i < 8; i ++ ) {

        var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

        object.scale.x = 1;
        object.scale.y = 5;
        object.scale.z = 1;

        object.position.x = i * 4;
        object.position.y = object.scale.y / 2.0;
        object.position.z = 0;//i * 3;

        object.castShadow = true;
        object.receiveShadow = true;

        scene.add( object );

        objects.push( object );

    }

    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    renderer.setClearColor( 0xf0f0f0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.sortObjects = false;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // THREE.PCFShadowMap;

    container.appendChild( renderer.domElement );

    var dragControls = new THREE.DragControls( objects, camera, renderer.domElement, plane );
    dragControls.addEventListener( 'dragstart', function ( event ) { controls.enabled = false; } );
    dragControls.addEventListener( 'dragend', function ( event ) { controls.enabled = true; } );

    var info = document.createElement( 'div' );
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.innerHTML = '<a href="http://threejs.org" target="_blank">three.js</a> webgl - draggable cubes';
    container.appendChild( info );

    stats = new Stats();
    container.appendChild( stats.dom );

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    requestAnimationFrame( animate );

    render();
    stats.update();

}

function render() {

    controls.update();

    renderer.render( scene, camera );

}
