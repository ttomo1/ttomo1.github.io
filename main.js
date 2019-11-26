//THREE.Raycaster用
var raycaster,scopedObj;
var cursor= new THREE.Vector2(0,0);
//THREE.Raycaster
raycaster = new THREE.Raycaster();    
	    
// シーンの作成
var scene = new THREE.Scene();
// カメラの作成
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// レンダラーの作成（アンチエイリアス有効）
var renderer = new THREE.WebGLRenderer( {antialias: true} );
// ステレオ
var effect = new THREE.StereoEffect(renderer);
// レンダラーが描画するキャンバスサイズの設定
renderer.setSize( window.innerWidth, window.innerHeight );
// ステレオ
effect.setSize(window.innerWidth, window.innerHeight);
// キャンバスをDOMツリーに追加
document.body.appendChild( renderer.domElement );
// 環境光の作成
var light = new THREE.AmbientLight( 0xffffff );
// 環境光をシーンへ追加
scene.add( light );
// DeviceOrientationControlsインスタンス作成
var controls = new THREE.DeviceOrientationControls( camera );
	    
// 球体の作成
var sphere_geometry = new THREE.SphereGeometry( 5, 32, 32 );
// テクスチャを球体の裏側にマップする
sphere_geometry.scale( - 1, 1, 1 );
// テクスチャ画像の読み込み
//var texture = new THREE.TextureLoader().load( '360.jpg' );
// テクスチャ画像の読み込み
var textures = new Array(4);
textures[0] = new THREE.TextureLoader().load( 'scene_a.JPG' );
textures[1] = new THREE.TextureLoader().load( 'scene_b.JPG' );
textures[2] = new THREE.TextureLoader().load( 'scene_c.JPG' );
textures[3] = new THREE.TextureLoader().load( 'scene_d.JPG' );
//var texture = new THREE.TextureLoader().load( 'scene01.JPG' );
var angles=[0,0,-90,0];
			
// マテリアルの作成
var sphere_material = new THREE.MeshPhongMaterial( { map: textures[1], color: 0xffffff } );
// オブジェクトの作成
var sphere_mesh = new THREE.Mesh( sphere_geometry, sphere_material );
// オブジェクトをy軸に沿って回転
//sphere_mesh.rotation.y = Math.PI/2;
// オブジェクトをシーンに追加
scene.add( sphere_mesh );
			
// 球体の作成
var target_geometry = new THREE.SphereGeometry( 0.25, 16, 16 );
// マテリアルの作成
var target_material = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
			
var target_xs=new Array(2);
var target_ys=new Array(2);
var target_zs=new Array(2);
target_xs[0]=2.6;
target_ys[0]=0;
target_zs[0]=-4.3;
target_xs[1]=1.4;
target_ys[1]=0;
target_zs[1]=4.7;
var targets_in_scene=new Array(4);
targets_in_scene[0]=[];
targets_in_scene[1]=[0];
targets_in_scene[2]=[1];
targets_in_scene[3]=[];
			
var targets=[];
			
var scene_id=1;
scene_change(scene_id);			
			
function scene_change(scene_id){
	
	scene.remove( sphere_mesh );
	sphere_material.dispose()
	sphere_material = new THREE.MeshPhongMaterial( { map: textures[scene_id], color: 0xffffff } );
	sphere_mesh = new THREE.Mesh( sphere_geometry, sphere_material );
	sphere_mesh.rotation.y=angles[scene_id];
	scene.add( sphere_mesh );
	
	
	for(var i=0;i<targets.length;i++)
	{
		scene.remove(targets[i]);
	}
	targets=new Array(targets_in_scene[scene_id].length);
	
	for(var i=0;i<targets.length;i++)
	{
		// オブジェクトの作成
		targets[i] = new THREE.Mesh( target_geometry, target_material );
		targets[i].position.x=target_xs[targets_in_scene[scene_id][i]];
		targets[i].position.y=target_ys[targets_in_scene[scene_id][i]];
		targets[i].position.z=target_zs[targets_in_scene[scene_id][i]];
		scene.add( targets[i] );
	}
	
//	geometry.dispose();
//	material.dispose();
//	texture.dispose();
}
	    
var frame_num=0;
			
function render(){
	requestAnimationFrame( render );
	// レンダリング
	renderer.render(scene,camera);
	
	// ステレオ
	//effect.render(scene, camera);
	controls.update();
	
	// ポイントが乗っているオブジェクトを取得
	raycaster.setFromCamera( cursor, camera );
	var intersects = raycaster.intersectObjects( targets );
//	if ( intersects.length > 0 ) {
//		scene_id = 3-scene_id;
//		scene_change(scene_id);
//	}
	if ( intersects.length > 0 ) {
		if ( scopedObj != intersects[ 0 ].object ) {
//			if ( scopedObj ) scopedObj.scale.set(1,1,1);
			scopedObj = intersects[ 0 ].object;
			scopedObj.scale.set(2,2,2);
			frame_num=0;
		}
		else
		{
			frame_num++;
			if(frame_num>=30)
			{
				frame_num=0;
				scene_id=3-scene_id;
				scene_change(scene_id);
			}
		}
	} else {
		if ( scopedObj ) scopedObj.scale.set(1,1,1);
		scopedObj = null;
  	}
	
	var intersect = raycaster.intersectObject( sphere_mesh );
	
	var doc0= document.getElementById("div0");  
	doc0.innerHTML= String(intersect[0].point.x)+" "+String(intersect[0].point.y)+" "+String(intersect[0].point.z);   
	
}
render();

	    
