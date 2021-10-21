import kaboom from "kaboom";

//stat track 
(function() { var script = document.createElement('script'); script.onload = function() { var stats = new Stats(); document.body.appendChild(stats.dom); requestAnimationFrame(function loop() { stats.update(); requestAnimationFrame(loop) }); }; script.src = '//mrdoob.github.io/stats.js/build/stats.min.js'; document.head.appendChild(script); })()

// initialize context

// init with some options (check out #KaboomOpt for full options list)
// create a game with custom dimension, but stretch to fit container, keeping aspect ratio, with a clear color
kaboom({
    // width: 320,
    // height: 240,
    // stretch: true,
    // letterbox: true,
    font: "sinko",
		// crips: true,
    // background: [ 0, 0, 255, ],
});
let fontSize = 2;

// load assets

loadSprite("bean", "sprites/bean.png");
loadPedit("ship_1", "sprites/ship_1.pedit");
loadSprite("arrow", "sprites/arrow.png");
loadSprite("planet1", "sprites/planet1.png");
loadSprite("planet2", "sprites/planet 2.png");
loadSprite("stars", "sprites/stars repeting.jpg");
loadSprite("planetWhite", "sprites/planetWhite.png");
// loadSprite("passenger", "sprites/passenger.png");
loadPedit("passenger", "sprites/cargo.pedit");

//ship stages
loadPedit("ship1", "sprites/ship_1.pedit");
loadPedit("stars1", "sprites/stars_1.pedit");


let angleOfMovement = 0;
//scale by screen size
const mapScale = 1.5;
const block_size = 64 * mapScale;
const background_size = 64 * mapScale * 6;
const numberOfBackTiles = 48;

let planets = [
	"white",
	"red",
	"blue",
	"green",]

let planetsVars = []


layers([
	"bg",
	"game",
	"ui",
	"uiText",
	"store",
	
], "game");


const map = addLevel([
	"        ",
	"        ",
	"        ",
	"        ",
	"        ",
	"        ",
	"        ",
	"        ",
], {
	width: background_size,
	height: background_size,
	pos: vec2(width() / 2 - 10 * background_size, height() / 2 - 10 * background_size),
	"=": () => [
		rect(background_size, background_size),
		color(255, 0, 0),
		area(),
		origin("center"),
		// "planet",
		layer("bg"),
		"background",
		{
			startingPos: [0, 0],
		}
	],
	" ": () => [
		rect(background_size, background_size),
		sprite("stars"),
		scale(0.5484 * mapScale),
		// color(0,0,0),
		area(),
		origin("center"),
		layer("bg"),
		"background",
		{
			startingPos: [0, 0],
		}
	],
});

//Planets
const planetHome = add([
	sprite("planet1"),
	area(),
	solid(),
	pos(0, 0),
	scale(mapScale),
	layer("game"),
	origin("center"),
	"planet",
	{
		realPos: [0, 0],
		startingPos: [0, 0],
		name: "home",
		passengers: [],
	},
]);

// const planet2 = add([
// 	sprite("planet2"),
// 	area(),
// 	solid(),
// 	pos(9*block_size,3*block_size),
// 	scale(2*mapScale),
// 	origin("center"),
// 	"planet",
// 	{
//   	realPos: [9*block_size,3*block_size],
//   },
// ]);

planetsVars.push(add([
	sprite("planetWhite"),
	area(),
	solid(),
	// color(255,0,0),
	pos(
		30 * block_size,
		15 * block_size),

	scale(mapScale),
	layer("game"),
	origin("center"),
	"planet",
	{
		realPos: [
			20 * block_size,
			15 * block_size],
		startingPos: [
			20 * block_size,
			15 * block_size],
		name: "white",
		passengers: [],
	},
]));

planetsVars.push(add([
	sprite("planetWhite"),
	area(),
	solid(),
	color(255, 0, 0),
	pos(12 * block_size, 6 * block_size),
	scale(mapScale),
	layer("game"),
	origin("center"),
	"planet",
	{
		realPos: [12 * block_size, 6 * block_size],
		startingPos: [12 * block_size, 6 * block_size],
		name: "red",
		passengers: [],
	},
]));

planetsVars.push(add([
	sprite("planetWhite"),
	area(),
	solid(),
	color(0, 0, 255),
	rotate(90),
	pos(15 * block_size, 40 * block_size),
	scale(mapScale),
	layer("game"),
	origin("center"),
	"planet",
	{
		realPos: [
			15 * block_size,
			20 * block_size],
		startingPos: [15 * block_size, 20 * block_size],
		name: "blue",
		passengers: [],
		size: 1,
	},
]));

planetsVars.push(add([
	sprite("planetWhite"),
	area(),
	solid(),
	color(0, 255, 0),
	rotate(90),
	pos(
		15 * block_size,
		40 * block_size),
	scale(mapScale),
	layer("game"),
	origin("center"),
	"planet",
	{
		realPos: [
			7 * block_size,
			12 * block_size],
		startingPos: [
			7 * block_size,
			12 * block_size],
		name: "green",
		passengers: [],
		size: 1,
	},
]));

// The player
const player = add([
	sprite("ship_1"),
	pos(width() / 2, height() / 2),
	rotate(0),
	scale(2),
	area(),
	layer("game"),
	origin("center"),
	"player",
	{
		speed: 0,
		max_thrust: 400,
		acceleration: 2.5,
		deceleration: 4,
		animation_frame: 0,
		money: 100,
		// capacityMax: 6,
		capacity: 10,
		passengers: [],
		realPos: [0, 0],
		onPlanet: false,
		startingPos: [width() / 2, height() / 2],
		passengersSprite: [],
		planetAt: "home",
		anim: "thrust",
		loadSpeed: 600,
	}
]);
player.play("thrust");
// The arrow
const movementArrow = add([
	sprite("arrow"),
	pos(40, 80),
	rotate(0),
	// scale(2),
	layer("game"),
	origin("center"),
	"arrow",
	{
		animation_frame: 0,
	}
]);

//ui
//planet indicator
let textLeftModifer = width()/1000;
let textLeftModiferHeight = width()*.025;
add([
	text("Planet: ", 8),
	scale(fontSize*textLeftModifer),
	pos(5, 50),
	origin("topleft"),
	layer("ui"),
]);

const planetText = add([
	text(player.planetAt, 8),
	scale(fontSize*textLeftModifer),
	pos(120*textLeftModifer, 50+textLeftModiferHeight*0),
	origin("topleft"),
	layer("ui"),
]);

//money indicator
add([
	text("Money:", 8),
	scale(fontSize*textLeftModifer),
	pos(5, 50+textLeftModiferHeight*1),
	origin("topleft"),
	layer("ui"),
]);

const moneyText = add([
	text(player.money, 8),
	scale(fontSize*textLeftModifer),
	pos(100*textLeftModifer, 50+textLeftModiferHeight*1),
	origin("topleft"),
	layer("ui"),
]);

//speed
add([
	text("Speed: ", 8),
	scale(fontSize*textLeftModifer),
	pos(5, 50+textLeftModiferHeight*2),
	origin("topleft"),
	layer("ui"),
]);

const speedText = add([
	text(player.speed, 8),
	scale(fontSize*textLeftModifer),
	pos(100*textLeftModifer, 50+textLeftModiferHeight*2),
	origin("topleft"),
	layer("ui"),
]);

//capacity

add([
	text("Capacity:", 8),
	scale(fontSize*textLeftModifer),
	pos(5, 50+textLeftModiferHeight*3),
	origin("topleft"),
	layer("ui"),
]);

const capacityText = add([
	text(player.capacity, 8),
	scale(fontSize*textLeftModifer),
	pos(150*textLeftModifer, 50+textLeftModiferHeight*3),
	origin("topleft"),
	layer("ui"),
]);
//passengers
add([
	text("Passengers:", 8),
	scale(fontSize*textLeftModifer),
	pos(5, 50+textLeftModiferHeight*4),
	origin("topleft"),
	layer("ui"),
]);

//store 
const storeBg = add([
	area(),
	solid(),
	color(50,50,50),
	opacity(0),
	pos(
		0,
		0),
	rect(width(), height()),
	scale(mapScale),
	layer("store"),
	origin("topleft"),
	{
		storeOpen: false,
	},
]);

//buttons at planets
//store button
const storeButton = add([
	area(),
	solid(),
	color(28,71,88),
	opacity(0),
	pos(
		width()-20,
		20),
	// text("Store"),
	rect(width()/6, width()/1000*50),
	scale(mapScale),
	layer("store"),
	origin("topright"),
	"button",
	"atPanetUi",
	"storeButton",
	{

	},
]);

const storeText = add([
  text("Store"),
  pos(240, 180),
  // color(0, 0, 0),
	layer("store"),
	scale(width()/1000*3*fontSize),
	origin("topright"),
	"atPanetUi",
	"storeButton",
	pos(
		width()-20,
		20),
	opacity(0),
]);

//Todo Add up and Down Arrow or mouse scorll to store


//launch button 
// const launchButton = add([
// 	area(),
// 	solid(),
// 	color(28,71,88),
// 	opacity(0),
// 	pos(
// 		width()-20,
// 		20+20+(width()/1000*50*mapScale)),
// 	// text("Store"),
// 	rect(width()/6, width()/1000*50),
// 	scale(mapScale),
// 	layer("ui"),
// 	origin("topright"),
// 	"button",
// 	"launchButton",
// 	"atPanetUi",
// 	{

// 	},
// ]);

// add([
//   text("Launch!\n(click)"),
//   pos(240, 180),
//   // color(0, 0, 0),
// 	"atPanetUi",
// 	layer("ui"),
// 	scale(width()/1000*1.8*fontSize),
// 	origin("topright"),
// 	"launchButton",
// 	//make reletive position better
// 	pos(
// 		width()-0-width()/24,
// 		40+width()/1000*50*mapScale),
// 	opacity(0),
// ]);
let storeData = [{
		name:"Upgrade Capacity",
		id:0,
		amountBought:0,
		cost: 50,
		functionToRun: () => {
			player.capacity = Math.round(player.capacity+2);
		},
	},{
		name:"Upgrade Max Speed",
		id:1,
		amountBought:0,
		cost: 200,
		functionToRun: () => {
			player.max_thrust += 20;
		},
	},{
		name:"Upgrade Acceleration",
		id:2,
		amountBought:0,
		cost: 200,
		functionToRun: () => {

		},
	},{
		name:"Upgrade Fill Speed",
		id:3,
		amountBought:0,
		cost: 300,
		functionToRun: () => {
			player.loadSpeed = Math.round(player.loadSpeed*1.5);
		},
	},{
		name:"Unlock Planet",
		id:4,
		amountBought:0,
		cost: 500,
		functionToRun: () => {

		},
	},{
		name:"Upgrade Fire Rate",
		id:5,
		amountBought:0,
		cost: 500,
		functionToRun: () => {

		},
},];
let storeButtonSprites = [];
//gereate store item
function genStoreItems() {
	for(let i = 0; i < storeData.length; i++){
		storeButtonSprites.push({bg:
			add([
				area(),
				solid(),
				color(255,165,0),
				pos(
					width()/2,
					15+i*(width()/1000*100+30)),
				rect(width()/3, width()/1000*100),
				layer("store"),
				origin("top"),
				"button",
				"inStoreButton",
				"inStoreButtonBg",
				{
					idbuy:i,
					functionToRun: storeData[i].functionToRun,
				},
			]),
			title:  add([
				text(storeData[i].name),
				// color(0, 0, 0),
				layer("store"),
				origin("top"),
				scale(width()/1000*2),
				"inStoreButton",
				pos(
					width()/2,
					20+i*(width()/1000*100+30)),
			]),
			boughtTextDis: add([
				text("bought:"),
				// color(0, 0, 0),
				layer("store"),
				origin("topleft"),
				scale(width()/1000*2),
				"inStoreButton",
				pos(
					width()/2-(width()/6)+5,
					15+width()/1000*35+i*(width()/1000*100+30)),
			]),
			boughtText: add([
				text(storeData[i].amountBought),
				// color(0, 0, 0),
				layer("store"),
				origin("topleft"),
				scale(width()/1000*2),
				"inStoreButton",
				pos(
					width()/2-(width()/24),
					15+width()/1000*35+i*(width()/1000*100+30)),
			]),
			costText: add([
				text("cost:"),
				// color(0, 0, 0),
				layer("store"),
				origin("topleft"),
				scale(width()/1000*2),
				"inStoreButton",
				pos(
					width()/2-(width()/6)+5,
					15+2*width()/1000*35+i*(width()/1000*100+30)),
			]),
			cost: add([
				text(genPrice(storeData[i].cost,storeData[i].amountBought)),
				// color(0, 0, 0),
				layer("store"),
				origin("topleft"),
				scale(width()/1000*2),
				"inStoreButton",
				pos(
					width()/2-(width()/24),
					15+2*width()/1000*35+i*(width()/1000*100+30)),
			]),
			}
		);
	}
}


function showStore(){
	if(!storeBg.storeOpen){
		storeBg.opacity = .8;
		storeBg.storeOpen = true;

		storeText.text = "Game";
		genStoreItems();
	}
	else{
		storeBg.opacity = 0;
		storeBg.storeOpen = false;
		storeText.text = "Store";
		destroyAll("inStoreButton");
		storeButtonSprites = [];
	}
}

function planetUi(isOn){
	if(!isOn){
		every("atPanetUi", (uiEll) => {
			uiEll.opacity = 0;
		})
	}else{
		every("atPanetUi", (uiEll) => {
			uiEll.opacity = 1;
		})
	}
}

function arrowRotateFromMouse() {
	mouseRotationToSend = (Math.atan((mousePos().y - height() / 2) / (mousePos().x - width() / 2)) * 180 / Math.PI) - 90;
	if ((mousePos().x - width() / 2) >= 0) {
		mouseRotationToSend = (Math.atan((mousePos().y - height() / 2) / (mousePos().x - width() / 2)) * 180 / Math.PI) + 90;
	}
	return mouseRotationToSend;
}



// // Movement keys
// keyDown("a", () => {
//   playerMoveToo[0] = player.speed;
// });
// keyDown("d", () => {
//   playerMoveToo[0] = -1*player.speed;
// });

// keyDown("w", () => {
//   playerMoveToo[1] = player.speed;
// });

// keyDown("s", () => {
//   playerMoveToo[1] = -1*player.speed;
// });


//launch code
function launch() {
	if(storeBg.storeOpen){
		return;
	}
	if(player.onPlanet){
		player.speed = 1;
		player.onPlanet = false;
		planetUi(false);
		player.planetAt = "none";
		planetText.text = player.planetAt;
		every("onPlanetPass", (passa) => {
			destroy(passa)
		})
	}
}

//get space for lounch 
// keyDown("space", () => {
// 	// angleOfMovement = movementArrow.angle;
// 	launch()
	
// });

let storeButX = width()/6+width()-20;
// debug.log(storeButX)
let storeButY = width()/1000*50+40;
// debug.log(storeButY)
//get click for lounch 
mouseClick( () => {
	// debug.log(mousePos().y +"+"+mousePos().x)
	if((mousePos().x < storeButX && mousePos().y >storeButY)){
		launch()
	}
	// angleOfMovement = movementArrow.angle;

});
//get launch from button ui
// launchButton.clicks( () => {
// 	launch()
// })
function genPrice(cost, time){
	return Math.round(cost**(((time+20)/20)));
}

//Clicks button in the store run sthe function
clicks("inStoreButtonBg", (button) => {
	if(player.money >= genPrice(storeData[button.idbuy].cost,storeData[button.idbuy].amountBought)){
		player.money -= genPrice(storeData[button.idbuy].cost,storeData[button.idbuy].amountBought);
		storeData[button.idbuy].functionToRun();
		storeData[button.idbuy].amountBought++;
		moneyText.text = player.money;
		destroyAll("inStoreButton");
		storeButtonSprites = [];
		genStoreItems();
	}else{
		shake();
	}
  // debug.log(button.idbuy);
});



storeButton.clicks( () => {
	showStore();
})
// action("button", b => {
//   if (b.isHovered()){
// 		b.use(color(0.7, 0.7, 0.7));
// 	}else{
// 		b.use(color(1, 1, 1));
// 	}


// 	}
// );

// arrow indicator
movementArrow.action(() => {
	movementArrow.angle = arrowRotateFromMouse();
	movementArrow.pos.x = width() / 2 + (Math.sin(movementArrow.angle * (Math.PI / 180))) * 60;
	movementArrow.pos.y = height() / 2 + (-1 * Math.cos(movementArrow.angle * (Math.PI / 180))) * 60;
	// e.resolve();
});

// map.action(() => {
// 	map.pos = playerGlobalPosition;

// });

function moveToSlow(x, y, objToMove, speed, delAfter) {
	let moveAmountX = -1 * (objToMove.pos.x - x) / speed;
	// debug.log(moveAmountX)
	let moveAmountY = -1 * (objToMove.pos.y - y) / speed;
	let timerreset = 0;
	let intervalID = setInterval(function() {
		objToMove.pos.x += moveAmountX;
		objToMove.pos.y += moveAmountY;
		if (++timerreset === speed) {
			if (delAfter) {
				objToMove.destroy();
				// player.passengersSprite.splice(index,1);

			}
			window.clearInterval(intervalID);
		}
	}, 10);
}

//reformats the passengers on the ship after people go home
function refomatePassOnShip() {
	every("onShipPass", (todestroy) => {
		if (!todestroy.moving) {
			todestroy.destroy();
		}
	});
	// debug.log(player.passengers.length)
	for (let i = 0; i < player.passengers.length; i++) {
		let newPassDataShip = player.passengers[i]
		player.passengersSprite.push(add([
			sprite(newPassDataShip.sprite),
			// debug.log((i+1) % 6 * 30 + 15),
			pos((i) % 6 * 30 + 15, 50+textLeftModiferHeight*5 + (Math.floor(i / 6) + 1) * 20),
			color(newPassDataShip.color[0], newPassDataShip.color[1], newPassDataShip.color[2]),
			origin("center"),
			area(),
			layer("game"),
			"passenger",
			"onShipPass",
			{
				moving: false,
			}
		]));
	}

}

player.collides("planet", (planet) => {
	// debug.log("yo");
	if (player.onPlanet) {
		return
	}
	player.speed = 0;

	//why did -1 work
	move(-1 * planet.startingPos[0] + width() / 2, -1 * planet.startingPos[1] + height() / 2, 10);
	player.onPlanet = true;
	//update planet
	player.planetAt = planet.name;
	planetText.text = player.planetAt;

	// debug.log(player.planetAt)


	//add planet ui, store button
	planetUi(true);
	//move pass to ship


	if (planets.includes(player.planetAt)) {
		//move ship pass to planet
		let playerPassesToRemove = [];
		for (let i = 0; i < player.passengers.length; i++) {
			if (player.passengers[i].destanation == player.planetAt) {
				moveToSlow(width() / 2, height() / 2, player.passengersSprite[i], 25, true);
				player.passengersSprite[i].moving = true;
				playerPassesToRemove.push(i);
				player.money += 50;
				moneyText.text = player.money;

			}
		}

		for (let i = playerPassesToRemove.length - 1; i >= 0; i--) {
			console.log(player.passengers.splice(playerPassesToRemove[i], 1));


		}
		player.passengersSprite = []
		refomatePassOnShip();
		player.capacity += playerPassesToRemove.length;

		for (let i = 0; i < planetsVars[planets.indexOf(player.planetAt)].passengers.length; i++) {
			let newPassData = planetsVars[planets.indexOf(player.planetAt)].passengers[i]
			add([
				sprite(newPassData.sprite),

				pos(width() / 2 + 50 + i * 30, height() / 2),
				color(newPassData.color[0], newPassData.color[1], newPassData.color[2]),
				origin("center"),
				area(),

				layer("game"),
				"passenger",
				"onPlanetPass",
			]);
		}
	}
});


//move passengers into ship
action("onPlanetPass", (passenger) => {
	if (player.capacity > 0) {
		passenger.move(dir(180).scale(player.loadSpeed*dt()*40))
		// passenger.pos.x -= passengerMoveSpeed*dt()*100;
	}

});

player.collides("onPlanetPass", (passenger) => {
	// debug.log("asdf")
	//update player object
	player.passengers.push(planetsVars[planets.indexOf(player.planetAt)].passengers[0])
	player.capacity -= 1;
	capacityText.text = player.capacity
	//render in passengerarea

	//reneder for pass in ship
	let newPassDataShip = player.passengers[player.passengers.length - 1]
	player.passengersSprite.push(add([
		sprite(newPassDataShip.sprite),

		pos((player.passengers.length - 1) % 6 * 30 + 15, 50+textLeftModiferHeight*5 + (Math.floor((player.passengers.length - 1) / 6) + 1) * 20),
		color(newPassDataShip.color[0], newPassDataShip.color[1], newPassDataShip.color[2]),
		origin("center"),
		area(),
		layer("game"),
		"passenger",
		"onShipPass",
		{
			moving: false,
		}
	]));

	//remove passenger from planet
	passenger.destroy()
	planetsVars[planets.indexOf(player.planetAt)].passengers.shift()


	//generate and render new passenger


	generatepassengers(planetsVars[planets.indexOf(player.planetAt)], 1)
	let newPassData = planetsVars[planets.indexOf(player.planetAt)].passengers[planetsVars[planets.indexOf(player.planetAt)].passengers.length - 1]
	add([
		sprite(newPassData.sprite),

		pos(width() / 2 + 50 + 10 * 30, height() / 2),
		color(newPassData.color[0], newPassData.color[1], newPassData.color[2]),
		origin("center"),
		area(),
		layer("game"),
		"passenger",
		"onPlanetPass"
	]);

});

// collides("planet", "player", () => {

// });

// track distance to count fuel


//calcualte real position
let calcRealPos = obj => {
	obj.realPos[0] += (-1 * Math.sin(angleOfMovement * (Math.PI / 180)) * player.speed*dt());
	obj.realPos[1] += (Math.cos(angleOfMovement * (Math.PI / 180)) * player.speed*dt());
	// debug.log(obj.realPos[0])
	// debug.log(obj.realPos[1])
	if (obj.realPos[0] >= (numberOfBackTiles / 2 * block_size)) {
		obj.realPos[0] = obj.realPos[0] - (numberOfBackTiles * block_size)
	};

	if (obj.realPos[1] >= (numberOfBackTiles / 2 * block_size)) {
		obj.realPos[1] = obj.realPos[1] - (numberOfBackTiles * block_size)
	};

	if (obj.realPos[0] <= -1 * (numberOfBackTiles / 2 * block_size)) {
		obj.realPos[0] = obj.realPos[0] + (numberOfBackTiles * block_size)
	};

	if (obj.realPos[1] <= -1 * (numberOfBackTiles / 2 * block_size)) {
		obj.realPos[1] = obj.realPos[1] + (numberOfBackTiles * block_size)
	};
}

// need a move function this isnt working
let move = (x, y, slow) => {
	let moveAmountX = (x - player.realPos[0]) / slow
	player.realPos[0] = x
	let moveAmountY = (y - player.realPos[1]) / slow
	player.realPos[1] = y

	// every("background", (background) => {
	// 	// debug.log(background.startingPos[0])
	// 	background.pos.x += moveAmountX;
	// 	background.pos.y += moveAmountY;
	// 	// debug.log(background.startingPos[0])
	// })
	// every("planet", (planet) => {
	// 	// planet.pos.x = planet.startingPos[0] + x;
	// 	// planet.pos.x = planet.startingPos[1] + y;
	// 	planet.realPos[0] += moveAmountX;
	// 	planet.realPos[1] += moveAmountY;

	// })
	let timerreset = 0;
	let intervalID = setInterval(function() {
		every("background", (background) => {
			// debug.log(background.startingPos[0])
			background.pos.x += moveAmountX;
			background.pos.y += moveAmountY;
			// debug.log(background.startingPos[0])
		})
		every("planet", (planet) => {
			// planet.pos.x = planet.startingPos[0] + x;
			// planet.pos.x = planet.startingPos[1] + y;
			planet.realPos[0] += moveAmountX;
			planet.realPos[1] += moveAmountY;

		})
		if (++timerreset === slow) {
			window.clearInterval(intervalID);
		}
	}, 10);
}

action("background", (background) => {
	background.pos.x += (-1 * Math.sin(angleOfMovement * (Math.PI / 180)) * player.speed*dt());
	background.pos.y += (Math.cos(angleOfMovement * (Math.PI / 180)) * player.speed*dt());
	if (background.pos.x >= (numberOfBackTiles / 2 * block_size) + width() / 2) {
		background.pos.x = background.pos.x - (numberOfBackTiles * block_size)
	} else if (background.pos.x <= -1 * (numberOfBackTiles / 2 * block_size) + width() / 2) {
		background.pos.x = background.pos.x + (numberOfBackTiles * block_size)
	}
	if (background.pos.y >= (numberOfBackTiles / 2 * block_size) + height() / 2) {
		background.pos.y = background.pos.y - (numberOfBackTiles * block_size)
	} else if (background.pos.y <= -1 * (numberOfBackTiles / 2 * block_size) + height() / 2) {
		background.pos.y = background.pos.y + (numberOfBackTiles * block_size)
	}


	// background.pos.x = background.pos.x % (26 * block_size);
	// background.pos.y = background.pos.y % (26 * block_size);
});

action("planet", (planet) => {
	calcRealPos(planet);

	if (planet.realPos[0] <= 0) {
		planet.pos.x = 0;
	} else if (planet.realPos[0] >= width()) {
		planet.pos.x = width();
	} else {
		planet.pos.x = planet.realPos[0];
	};

	if (planet.realPos[1] <= 0) {
		planet.pos.y = 0;
	} else if (planet.realPos[1] >= height()) {
		planet.pos.y = height();
	} else {
		planet.pos.y = planet.realPos[1];
	};

	// debug.log(planet.pos.x !== planet.realPos[0] || planet.pos.y !== planet.realPos[1])
	if (planet.pos.x !== planet.realPos[0] || planet.pos.y !== planet.realPos[1]) {
		planet.scaleTo(mapScale / 2);
	} else {
		planet.scaleTo(mapScale);
	}


});

function sum(a, offset) {
	var s = a[0] + a[1] * offset
	return s;
}

function degToRad(a) {
	return Math.PI / 180 * a;
}

function meanAngleDeg(a, offset) {
	return 180 / Math.PI * Math.atan2(
		sum(a.map(degToRad).map(Math.sin), offset) / (offset + 1),
		sum(a.map(degToRad).map(Math.cos), offset) / (offset + 1)
	);
}


action("player", () => {
	if (player.speed > 0) {
		player.speed = Math.min(player.speed + player.acceleration, player.max_thrust);
	}
	speedText.text = Math.round(player.speed);
	//new movement system
	// debug.log(angleOfMovement)
	//does the dt work?
	angleOfMovement = meanAngleDeg([movementArrow.angle, angleOfMovement],.3/dt());
	// debug.log(Math.round(.3/dt()))
	player.angle = angleOfMovement;
	calcRealPos(player)
	// debug.log(player.realPos)

})

function generatepassengers(planet, ammount) {

	if (planets.includes(planet.name)) {
		// debug.log(planets)
		let otherPlanets = planets.slice();
		// debug.log(planet.name)
		otherPlanets.splice(planets.indexOf(planet.name), 1)
		// if(planet.name == "red"){
		// 	debug.log(otherPlanets)
		// }
		// debug.log(otherPlanets)
		for (let i = 0; i < ammount; i++) {

			let generatedPassId = Math.floor(Math.random() * otherPlanets.length);
			let genPassColor = (0, 0, 0);
			let genPassSprite = "passenger";

			switch (otherPlanets[generatedPassId]) {
				case "white":
					genPassColor = [255, 255, 255];
					break;
				case "blue":
					genPassColor = [0, 0, 255];
					break;
				case "red":
					genPassColor = [255, 0, 0];
					break;
				case "green":
					genPassColor = [0, 255, 0];
					break;
			}
			planet.passengers.push({
				destanation: otherPlanets[generatedPassId],
				color: genPassColor,
				sprite: genPassSprite,
			})
			// if(planet.name == "blue"){
			// 	debug.log(planet.name)
			// 	debug.log(planet.passengers[i].destanation)
			// 	debug.log(generatedPassId)
			// 	debug.log(otherPlanets)
			// 	debug.log(otherPlanets[generatedPassId])
			// }
		}
	}

}

let onStart = () => {
	every("background", (background) => {
		background.startingPos[0] = background.pos.x;
		background.startingPos[1] = background.pos.y;
	})
	every("planet", (planet) => {
		generatepassengers(planet, 10)
	})
	move(width() / 2, height() / 2, 1)
}

onStart()