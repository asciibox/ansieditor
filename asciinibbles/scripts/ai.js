function setStartBlocks(player , currentPath) {
			var debug="";
			var x = players[player].nibbleX;
			var y = players[player].nibbleY;
		    playerDirection=players[player].direction;
			
			if (playerDirection=="up")
			{
				startBlocks.push(player, y+1, x);
				if (dolog) drawOnGrid(new Array(255, 255, 255), x, y+1, false);
				startBlocks.push(player, y, x-1);
				if (dolog) drawOnGrid(new Array(255, 255, 255), x-1, y, false);
				startBlocks.push(player, y, x+1);
				if (dolog) drawOnGrid(new Array(255, 255, 255), x+1, y, false);
			} else
			if (playerDirection=="down")
			{
				startBlocks.push(player, y-1, x);
				if (dolog) drawOnGrid(new Array(255, 255, 255), x, y-1, false);
				startBlocks.push(player, y, x-1);
				if (dolog) drawOnGrid(new Array(255, 255, 255), x-1, y, false);
				startBlocks.push(player, y, x+1);
				if (dolog) drawOnGrid(new Array(255, 255, 255), x+1, y, false);
			} else
			if (playerDirection=="left")
			{
				
				startBlocks.push(player, y, x+1);
				if (dolog) drawOnGrid(new Array(255, 255, 255), x+1, y, false);
				startBlocks.push(player, y-1, x);
				if (dolog) drawOnGrid(new Array(255, 255, 255), x, y-1, false);
				startBlocks.push(player, y+1, x);
				if (dolog) drawOnGrid(new Array(255, 255, 255), x, y+1, false);
			} else
			if (playerDirection=="right")
			{
				startBlocks.push(player, y, x-1);
				if (dolog) drawOnGrid(new Array(255, 255, 255), x-1, y, false);
				startBlocks.push(player, y-1, x);
				if (dolog) drawOnGrid(new Array(255, 255, 255), x, y-1, false);
				startBlocks.push(player, y+1, x);
				if (dolog) drawOnGrid(new Array(255, 255, 255), x, y+1, false);
			}
	}

function calculateBlocksAhead(currentPlayer) 
{	
	var white=Array(255, 255, 255);
	var alternateColor=Array(255, 192, 192);
	var alternateColor2=Array(255, 128, 128);
	
	calculatedBlocksAhead=new Array();
	// Taking the actual player, check if there are any blocks in the way. For this we have to go through all other players and calculate
	// their direction. Taking their direction, we set blocks which are going to be in the way in case the other player is going to go on on his path.
    for (var player = 0; player < players.length; player++) {
							var color = white;
							var playerX = players[player].nibbleX;
							var playerY = players[player].nibbleY;
							
							if (players[player].direction=="left")
							{
								var stillToGo=3;
								if (players[currentPlayer].nibbleX>playerX)
								{
									stillToGo=playerX;
								}

								//console.log(stones[0].y+"=="+playerY);
								if (stones[0].y==playerY)
								{
									color=alternateColor;
									if (stones[0].x<playerX)
									{
										stillToGo=stones[0].x-playerX-1;
										color=alternateColor2;
									}
								}
								
								for (var i = playerX-stillToGo; i < playerX ; i++ )
								{
									if (doshowblocks)
									if ( (playerX!=i) && (playerY!=stones[0].y) )
									{
									drawOnGrid(color, i, playerY, false);
									}
									calculatedBlocksAhead.push(i, playerY);									
								}
							} else
							if (players[player].direction=="right")
							{
								var stillToGo=3;
								if (players[currentPlayer].nibbleX<playerX)
								{
									stillToGo=width-playerX;
								}

								if (stones[0].y==playerY)
								{
									color=alternateColor;
									if (stones[0].x>playerX)
									{
										stillToGo=stones[0].x-playerX-1;
										color=alternateColor2;
									}
								}

								for (var i = playerX; i < playerX+stillToGo ; i++ )
								{
									if (doshowblocks)
									if ( (playerX!=i) && (playerY!=stones[0].y) )
									{
									drawOnGrid(color, i, playerY, false);
									
									}
									calculatedBlocksAhead.push(i, playerY);
									
								}								
							} else
							if (players[player].direction=="down")
							{
								var stillToGo=3;
								if (players[currentPlayer].nibbleY<playerY)
								{
									stillToGo=height-playerY;
								}

								if (stones[0].x==playerX)
								{
									color=alternateColor;
									if (stones[0].y>playerY)
									{
										stillToGo=stones[0].y-playerY-1;
										color=alternateColor2;
									}
								}

								for (var i = playerY; i < playerY+stillToGo; i++ )
								{
									if (doshowblocks)
									if ( (playerX!=stones[0].x) && (i!=stones[0].y) )
									{
									drawOnGrid(color, playerX, i, false);
									
									}
									calculatedBlocksAhead.push(playerX, i);
									
								}								
							} else
							if (players[player].direction=="up")
							{
								var stillToGo=3;
								if (players[currentPlayer].nibbleY>playerY)
								{
									stillToGo=playerY;
								}

								if (stones[0].y==playerY)
								{
									color=alternateColor;
									if (stones[0].y<playerY)
									{
										stillToGo=stones[0].y-playerY-1;
										color=alternateColor2;
									}
								}

								for (var i = playerY-stillToGo; i < playerY ; i++ )
								{
									if (doshowblocks)
									if ( (playerX!=stones[0].x) && (i!=stones[0].y) )
									{
									drawOnGrid(color, playerX, i, false);
									}
									calculatedBlocksAhead.push(playerX, i);
									
								}								
							}
    }
	
}