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



// 360度画像の読み込み
var textures = new Array(4);
textures[0] = new THREE.TextureLoader().load( 'scene_a.JPG' );
textures[1] = new THREE.TextureLoader().load( 'scene_b.JPG' );
textures[2] = new THREE.TextureLoader().load( 'scene_c.JPG' );
textures[3] = new THREE.TextureLoader().load( 'scene_d.JPG' );

// 画像間の角度のずれを補正するため
var angles=[0,0,-45,0];


// 大きな球体の作成（360度画像を張り付けるための）
var sphere_geometry = new THREE.SphereGeometry( 5, 32, 32 );
// テクスチャを球体の裏側にマップする
sphere_geometry.scale( - 1, 1, 1 );		
// マテリアルの作成（とりあえず0番の画像を張り付けておく）
var sphere_material = new THREE.MeshPhongMaterial( { map: textures[0], color: 0xffffff } );
// オブジェクトの作成
var sphere_mesh = new THREE.Mesh( sphere_geometry, sphere_material );
// オブジェクトをシーンに追加
scene.add( sphere_mesh );



// シーンチェンジ用マーカー（白い球体）の作成
var target_geometry = new THREE.SphereGeometry( 0.25, 16, 16 );
// マテリアルの作成
var target_material = new THREE.MeshBasicMaterial({color: 0xFFFFFF});

// 各360度画像に配置するマーカーの位置
var target_xs=new Array(2);
var target_ys=new Array(2);
var target_zs=new Array(2);
target_xs[0]=2.6;
target_ys[0]=0;
target_zs[0]=-4.3;
target_xs[1]=-2.3;
target_ys[1]=0;
target_zs[1]=4.4;
var targets_in_scene=new Array(4);
targets_in_scene[0]=[];
targets_in_scene[1]=[0];
targets_in_scene[2]=[1];
targets_in_scene[3]=[];
			

// 視線との交差を調べるマーカーの配列
var targets=[];


// 角度を度数法から弧度法に変換するための関数
function to_radian(degree){
	return degree*Math.PI/180;
}


// 360度画像の初期値を1番としてシーンチェンジ
var scene_id=1;
scene_change(scene_id);			

// シーンチェンジ関数
function scene_change(scene_id){
	
	// 大きな球体の画像を変更
	scene.remove( sphere_mesh );
	sphere_material.dispose()
	sphere_material = new THREE.MeshPhongMaterial( { map: textures[scene_id], color: 0xffffff } );
	sphere_mesh = new THREE.Mesh( sphere_geometry, sphere_material );
	sphere_mesh.rotation.y=to_radian(angles[scene_id]);
	scene.add( sphere_mesh );
	
	// マーカーの削除
	for(var i=0;i<targets.length;i++)
	{
		scene.remove(targets[i]);
	}
	targets=new Array(targets_in_scene[scene_id].length);
	
	// マーカーの追加
	for(var i=0;i<targets.length;i++)
	{
		// オブジェクトの作成
		targets[i] = new THREE.Mesh( target_geometry, target_material );
		targets[i].position.x=target_xs[targets_in_scene[scene_id][i]];
		targets[i].position.y=target_ys[targets_in_scene[scene_id][i]];
		targets[i].position.z=target_zs[targets_in_scene[scene_id][i]];
		scene.add( targets[i] );
	}
}


// マーカーとの交点を計算するための視線の情報
// THREE.Raycaster用
var raycaster,scopedObj;
var cursor= new THREE.Vector2(0,0);
// THREE.Raycaster
raycaster = new THREE.Raycaster();  


// マーカーを見ているフレーム数をカウントするための変数
var frame_num=0;


// 描画関数
function render(){
	requestAnimationFrame( render );
	
	// ステレオ
	effect.render(scene, camera);
	controls.update();
	
	// 視線と交差するマーカーを取得
	raycaster.setFromCamera( cursor, camera );
	var intersects = raycaster.intersectObjects( targets );
	if ( intersects.length > 0 ) {
		if ( scopedObj != intersects[ 0 ].object ) {
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
	
}
render();

	    
