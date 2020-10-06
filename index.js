const {app, BrowserWindow} = require('electron');
const {default: SlippiGame} = require('@slippi/slippi-js');
const util = require('util')
const moment = require('moment');
const path = require('path');
const _ = require('lodash');
const fs = require('fs');
const { getStats } = require('./stats.js');

const diffStats=["damage","dOpen","openK","nWins","cHits","apm","move","kill"];
const fullStats=["totalDamage","avgDamagePerOpening","avgOpeningsPerKill","neutralWins","counterHits","avgApm","favoriteMove","favoriteKillMove"];
var numGames;
var gamePaths=[];
var stats;

if (app !== undefined) {
    app
        .on('ready', function () {
            let win = new BrowserWindow({
                webPreferences: {
                    nodeIntegration: true
                }
            });
            win.loadURL(`file://${__dirname}/index.html`);
        });
}

function copyFiles(){
	document.getElementById("init").hidden=true;
	document.getElementById("container").hidden=false;
	let files = document.getElementById("setIn").files;
	numGames = files.length;
	for(let i of files){
		gamePaths.push(i.path);
	}
	stats=getStats(gamePaths);
	setHtml();
}

function setHtml(){
	document.getElementById("code0").innerHTML=stats.players[0].rollbackCode;
	document.getElementById("code1").innerHTML=stats.players[1].rollbackCode;
	document.getElementById("winner").src="./Saga-Icons/"+stats.sagaIcon+".png";
	document.getElementById("char0").src="./Characters/"+stats.players[0].character.characterName+"/"+stats.players[0].character.color+".png";
	document.getElementById("char1").src="./Characters/"+stats.players[1].character.characterName+"/"+stats.players[1].character.color+".png";
	for(let i=0;i<6;i++){
		document.getElementById(diffStats[i]+"0").innerHTML=Math.round(stats.playerStats[0][fullStats[i]]);
		document.getElementById(diffStats[i]+"1").innerHTML=Math.round(stats.playerStats[1][fullStats[i]]);
	}
	document.getElementById("move0").innerHTML=stats.playerStats[0].favoriteMove.moveName;
	document.getElementById("move0times").innerHTML=stats.playerStats[0].favoriteMove.timesUsed;
	document.getElementById("move1").innerHTML=stats.playerStats[1].favoriteMove.moveName;
	document.getElementById("move1times").innerHTML=stats.playerStats[1].favoriteMove.timesUsed;
	document.getElementById("kill0").innerHTML=stats.playerStats[0].favoriteKillMove.moveName;
	document.getElementById("kill0times").innerHTML=stats.playerStats[0].favoriteKillMove.timesUsed;
	document.getElementById("kill1").innerHTML=stats.playerStats[1].favoriteKillMove.moveName;
	document.getElementById("kill1times").innerHTML=stats.playerStats[1].favoriteKillMove.timesUsed;
	setStages();
}

function setStages(){
	var widthSet=document.getElementById("gameCount").offsetWidth/2;
	widthSet-=(stats.totalGames-3)*50;
	widthSet-=112;
	let i=0;
	for(i=0;i<stats.totalGames;i++){
		let img=document.createElement("img");
		img.id="stage"+i;
		document.getElementById("games").append(img);
		var imgSet=document.getElementById("stage"+i);
		imgSet.src="./Stage-Icons/"+stats.games[i].stage+".png";
		imgSet.width=100;
		imgSet.height=100;
		let counts=document.createElement("span");
		counts.id="gameCount"+i;
		document.getElementById("gameCount").append(counts);
		var countSet=document.getElementById("gameCount"+i);
		countSet.innerHTML=(i+1);
		countSet.style="text-align:center;position:absolute;left:"+(widthSet+5.1)+"px";
		let wins=document.createElement("span");
		wins.id="gameWin"+i;
		wins.style="text-align:center;position:absolute;left:"+widthSet+"px";
		let winImg=document.createElement("img");
		winImg.id="winPic"+i;
		wins.append(winImg);
		document.getElementById("wins").append(wins);
		var winSet=document.getElementById("gameWin"+i);
		winSet.width="100px";
		var picSet=document.getElementById("winPic"+i);
		picSet.src="./Stock-Icons/"+stats.games[i].winner.character.characterName+"/"+stats.games[i].winner.character.color+".png";
		widthSet+=100;
	}
}

function aspectRatio(){
	let body=document.getElementsByTagName("body")[0];
	let arr=reduce(body.offsetWidth,body.offsetHeight); 
	return ""+arr[0]+":"+arr[1];
}

function reduce(numerator,denominator){
  var gcd = function gcd(a,b){
    return b ? gcd(b, a%b) : a;
  };
  gcd = gcd(numerator,denominator);
  return [numerator/gcd, denominator/gcd];
}