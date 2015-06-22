var io = require( './socket.io/' ).listen( 1337 );

var user1 = {
	id : 0,
	ready : false,
	shipsLogged : 0
};
var user2 = {
	id : 0,
	ready : false,
	shipsLogged : 0
};

/*
	0 empty
	1 miss hit
	2 ship safe
	3 ship hit
 */
var board1 = clearBoard();
var board2 = clearBoard();

var turn = 1;

function clearBoard()
{
	var temp = new Array( 10 );
	for( var i = 0; i < 10; i++ )
	{
		temp[ i ] = new Array( 10 );
		for( var j = 0; j < 10; j++ )
		{
			temp[ i ][ j ] = 0;
		}
	}
	return temp;
}

io.sockets.on( 'connection', function( socket )
{
	socket.on( 'register', function( data )
	{
		console.log( data.id );
		if( user1 != 0 )
		{
			user2.id = data.id;
		}
		else
		{
			user1.id = data.id;
		}

		if( user1 != 0 && user2 != 0 )
		{
			socket.broadcast.emit( 'ready' );
			socket.emit( 'ready' );
		}
	});

	socket.on( 'logShip', function( data )
	{
		for( var i = 0; i < data.entry.length; i++ )
		{
			var split = data.entry[ i ].split( "-" );
			if( data.id == user1.id )
			{
				board1[ split[0] ][ split[ 1] ] = 2;
				if( user1.shipsLogged < 30 )
				{
					user1.shipsLogged++;
					user1.ready = true;
				}
			}
			else
			{
				board2[ split[0] ][ split[ 1] ] = 2;
				if( user2.shipsLogged < 30 )
				{
					user2.shipsLogged++;
				}
				else
				{
					user2.ready = true;
				}
			}
		}

		console.log( board1 );

		console.log( board2 );
	});

	socket.on( 'shoot', function( data )
	{
		console.log( data.id + " shot " );

		turn = data.user == user1.id ? 2 : 1;

		data.id = data.id.replace( 'e', '' );

		socket.broadcast.emit( 'shoot', data );

		if( PlayerShoot( data.user, data.id ) )
		{
			socket.emit( 'shoot', { type : 'hit', id : "e" + data.id } );
		}
		else
		{
			socket.emit( 'shoot', { type : 'miss', id : "e" + data.id  } )
		}
	});

	socket.on( 'quit', function( data )
	{
		if( data.id == user1 )
		{
			user1 = 0;
			board1 = clearBoard();
		}
		else
		{
			user2 = 0;
			board2 = clearBoard();
		}
		console.log( "quit" );
	});
});

function PlayerShoot( player, coordinates )
{
	var exploded = coordinates.split( '-' );
	var x = exploded[ 0], y = exploded[ 1 ];

	if( player == user1.id )
	{
		switch( board1[ x ][ y ] )
		{
			case 0:
			case 1:
				board1[ x ][ y ] = 1;
				return false;
			case 2:
				board1[ x ][ y ] = 3;
				return true;
			default:
				return true;
		}
	}
	else
	{
		switch( board2[ x ][ y ] )
		{
			case 0:
			case 1:
				board2[ x ][ y ] = 1;
				return false;
			case 2:
				board2[ x ][ y ] = 3;
				return true;
			default:
				return true;
		}
	}
}